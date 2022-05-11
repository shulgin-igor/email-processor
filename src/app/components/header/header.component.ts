import { Component, OnInit } from '@angular/core';
import { DirectoryService } from '../../services/directory.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  directory: string | undefined;

  constructor(
    private readonly directoryService: DirectoryService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.directory = this.directoryService.getSelectedDirectory()?.path;
  }

  back() {
    this.directoryService.clearSelectedDirectory();
    this.router.navigate(['']);
  }
}
