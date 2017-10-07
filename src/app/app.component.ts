import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div [ngStyle]="{ marginLeft: 'auto', marginRight: 'auto', width: '1000px' }"
      [ngClass]="currentGame">
      <table>
        <thead>
          <tr>
            <th class="nav" routerLinkActive="active" [style.width.%]="33.333">
              <div><a routerLink="home">
                Home
              </a></div>
            </th>
            <th class="nav" routerLinkActive="active" [style.width.%]="33.333">
              <div><a routerLink="smt3">
                Shin Megami Tensei III:<br>Nocturne
              </a></div>
            </th>
            <th class="nav" routerLinkActive="active" [style.width.%]="33.333">
              <div><a routerLink="smtsj">
                Shin Megami Tensei:<br>Strange Journey
              </a></div>
            </th>
          </tr>
          <tr>
            <th class="nav" routerLinkActive="active" [style.width.%]="33.333">
              <div><a routerLink="smt4">
                Shin Megami Tensei IV
              </a></div>
            </th>
            <th class="nav" routerLinkActive="active" [style.width.%]="33.333">
              <div><a routerLink="smt4f">
                Shin Megami Tensei IV:<br>Apocalypse
              </a></div>
            </th>
            <th class="nav" routerLinkActive="active" [style.width.%]="33.333">
              <div><a routerLink="p5">
                Persona 5
              </a></div>
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
