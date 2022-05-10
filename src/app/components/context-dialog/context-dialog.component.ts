import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ElectronService } from 'src/app/services/electron.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-context-dialog',
  templateUrl: './context-dialog.component.html',
  styleUrls: ['./context-dialog.component.scss'],
})
export class ContextDialogComponent {
  contextForm = new FormGroup({
    context: new FormControl('', Validators.required),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: any, // TODO: set type
    private readonly dialogRef: MatDialogRef<ContextDialogComponent>,
    private readonly electronService: ElectronService,
    private readonly snackBar: MatSnackBar
  ) {}

  saveContext() {
    if (this.contextForm.valid) {
      const { context } = this.contextForm.value;

      this.electronService
        .saveContext(this.data.email.user.id, context)
        .subscribe(() => {
          this.dialogRef.close();
          this.snackBar.open('Context saved', undefined, { duration: 3000 });
        });
    }
  }

  close() {
    this.dialogRef.close();
  }

  handleDown(e: KeyboardEvent) {
    if (e.metaKey && e.key === 'Enter') {
      this.saveContext();
    }
  }
}
