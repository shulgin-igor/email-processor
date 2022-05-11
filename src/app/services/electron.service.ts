import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  constructor() {}

  get importProgress$(): Observable<any> {
    const subj = new Subject();

    // TODO: set type
    window.electronAPI.onImportProgress((event: any, data: any) => {
      subj.next(data);

      if (data.processed === data.total) {
        subj.complete();
      }
    });

    return subj.asObservable();
  }

  openDirectoryPicker(): Observable<any> {
    return from(window.electronAPI.openDirectory());
  }

  getDirectories(ids: number[]): Observable<any> {
    return from(window.electronAPI.getDirectories(ids));
  }

  getFiles(directoryId: number): Observable<any> {
    return from(window.electronAPI.getFiles(directoryId));
  }

  openFile(emailId: number): Observable<any> {
    return from(window.electronAPI.openFile(emailId));
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
