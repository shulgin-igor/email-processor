import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { tap } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss'],
})
export class ImportDialogComponent implements OnInit {
  progress: any;

  get progressValue(): number {
    if (!this.progress) {
      return 0;
    }
    return (this.progress.processed / this.progress.total) * 100;
  }

  get progressSummary(): string {
    if (!this.progress) {
      return 'Preparing...';
    }

    const { processed, total } = this.progress;
    return `${processed} / ${total}`;
  }

  constructor(
    private readonly electronService: ElectronService,
    private readonly changeDetectionRef: ChangeDetectorRef,
    private readonly dialogRef: MatDialogRef<ImportDialogComponent>
  ) {}

  ngOnInit(): void {
    this.electronService.importProgress$.pipe(tap(console.log)).subscribe({
      next: data => {
        this.progress = data;
        this.changeDetectionRef.detectChanges();
      },
      complete: () => this.dialogRef.close(),
    });
  }
}
