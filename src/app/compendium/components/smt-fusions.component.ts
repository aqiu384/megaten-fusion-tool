import { Component, ChangeDetectionStrategy, Input, OnChanges, ViewChild } from '@angular/core';
import { PositionEdgesService } from '../../shared/position-edges.service';
import { PositionStickyDirective } from '../../shared/position-sticky.directive';

@Component({
  selector: 'app-smt-fusions',
  providers: [ PositionEdgesService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <table #stickyTable appPositionSticky>
        <thead>
          <tr>
            <th class="nav" routerLinkActive="active" [style.width.%]="50">
              <div><a routerLink="reverse-fusions">
                Reverse Fusions
              </a></div>
            </th>
            <th class="nav" routerLinkActive="active" [style.width.%]="50">
              <div><a routerLink="forward-fusions">
                Forward Fusions
              </a></div>
            </th>
          </tr>
          <tr *ngIf="showFusionAlert">
            <th colspan="2"><ng-content></ng-content></th>
          <tr>
        </thead>
      </table>
      <router-outlet></router-outlet>
    </div>
  `
})
export class SmtFusionsComponent implements OnChanges {
  @ViewChild(PositionStickyDirective) stickyTable: PositionStickyDirective;
  @Input() showFusionAlert = false;

  ngOnChanges() {
    setTimeout(() => this.stickyTable.nextEdges());
  }
}
