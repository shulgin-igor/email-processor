const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { Sequelize, DataTypes } = require('sequelize');
const crypto = require('crypto');
const { promisify } = require('util');
const { MailParser } = require('mailparser');

const readdir = promisify(fs.readdir);

const logStream = fs.createWriteStream('./db.log', { flags: 'a' });
const sequelize = new Sequelize('sqlite:./db.sqlite', {
  logging: msg => logStream.write(`${msg}\n`),
});

let mainWindow;

const User = sequelize.define('User', {
  email: DataTypes.STRING,
  source: DataTypes.STRING,
});

const Context = sequelize.define('Context', {
  content: DataTypes.STRING,
});

const Email = sequelize.define('Email', {
  messageId: DataTypes.STRING,
  processed: DataTypes.BOOLEAN,
  subject: DataTypes.STRING,
  date: DataTypes.DATE,
  filename: DataTypes.STRING,
});

const Directory = sequelize.define('Directory', {
  path: DataTypes.STRING,
  imported: DataTypes.BOOLEAN,
});

User.hasMany(Context);
Email.belongsTo(Directory);

sequelize.sync();

async function handleDirectoriesList(event, ids) {
  const directories = await Directory.findAll({ where: { id: ids } });
  return directories.map(d => d.toJSON());
}

async function handleOpenDirectory() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  if (canceled) {
    return;
  } else {
    const files = fs.readdirSync(filePaths[0]);

    if (files.filter(f => /\.eml$/.test(f)).length === 0) {
      return;
    }

    let dirModel = await Directory.findOne({ where: { path: filePaths[0] } });

    if (!dirModel) {
      dirModel = await Directory.create({ path: filePaths[0] });
    }

    return dirModel.toJSON();
  }
}

async function handleGetFiles(event, directoryId) {
  const directory = await Directory.findByPk(directoryId);

  if (!directory.imported) {
    const files = await readdir(directory.path);
    const filtered = files.filter(f => /\.eml$/.test(f));
    let processed = 0;

    filtered.forEach((f, i, arr) => {
      getShortEmailInfo(path.resolve(directory.path, f), async info => {
        // TODO: check if exists
        processed++;
        Email.create({ ...info, filename: f, DirectoryId: directoryId });

        if (processed === arr.length) {
          await Directory.update(
            { imported: true },
            { where: { id: directoryId } }
          );
        }

        mainWindow.webContents.send('import:progress', {
          processed: processed,
          total: arr.length,
        });
      });
    });

    return { status: 'importing' };
  } else {
    const items = await Email.findAll({ where: { DirectoryId: directoryId } });
    return { status: 'success', items: items.map(i => i.toJSON()) };
  }
}

async function handleFileOpen(event, emailId) {
  const email = await Email.findByPk(emailId, { include: Directory });
  const data = await getFullEmailInfo(
    email.Directory.path + '/' + email.filename
  );

  const [from, to, cc] = await Promise.all(
    ['from', 'to', 'cc'].map(key => {
      if (!data[key]) {
        return [];
      }
      const addresses = data[key];

      return Promise.all(
        addresses.map(a =>
          User.findOne({
            where: { email: a },
          }).then(user => ({
            user: user ? user.toJSON() : null,
            address: a,
          }))
        )
      );
    })
  );

  return { ...data, ...email.toJSON(), from, to, cc };
}

async function handleUserSave(event, address, path) {
  const model = await User.create({ email: address, source: path });

  return model.toJSON();
}

async function handleFileRemove(event, filePath) {
  fs.unlinkSync(filePath);

  return true;
}

async function handleContextSave(event, userId, context) {
  const model = await Context.create({ UserId: userId, content: context });

  return model.toJSON();
}

async function handleToggleProcessed(event, messageId, processed) {
  if (processed) {
    return (await Email.create({ messageId })).toJSON();
  }
  return await Email.destroy({ where: { messageId } });
}

const getShortEmailInfo = (filePath, cb) => {
  const emailFile = fs.createReadStream(filePath);
  const emailInfo = {};
  const hashSum = crypto.createHash('sha256');

  emailFile.on('data', data => {
    hashSum.update(data);
  });

  emailFile
    .pipe(
      new MailParser({
        skipHtmlToText: true,
        skipTextToHtml: true,
      })
    )
    .on('headers', data => {
      emailInfo.subject = data.get('subject');
      emailInfo.date = data.get('date');
    })
    .on('data', data => {
      if (data.type === 'attachment') {
        data.release();
      }
    })
    .on('end', () => {
      emailInfo.messageId = hashSum.digest('hex');

      cb(emailInfo);
    });
};

const getFullEmailInfo = filePath => {
  return new Promise((resolve, reject) => {
    const emailFile = fs.createReadStream(filePath);
    const emailInfo = {
      attachments: [],
    };

    emailFile
      .pipe(new MailParser())
      .on('headers', data => {
        ['from', 'to', 'cc'].forEach(key => {
          const list = data.get(key);

          if (list) {
            emailInfo[key] = list.value.map(({ address }) => address);
          }
        });
      })
      .on('data', data => {
        if (data.type === 'attachment') {
          // TODO: process attachments
          const attachment = {
            filename: data.headers.get('content-disposition').params.filename,
            contentType: data.headers.get('content-type').value,
          };

          emailInfo.attachments.push(attachment);

          console.log(attachment)

          data.release();
        } else {
          // TODO: remove width
          emailInfo.content = data.html || data.textAsHtml;
        }
      })
      .on('error', () => reject())
      .on('end', () => {
        resolve(emailInfo);
      });
  });
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, `/dist/email-processor/index.html`));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  ipcMain.handle('directory:list', handleDirectoriesList);
  ipcMain.handle('directory:open', handleOpenDirectory);
  ipcMain.handle('directory:getFiles', handleGetFiles);
  ipcMain.handle('file:open', handleFileOpen);
  ipcMain.handle('user:save', handleUserSave);
  ipcMain.handle('file:remove', handleFileRemove);
  ipcMain.handle('context:save', handleContextSave);
  ipcMain.handle('email:toggleProcessed', handleToggleProcessed);

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
