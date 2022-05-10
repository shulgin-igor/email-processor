import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectoryManagerComponent } from './components/directory-manager/directory-manager.component';
import { MainComponent } from './components/main/main.component';
import { DirectoryGuard } from './guards/directory.guard';

const routes: Routes = [
  {
    path: '',
    component: DirectoryManagerComponent,
  },
  {
    path: 'app',
    component: MainComponent,
    canActivate: [DirectoryGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
