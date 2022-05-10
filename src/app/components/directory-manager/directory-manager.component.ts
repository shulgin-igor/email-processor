import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Directory } from 'src/app/interfaces/Directory';
import { Router } from '@angular/router';
import { DirectoryService } from 'src/app/services/directory.service';
import { ElectronService } from 'src/app/services/electron.service';

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
      this.directories = JSON.parse(directories);
    }
  }

  open() {
    this.electronService.openDirectoryPicker().subscribe(path => {
      localStorage.setItem(
        'directories',
        JSON.stringify([...this.directories, { path }])
      );
      this.selectDirectory({ path });
    });
  }

  selectDirectory(directory: Directory) {
    this.directoryService.setDirectory(directory);
    this.router.navigate(['app']);
  }

  handleDirectoryChange(event: any) {
    console.log(event);
  }
}
