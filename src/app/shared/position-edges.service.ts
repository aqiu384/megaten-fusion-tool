import { Injectable, Optional, SkipSelf, Signal, signal } from '@angular/core';
import { PositionEdges } from './position-edges';

@Injectable()
export class PositionEdgesService {
  private _edges = signal<PositionEdges>({ top: 0, bottom: 0, left: 0, right: 0, zIndex: 10 });

  edges = this._edges.asReadonly();
  parentEdges = signal<PositionEdges>({ top: 0, bottom: 0, left: 0, right: 0, zIndex: 10 }).asReadonly();

  constructor(@SkipSelf() @Optional() parentEdgesService: PositionEdgesService) {
    if (parentEdgesService) { this.parentEdges = parentEdgesService.edges; }
  }

  nextEdges(edges: PositionEdges) {
    this._edges.set(edges);
  }
}
