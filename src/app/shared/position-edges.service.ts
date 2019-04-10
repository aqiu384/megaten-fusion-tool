import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { PositionEdges } from './position-edges';

@Injectable()
export class PositionEdgesService {
  private _edges$ = new BehaviorSubject<PositionEdges>({ top: 0, bottom: 0, left: 0, right: 0, zIndex: 10 });

  edges = this._edges$.asObservable();
  parentEdges: Observable<PositionEdges>;

  constructor(@SkipSelf() @Optional() parentEdgesService: PositionEdgesService) {
    if (parentEdgesService) {
      this.parentEdges = parentEdgesService.edges;
    } else {
      this.parentEdges = new BehaviorSubject<PositionEdges>({ top: 0, bottom: 0, left: 0, right: 0, zIndex: 10 }).asObservable();
    }
  }

  nextEdges(edges: PositionEdges) {
    this._edges$.next(edges);
  }
}
