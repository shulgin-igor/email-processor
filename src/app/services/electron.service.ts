import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  constructor() {}

  openDirectoryPicker(): Observable<string> {
    return from(window.electronAPI.openDirectory());
  }

  getFiles(path: string, offset: number): Observable<any> {
    return from(window.electronAPI.getFiles(path, offset));
  }

  openFile(path: string): Observable<any> {
    return from(window.electronAPI.openFile(path));
  }

  saveUser(address: string, path: string): Observable<any> {
    return from(window.electronAPI.saveUser(address, path));
  }

  saveContext(userId: number, context: string): Observable<any> {
    return from(window.electronAPI.saveContext(userId, context));
  }

  removeFile(path: string): Observable<any> {
    return from(window.electronAPI.removeFile(path));
  }

  toggleProcessed(messageId: string, processed: boolean): Observable<any> {
    return from(window.electronAPI.toggleProcessed(messageId, processed));
  }
}
