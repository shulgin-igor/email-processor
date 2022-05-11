import { Component, Input } from '@angular/core';

const ICONS: { [contentType: string]: string } = {
  'image/jpg': 'fa-file-image',
  'image/jpeg': 'fa-file-image',
  'image/png': 'fa-file-image',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'fa-file-word',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    'fa-file-excel',
  'application/msword': 'fa-file-word',
  'application/rtf': 'fa-file-alt',
  'application/octet-stream': 'fa-file',
  'application/pdf': 'fa-file-pdf',
};

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss'],
})
export class AttachmentComponent {
  icon: string;

  @Input() set contentType(value: string) {
    this.icon = ICONS[value];
  }
  @Input() name: string;

  constructor() {}
}
