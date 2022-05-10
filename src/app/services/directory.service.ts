import { Injectable } from '@angular/core';
import { Directory } from '../interfaces/Directory';
import { BehaviorSubject } from 'rxjs';

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

  getDirectory() {
    return this.selectedDirectory.getValue();
  }

  getDirectory$() {
    return this.selectedDirectory.asObservable();
  }

  clearDirectory() {
    this.selectedDirectory.next(null);
  }
}
