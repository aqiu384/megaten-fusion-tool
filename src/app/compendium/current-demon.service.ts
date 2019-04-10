import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CurrentDemonService {
  private _currentDemon$ = new BehaviorSubject<string>('none');
  currentDemon = this._currentDemon$.asObservable();

  nextCurrentDemon(name: string) {
    this._currentDemon$.next(name);
  }
}
