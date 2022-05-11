import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { DirectoryService } from '../../services/directory.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss'],
})
export class EmailViewComponent {
  @Input() email: any; // TODO: set type
  @Output() emailRemoved: EventEmitter<any> = new EventEmitter<any>();
  @Output() processedFlagChanged: EventEmitter<any> = new EventEmitter<any>();

  @HostListener('window:keyup', ['$event']) handleKeyUp($event: KeyboardEvent) {
    if ($event.key === 'Backspace' && this.dialog.openDialogs.length === 0) {
      this.remove();
    }
  }

  constructor(
    private readonly electronService: ElectronService,
    private readonly directoryService: DirectoryService,
    private readonly dialog: MatDialog
  ) {}

  remove() {
    if (confirm('Are you sure you want to remove this email?')) {
      const path = `${this.directoryService.getSelectedDirectory().path}/${
        this.email.fileName
      }`;

      this.electronService.removeFile(path).subscribe(() => {
        this.emailRemoved.emit();
      });
    }
  }

  toggleProcessed(processed: boolean) {
    this.electronService
      .toggleProcessed(this.email.id, processed)
      .subscribe(() => {
        this.processedFlagChanged.emit(processed);
      });
  }
}
