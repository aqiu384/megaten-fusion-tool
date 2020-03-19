import {
  Directive,
  HostBinding,
  Input,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy
} from '@angular/core';

import { Subscription } from 'rxjs';

import { PositionEdges } from './position-edges';
import { PositionEdgesService } from './position-edges.service';

@Directive({
  selector: '[appPositionSticky]'
})
export class PositionStickyDirective implements OnInit, OnDestroy {
  @HostBinding('class.position-sticky') cPositionSticky = true;
  @HostBinding('style.zIndex') sZIndex = 0;

  private subscriptions: Subscription[] = [];
  private _edges: PositionEdges = { top: 0, bottom: 0, left: 0, right: 0, zIndex: 10 };

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private edgesService: PositionEdgesService,
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.edgesService.parentEdges.subscribe(edges => {
        this.edges = edges;
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
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
