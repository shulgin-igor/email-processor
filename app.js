const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const EmlParser = require('eml-parser');
const { Sequelize, DataTypes } = require('sequelize');
const crypto = require('crypto');

const logStream = fs.createWriteStream('./db.log', { flags: 'a' });
const sequelize = new Sequelize('sqlite:./db.sqlite', {
  logging: msg => logStream.write(msg),
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
});

User.hasMany(Context);

sequelize.sync();

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

    return filePaths[0];
  }
}

async function handleGetFiles(event, directory, offset) {
  const files = fs.readdirSync(directory);

  const parsed = files
    .filter(f => /\.eml$/.test(f))
    .slice(offset, offset + 100) // TODO: make a constant
    .map(f => {
      let emailFile = fs.createReadStream(path.resolve(directory, f));

      return new EmlParser(emailFile).parseEml().then(data => {
        let messageId = data.messageId;

        if (!messageId) {
          const fileBuffer = fs.readFileSync(path.resolve(directory, f));
          const hashSum = crypto.createHash('sha256');

          hashSum.update(fileBuffer);

          messageId = hashSum.digest('hex');
        }

        return Email.findOne({ where: { messageId } }).then(
          exists => {
            return {
              id: messageId,
              subject: data.subject,
              from: data.from?.value[0].address,
              fileName: f,
              processed: !!exists,
            };
          }
        );
      });
    });

  return Promise.all(parsed).then(data => ({
    items: data,
    hasMore: files.length > offset + 100, // TODO: use constant
  }));
}

async function handleFileOpen(event, filePath) {
  let emailFile = fs.createReadStream(filePath);

  const data = await new EmlParser(emailFile).parseEml();

  console.log(`From: ${data.from?.value.length}`);
  console.log(`To: ${data.to?.value.length}`);
  console.log(`CC: ${data.cc?.value.length}`);

  let from = null;
  let to = null;
  let cc = null;
  let messageId = data.messageId;

  if (data.from) {
    const userFrom = await User.findOne({
      where: { email: data.from.value[0].address },
    });

    from = {
      user: userFrom ? userFrom.toJSON() : null,
      address: data.from.value[0].address,
    };
  }

  if (data.to) {
    const userTo = await User.findOne({
      where: { email: data.to.value[0].address },
    });

    to = {
      user: userTo ? userTo.toJSON() : null,
      address: data.to.value[0].address,
    };
  }

  if (data.cc) {
    const userCc = await User.findOne({
      where: { email: data.cc.value[0].address },
    });

    cc = {
      user: userCc ? userCc.toJSON() : null,
      address: data.cc.value[0].address,
    };
  }

  if (!messageId) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');

    hashSum.update(fileBuffer);

    messageId = hashSum.digest('hex');
  }

  const processed = await Email.findOne({
    where: { messageId },
  });

  return {
    ...data,
    to,
    cc,
    from,
    id: messageId,
    fileName: filePath.split('/').pop(),
    processed: !!processed,
    attachments: data.attachments,
  };
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

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
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
