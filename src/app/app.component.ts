import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { PageTranslationUtil } from './page-translations/page-translation-util';
import PAGE_TRANSLATION_JSON from './page-translations/data/translations.json';

@Component({
  selector: 'app-root',
  template: `
    <div [ngClass]="currentGame">
      <table style="margin-left: auto; margin-right: auto; width: 1080px;">
        <thead>
          <tr>
            <th routerLink="home" class="nav" routerLinkActive="active" style="width: 16.7%;">
              <a routerLink="home">Game List (EN)</a>
            </th>
            <th routerLink="ja/home" class="nav" routerLinkActive="active" style="width: 16.7%;">
              <a routerLink="ja/home">ゲーム一覧 (日本語)</a>
            </th>
            <th routerLink="zh-cn/home" class="nav" routerLinkActive="active" style="width: 16.7%;">
              <a routerLink="zh-cn/home">游戏一览 (简体中文)</a>
            </th>
            <th class="nav external" style="width: 16.7%;">
              <div><a href="https://aqiu384.github.io/megaten-database/how-to-use#save-offline">{{ translations['save-offline'][lang] || translations['save-offline']['en'] }}</a></div>
            </th>
            <th class="nav external" style="width: 16.7%;">
              <div><a href="https://aqiu384.github.io/megaten-database/how-to-use">{{ translations['help'][lang] || translations['help']['en'] }}</a></div>
            </th>
            <th class="nav external" style="width: 16.7%;">
              <div><a href="https://github.com/aqiu384/megaten-fusion-tool/issues">
                {{ translations['report-issues'][lang] || translations['report-issues']['en'] }}
              </a></div>
            </th>
          </tr>
          <tr>
            <th colspan="6" class="title">{{ translations['fusion-tool-title'][lang] || translations['fusion-tool-title']['en'] }}</th>
          </tr>
        </thead>
      </table>
      <h4 *ngIf="loading" style="text-align: center;">
        {{ translations['loading'][lang] || translations['loading']['en'] }}
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
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  static readonly GAME_PREFIXES: { [game: string]: string } = {
    smtdsj: 'smtsj',
    p3f: 'p3', p3a: 'p3', p3p: 'p3', p4g: 'p4', p5r: 'p5',
    dso: 'ds1', ds2br: 'ds2'
  };

  lang = 'en';
  currentGame = 'none';
  loading = false;
  translations = PAGE_TRANSLATION_JSON;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(v => this.interceptNavigation(v));
  }

  interceptNavigation(event: Event) {
    if (event instanceof NavigationStart) {
      this.loading = true;
    } else if (event instanceof NavigationEnd) {
      this.loading = false;
      const currentGame = event.url.replace(/\/ja\/|\/zh-cn\//, '/').split('/')[1];
      this.currentGame = AppComponent.GAME_PREFIXES[currentGame] || currentGame;
      this.lang = PageTranslationUtil.getLanguage(event.url);
      window.scrollTo(0, 0);
    } else if (
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    ) {
      this.loading = false;
    }
  }
}
