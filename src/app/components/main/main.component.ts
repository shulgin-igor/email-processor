import { Component, HostListener, OnInit } from '@angular/core';
import { DirectoryService } from 'src/app/services/directory.service';
import { ElectronService } from 'src/app/services/electron.service';
import { Item } from '../../interfaces/Item';
import { MatDialog } from '@angular/material/dialog';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  items: Item[] = [];
  selectedItem: any = null; // TODO: set type
  selectedIndex: number = -1;
  loading: boolean = false;

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
    const dir = this.directoryService.getSelectedDirectory();

    this.electronService.getFiles(dir.id).subscribe(data => {
      if (data.status === 'success') {
        this.items = [...this.items, ...data.items];
      } else {
        const dialogRef = this.dialog.open(ImportDialogComponent, {
          minWidth: 300,
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe(() => this.getFiles());
      }
    });
  }

  select(item: Item, index: number) {
    this.selectedIndex = index;
    this.selectedItem = null;
    this.loading = true;

    this.electronService.openFile(item.id).subscribe(data => {
      this.loading = false;
      this.selectedItem = data;
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
