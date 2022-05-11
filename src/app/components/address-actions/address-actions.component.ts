import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DirectoryService } from 'src/app/services/directory.service';
import { ElectronService } from 'src/app/services/electron.service';
import { MatDialog } from '@angular/material/dialog';
import { ContextDialogComponent } from '../context-dialog/context-dialog.component';

@Component({
  selector: 'app-address-actions',
  templateUrl: './address-actions.component.html',
  styleUrls: ['./address-actions.component.scss'],
})
export class AddressActionsComponent {
  @Input() email: any; // TODO: set type
  @Output() userCreated: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private readonly electronService: ElectronService,
    private readonly directoryService: DirectoryService,
    private readonly dialog: MatDialog
  ) {}

  handleEmailClick() {
    if (!this.email.user) {
      this.saveUser();
    } else {
      this.openContextDialog();
    }
  }

  saveUser() {
    const dir = this.directoryService.getSelectedDirectory();

    this.electronService
      .saveUser(this.email.address, dir.path)
      .subscribe(data => {
        this.userCreated.emit(data);
      });
  }

  openContextDialog() {
    this.dialog.open(ContextDialogComponent, {
      data: {
        email: this.email,
      },
      minWidth: 400,
    });
  }
}
