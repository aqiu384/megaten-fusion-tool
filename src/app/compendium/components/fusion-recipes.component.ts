import {
  Component,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import { PositionEdgesService } from '../../shared/position-edges.service';

@Component({
  selector: 'app-fusion-recipes',
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
export class FusionRecipesComponent {
  @Input() showFusionAlert = false;
}
