import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TranslateCompPipe } from './compendium/pipes';
import { CurrentDemonService } from './compendium/current-demon.service';
import Translations from './compendium/data/translations.json';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, TranslateCompPipe],
  providers: [Title, CurrentDemonService],
  template: `
    <div [ngClass]="currentGame">
      <table style="margin-left: auto; margin-right: auto; width: 1080px;">
        <thead>
          <tr>
            @for (link of msgs.HomeLink; track link; let i = $index) {
              <th [routerLink]="link" class="nav" routerLinkActive="active" [style.width]="navWidth">
                <a [routerLink]="link">{{ msgs.Home[i] }}</a>
              </th>
            }
            @for (link of otherLinks; track link) {
              <th class="nav external" [style.width]="navWidth">
                <div><a [attr.href]="link.link">{{ link.title | translateComp:lang }}</a></div>
              </th>
            }
          </tr>
          <tr>
            <th [attr.colspan]="msgs.HomeLink.length + otherLinks.length" class="title">{{ msgs.AppTitle | translateComp:lang }}</th>
          </tr>
        </thead>
      </table>
      @switch (loading) {
        @case (true) { <h4 style="text-align: center;">{{ msgs.NowLoading | translateComp:lang }}</h4> }
        @default     { <router-outlet></router-outlet> }
      }
      <div style="text-align: center;">
        <br>
        <a href="https://www.youtube.com/watch?v=b1KfNEPKncQ">
          https://www.youtube.com/watch?v=b1KfNEPKncQ
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  static readonly GAME_PREFIXES: { [game: string]: string } = {
    smtdsj: 'smtsj', smt5v: 'smt5', rrch: 'krch',
    p3f: 'p3', p3a: 'p3', p3p: 'p3', p3e: 'p3r', p4g: 'p4', p5r: 'p5',
    dso: 'ds1', ds2br: 'ds2'
  };

  msgs = Translations.AppComponent;
  otherLinks = [
    { title: this.msgs.SaveOffline, link: 'https://aqiu384.github.io/megaten-database/how-to-use#save-offline' },
    { title: this.msgs.Help, link: 'https://aqiu384.github.io/megaten-database/how-to-use' },
    { title: this.msgs.ReportIssue, link: 'https://github.com/aqiu384/megaten-fusion-tool/issues' }
  ];
  navWidth = Math.round(1000 / (this.msgs.HomeLink.length + this.otherLinks.length)) / 10 + '%';

  lang = 'en';
  currentGame = 'home';
  loading = false;

  constructor(private router: Router) { }

  ngOnInit() {
    const loadErrorMsg = document.getElementById('loadErrorMsg');
    if (loadErrorMsg) { loadErrorMsg.style.display = 'none'; }
    this.router.events.subscribe(v => this.interceptNavigation(v));
  }

  interceptNavigation(event: Event) {
    if (event instanceof NavigationStart) {
      this.loading = true;
    } else if (event instanceof NavigationEnd) {
      this.loading = false;
      const parts = event.url.split('/');
      this.lang = Translations.Languages.Languages.includes(parts[1]) ? parts[1] : 'en';
      const currentGame = this.lang === 'en' ? parts[1] : parts[2];
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
