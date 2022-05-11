import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DirectoryService } from 'src/app/services/directory.service';
import { ElectronService } from 'src/app/services/electron.service';
import { Directory } from '../../interfaces/Directory';
import { tap } from 'rxjs';

@Component({
  selector: 'app-directory-manager',
  templateUrl: './directory-manager.component.html',
  styleUrls: ['./directory-manager.component.scss'],
})
export class DirectoryManagerComponent implements OnInit {
  public directories: Directory[] = [];

  @ViewChild('directoryPicker') directoryPicker: ElementRef<HTMLInputElement>;

  constructor(
    private readonly directoryService: DirectoryService,
    private readonly router: Router,
    private readonly electronService: ElectronService
  ) {}

  ngOnInit(): void {
    const directories = localStorage.getItem('directories');

    if (directories) {
      this.electronService
        .getDirectories(JSON.parse(directories))
        .pipe(tap(console.log))
        .subscribe(data => (this.directories = data));
    }
  }

  open() {
    this.electronService.openDirectoryPicker().subscribe(data => {
      localStorage.setItem(
        'directories',
        JSON.stringify([...this.directories.map(({ id }) => id), data.id])
      );
      this.selectDirectory(data.id);
    });
  }

  selectDirectory(directory: Directory) {
    this.directoryService.setDirectory(directory);
    this.router.navigate(['app']);
  }
}
