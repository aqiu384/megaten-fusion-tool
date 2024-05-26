import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { PositionEdgesService } from '../../shared/position-edges.service';
import { PositionStickyDirective } from '../../shared/position-sticky.directive';

import PAGE_TRANSLATION_JSON from '../../page-translations/data/translations.json';
@Component({
  selector: 'app-demon-compendium-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table *ngIf="3 + otherLinks.length + (hasSettings ? 1 : 0); let hlength"
      [ngStyle]="{ marginLeft: 'auto', marginRight: 'auto', width: '1080px' }">
      <thead>
        <tr>
          <th class="nav" routerLinkActive="active"
            [routerLink]="mainList + 's'"
            [routerLinkActiveOptions]="{ exact: true }"
            [style.width.%]="1 / hlength">
            <a [routerLink]="mainList + 's'">
              {{ (this.translations[mainList][lang] || this.translations[mainList]['en']) + (this.translations['list'][lang] || this.translations['list']['en']) }}
            </a>
          </th>
          <th class="nav" routerLink="skills" routerLinkActive="active" [style.width.%]="1 / hlength">
            <a routerLink="skills">
              {{ this.translations["skills"][lang] || this.translations["skills"]['en'] }}
            </a>
          </th>
          <th class="nav" routerLink="chart" routerLinkActive="active" [style.width.%]="1 / hlength">
            <a routerLink="chart">
              {{ this.translations["fusion-chart"][lang] || this.translations["fusion-chart"]['en'] }}
            </a>
          </th>
          <th *ngFor="let l of otherLinks" class="nav" routerLinkActive="active"
            [routerLink]="l.link"
            [routerLinkActiveOptions]="{ exact: true }"
            [style.width.%]="1 / hlength">
            <a [routerLink]="l.link">
              {{ l.title }}
            </a>
          </th>
          <th *ngIf="hasSettings" class="nav" routerLink="settings" routerLinkActive="active" [style.width.%]="1 / hlength">
            <a routerLink="settings">
              {{ this.translations["fusion-settings"][lang] || this.translations["fusion-settings"]['en'] }}
            </a>
          </th>
        </tr>
        <tr>
          <th [attr.colspan]="hlength" class="title">{{ appName + (this.translations["fusion-calculator"][lang] || this.translations["fusion-calculator"]['en']) }}</th>
        </tr>
      </thead>
    </table>
  `,
})
export class CompendiumHeaderComponent {
  @Input() appName = 'Shin Megami Tensei';
  @Input() mainList = 'demon';
  @Input() hasSettings = true;
  @Input() langEn = true;
  @Input() lang = 'en';
  @Input() otherLinks: { title: string; link: string }[] = [];

  translations = PAGE_TRANSLATION_JSON;
}


@Component({
  selector: 'app-demon-compendium',
  providers: [PositionEdgesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [ngStyle]="{ marginLeft: 'auto', marginRight: 'auto', width: isChart ? 'auto' : '1080px' }">
      <div *ngIf="!isChart" appPositionSticky>
        <app-demon-compendium-header appPositionSticky
          [appName]="appName"
          [mainList]="mainList"
          [hasSettings]="hasSettings"
          [langEn]="langEn"
          [lang]="lang"
          [otherLinks]="otherLinks">
        </app-demon-compendium-header>
      </div>
      <div *ngIf="isChart">
        <app-demon-compendium-header appPositionSticky
          [appName]="appName"
          [mainList]="mainList"
          [hasSettings]="hasSettings"
          [langEn]="langEn"
          [lang]="lang"
          [otherLinks]="otherLinks">
        </app-demon-compendium-header>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class CompendiumComponent implements OnInit, OnDestroy {
  appName: string;
  isChart: boolean;
  langEn: boolean;
  lang: string;
  subscriptions: Subscription[] = [];

  @ViewChild(PositionStickyDirective) stickyTable: PositionStickyDirective;
  @Input() mainList = 'demon';
  @Input() hasSettings = true;
  @Input() otherLinks: { title: string; link: string }[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscriptions.push(
      this.route.data.subscribe(data => {
        this.appName = data.appName || 'Shin Megami Tensei';
        this.isChart = data.fusionTool === 'chart';
        this.langEn = !data.lang || data.lang == 'en';
        this.lang = data.lang;
      }));

    setTimeout(() => this.stickyTable.nextEdges());
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
