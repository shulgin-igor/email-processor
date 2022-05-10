import { Component, HostListener, OnInit } from '@angular/core';
import { DirectoryService } from 'src/app/services/directory.service';
import { ElectronService } from 'src/app/services/electron.service';
import { Item } from '../../interfaces/Item';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  items: Item[] = [];
  selectedItem: any = null; // TODO: set type
  selectedIndex: number = -1;
  lazyLoadAvailable: boolean = false;

  @HostListener('window:keyup', ['$event']) handleKeyup($event: KeyboardEvent) {
    if (this.dialog.openDialogs.length === 0) {
      if ($event.key === 'ArrowUp') {
        this.select(this.items[this.selectedIndex - 1], this.selectedIndex - 1);
      }
      if ($event.key === 'ArrowDown') {
        this.select(this.items[this.selectedIndex + 1], this.selectedIndex + 1);
      }
    }
  }

  @HostListener('window:keydown', ['$event']) handleKeyDown(
    $event: KeyboardEvent
  ) {
    if (this.dialog.openDialogs.length === 0) {
      const { key } = $event;

      if (key === 'ArrowUp' || key === 'ArrowDown') {
        $event.preventDefault();
      }
    }
  }

  constructor(
    private readonly electronService: ElectronService,
    private readonly directoryService: DirectoryService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getFiles();
  }

  getFiles() {
    const dir = this.directoryService.getDirectory();

    this.electronService
      .getFiles(dir.path, this.items.length)
      .subscribe(data => {
        this.lazyLoadAvailable = data.hasMore;
        this.items = [...this.items, ...data.items];
      });
  }

  select(item: Item, index: number) {
    const dir = this.directoryService.getDirectory();

    this.electronService
      .openFile(dir.path + '/' + item.fileName)
      .subscribe(data => {
        this.selectedItem = data;
        this.selectedIndex = index;
      });
  }

  handleRemove() {
    this.items.splice(this.selectedIndex, 1);

    if (this.items.length > 0) {
      if (this.selectedIndex < this.items.length) {
        this.select(this.items[this.selectedIndex], this.selectedIndex);
      } else {
        this.select(this.items[this.selectedIndex - 1], this.selectedIndex - 1);
      }
    } else {
      this.selectedIndex = -1;
      this.selectedItem = null;
    }
  }

  handleProcessedFlagChange(processed: boolean) {
    this.items[this.selectedIndex].processed = processed;
    this.selectedItem.processed = processed;
  }
}
