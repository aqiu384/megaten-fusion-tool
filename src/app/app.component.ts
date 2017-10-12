import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { MEGATEN_FUSION_TOOLS } from './constants';

@Component({
  selector: 'app-root',
  template: `
    <div [ngStyle]="{ marginLeft: 'auto', marginRight: 'auto', width: '1000px' }"
      [ngClass]="currentGame">
      <table>
        <thead>
          <tr *ngFor="let row of navRows">
            <th *ngFor="let button of row" class="nav"
              routerLinkActive="active"
              [style.width.%]="100 / navsPerRow">
              <div *ngIf="button.tool" [style.whiteSpace]="'pre-line'">
                <a routerLink="{{ button.tool }}">{{ button.game }}</a>
              </div>
            </th>
          </tr>
        </thead>
      </table>
      <div [ngStyle]="{ display: loading ? 'table' : 'none', height: '2em', 'text-align': 'center', 'width': '100%' }">
        <h4 [ngStyle]="{ display: 'table-cell', 'vertical-align': 'middle' }">
          Loading Fusion Tool...
        </h4>
      </div>
      <div [style.display]="loading ? 'none' : null">
        <router-outlet></router-outlet>
      </div>
      <div [ngStyle]="{ 'text-align': 'center' }">
        <br>
        <a href="https://www.youtube.com/watch?v=8eYf3OHqq9s">
          https://www.youtube.com/watch?v=8eYf3OHqq9s
        </a>
      </div>
    </div>
  `,
  styleUrls: [ './app.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  currentGame = 'none';
  navsPerRow = 6;
  navRows = [];
  loading = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(v => this.interceptNavigation(v));
    this.navRows = [];

    const navButtons = [{ game: 'Home', tool: 'home', src: '' }].concat(MEGATEN_FUSION_TOOLS);
    const fillerLen = this.navsPerRow - (MEGATEN_FUSION_TOOLS.length + 1) % this.navsPerRow;
    const fillerNav = { game: '', tool: '', src: '' };

    for (let i = 0; i < fillerLen; i++) {
      navButtons.push(fillerNav);
    }

    for (let i = 0; i < MEGATEN_FUSION_TOOLS.length + 1; i += this.navsPerRow) {
      this.navRows.push(navButtons.slice(i, i + this.navsPerRow));
    }
  }

  interceptNavigation(event: Event) {
    if (event instanceof NavigationStart) {
      this.loading = true;
    } else if (event instanceof NavigationEnd) {
      this.loading = false;
      this.currentGame = event.url.split('/')[1];
      window.scrollTo(0, 0);
    } else if (
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    ) {
      this.loading = false;
    }
  }
}
