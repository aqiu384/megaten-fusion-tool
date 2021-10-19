import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div [ngClass]="currentGame">
      <table style="margin-left: auto; margin-right: auto; width: 1080px;">
        <thead>
          <tr>
            <th routerLink="home" class="nav" routerLinkActive="active" style="width: 25%;">
              <a routerLink="home">All Games</a>
            </th>
            <th class="nav external" style="width: 25%;">
              <div><a href="https://aqiu384.github.io/docs-megaten/how-to-use#save-offline">Save Offline</a></div>
            </th>
            <th class="nav external" style="width: 25%;">
              <div><a [href]="'https://aqiu384.github.io/docs-megaten/how-to-use#' + currentGame">Help</a></div>
            </th>
            <th class="nav external" style="width: 25%;">
              <div><a [href]="'https://github.com/aqiu384/' + (currentGame === 'smt5' ? 'smt5-data' : 'megaten-fusion-tool') + '/issues'">Report Issue</a></div>
            </th>
          </tr>
          <tr>
            <th colspan="4" class="title">Megami Tensei Fusion Tools</th>
          </tr>
        </thead>
      </table>
      <h4 *ngIf="loading" style="text-align: center;">
        Loading fusion tool... Reopen in a private session if tool does not load.
      </h4>
      <ng-container *ngIf="!loading">
        <router-outlet></router-outlet>
      </ng-container>
      <div style="text-align: center;">
        <br>
        <a href="https://www.youtube.com/watch?v=b1KfNEPKncQ">
          https://www.youtube.com/watch?v=b1KfNEPKncQ
        </a>
      </div>
    </div>
  `,
  styleUrls: [ './app.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  static readonly GAME_PREFIXES: { [game: string]: string } = {
    smtdsj: 'smtsj',
    p3fes: 'p3', p3aeg: 'p3', p3p: 'p3', p4g: 'p4', p5r: 'p5',
    dso: 'ds1', ds2br: 'ds2'
  };

  currentGame = 'none';
  loading = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(v => this.interceptNavigation(v));
  }

  interceptNavigation(event: Event) {
    if (event instanceof NavigationStart) {
      this.loading = true;
    } else if (event instanceof NavigationEnd) {
      this.loading = false;
      const currentGame = event.url.split('/')[1];
      this.currentGame = AppComponent.GAME_PREFIXES[currentGame] || currentGame;
      window.scrollTo(0, 0);
    } else if (
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    ) {
      this.loading = false;
    }
  }
}
