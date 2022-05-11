import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { DirectoryService } from '../services/directory.service';

@Injectable({
  providedIn: 'root',
})
export class DirectoryGuard implements CanActivate {
  constructor(private readonly directoryService: DirectoryService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.directoryService
      .getSelectedDirectory$()
      .pipe(map(dir => !!dir));
  }
}
