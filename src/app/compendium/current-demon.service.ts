import { Injectable, signal } from '@angular/core';

@Injectable()
export class CurrentDemonService {
  private _currentDemon$ = signal('none');
  currentDemon = this._currentDemon$.asReadonly();

  nextCurrentDemon(name: string) {
    this._currentDemon$.set(name);
  }
}
