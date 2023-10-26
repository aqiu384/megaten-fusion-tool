import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { PositionEdgesService } from '../../shared/position-edges.service';
import { PositionStickyDirective } from '../../shared/position-sticky.directive';

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
              {{ langEn ? mainList.charAt(0).toUpperCase() + mainList.slice(1) + ' List' : '悪魔一覧' }}
            </a>
          </th>
          <th class="nav" routerLink="skills" routerLinkActive="active" [style.width.%]="1 / hlength">
            <a routerLink="skills">
              {{ langEn ? 'Skill List' : 'スキル一覧' }}
            </a>
          </th>
          <th class="nav" routerLink="chart" routerLinkActive="active" [style.width.%]="1 / hlength">
            <a routerLink="chart">
              {{ langEn ? 'Fusion Chart' : '合体表' }}
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
              {{ langEn ? 'DLC Settings' : 'DLC' }}
            </a>
          </th>
        </tr>
        <tr>
          <th [attr.colspan]="hlength" class="title">{{ appName + (langEn ? ' Fusion Calculator' : ' 合体アプリ') }}</th>
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
  @Input() otherLinks: { title: string; link: string }[] = [];
}


@Component({
  selector: 'app-demon-compendium',
  providers: [ PositionEdgesService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [ngStyle]="{ marginLeft: 'auto', marginRight: 'auto', width: isChart ? 'auto' : '1080px' }">
      <div *ngIf="!isChart" appPositionSticky>
        <app-demon-compendium-header appPositionSticky
          [appName]="appName"
          [mainList]="mainList"
          [hasSettings]="hasSettings"
          [langEn]="langEn"
          [otherLinks]="otherLinks">
        </app-demon-compendium-header>
      </div>
      <div *ngIf="isChart">
        <app-demon-compendium-header appPositionSticky
          [appName]="appName"
          [mainList]="mainList"
          [hasSettings]="hasSettings"
          [langEn]="langEn"
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
        this.langEn = !data.lang;
      }));

    setTimeout(() => this.stickyTable.nextEdges());
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
