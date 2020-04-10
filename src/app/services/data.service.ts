import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private linkVisibilitySource = new Subject();
  currentLinkVisibility = this.linkVisibilitySource.asObservable();

  constructor() { }

  changeLinkVisibility(state: boolean) {
    this.linkVisibilitySource.next(state);
  }

}
