import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';

import { PositionEdgesService } from '../../shared/position-edges.service';
import { PositionStickyDirective } from '../../shared/position-sticky.directive';

@Component({
  selector: 'app-demon-compendium',
  providers: [ PositionEdgesService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <table appPositionSticky>
        <thead>
          <tr>
            <th class="nav" routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              [style.width.%]="33.333">
              <div><a routerLink="{{ mainList }}s">
                {{ mainList.charAt(0).toUpperCase() + mainList.slice(1) }} List
              </a></div>
            </th>
            <th class="nav" routerLinkActive="active" [style.width.%]="33.333">
              <div><a routerLink="skills">
                Skill List
              </a></div>
            </th>
            <th class="nav" routerLinkActive="active" [style.width.%]="33.333">
              <div><a routerLink="settings">
                Fusion Settings
              </a></div>
            </th>
          </tr>
        </thead>
      </table>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class CompendiumComponent implements OnInit {
  @ViewChild(PositionStickyDirective) stickyTable: PositionStickyDirective;
  @Input() mainList = 'demon';

  ngOnInit() {
    setTimeout(() => this.stickyTable.nextEdges());
  }
}
