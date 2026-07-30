import { Directive, HostBinding, Input, ElementRef, Renderer2, effect } from '@angular/core';
import { PositionEdges } from './position-edges';
import { PositionEdgesService } from './position-edges.service';

@Directive({
  selector: '[appPositionSticky]'
})
export class PositionStickyDirective {
  @HostBinding('class.position-sticky') cPositionSticky = true;
  @HostBinding('style.zIndex') sZIndex = 0;

  private _edges: PositionEdges = { top: 0, bottom: 0, left: 0, right: 0, zIndex: 10 };

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private edgesService: PositionEdgesService,
  ) { 
    effect(() => { this.edges = edgesService.parentEdges(); });
  }

  nextEdges() {
    setTimeout(() => this.edgesService.nextEdges(this.edges));
  }

  get edges(): PositionEdges {
    return Object.assign({}, this._edges, {
      top: this._edges.top + this.elementRef.nativeElement.clientHeight,
      zIndex: this._edges.zIndex - 1
    });
  }

  @Input() set edges(edges: PositionEdges) {
    this._edges = edges;
    this.sZIndex = edges.zIndex;
    this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${edges.top}px`);
    this.nextEdges();
  }
}
