import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

declare global {
  interface Window {
    electronAPI: {
      openDirectory: () => Promise<string>;
      getFiles: (path: string, offset: number) => Promise<any>; // TODO: set type
      openFile: (path: string) => Promise<any>; // TODO: set type
      saveUser: (address: string, path: string) => Promise<any>; // TODO: set type
      removeFile: (path: string) => Promise<any>; // TODO: set type
      saveContext: (userId: number, context: string) => Promise<any>; // TODO: set type
      toggleProcessed: (messageId: string, processed: boolean) => Promise<any>; // TODO: set type
    };
  }
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
