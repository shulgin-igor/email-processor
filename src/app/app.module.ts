import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { ListItemComponent } from './components/list-item/list-item.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { DirectoryManagerComponent } from './components/directory-manager/directory-manager.component';
import { MainComponent } from './components/main/main.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EmailViewComponent } from './components/email-view/email-view.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { AddressActionsComponent } from './components/address-actions/address-actions.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ContextDialogComponent } from './components/context-dialog/context-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SelectOnFocusDirective } from './directives/select-on-focus.directive';
import { AttachmentComponent } from './components/attachment/attachment.component';
import { AddressGroupComponent } from './components/address-group/address-group.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImportDialogComponent } from './components/import-dialog/import-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ListItemComponent,
    DirectoryManagerComponent,
    MainComponent,
    EmailViewComponent,
    AddressActionsComponent,
    ContextDialogComponent,
    SelectOnFocusDirective,
    AttachmentComponent,
    AddressGroupComponent,
    ImportDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
