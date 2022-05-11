import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Directory } from '../interfaces/Directory';

@Injectable({
  providedIn: 'root',
})
export class DirectoryService {
  private selectedDirectory: BehaviorSubject<Directory> =
    new BehaviorSubject<Directory>(null);

  constructor() {}

  setDirectory(directory: Directory) {
    this.selectedDirectory.next(directory);
  }

  getSelectedDirectory(): Directory {
    return this.selectedDirectory.getValue();
  }

  getSelectedDirectory$(): Observable<Directory> {
    return this.selectedDirectory.asObservable();
  }

  clearSelectedDirectory() {
    this.selectedDirectory.next(null);
  }
}
