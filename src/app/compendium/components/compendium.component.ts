import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { PositionEdgesService } from '../../shared/position-edges.service';
import { PositionStickyDirective } from '../../shared/position-sticky.directive';

@Component({
  selector: 'app-demon-compendium-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table [ngStyle]="{ marginLeft: 'auto', marginRight: 'auto', width: '1000px' }">
      <thead>
        <tr>
          <th class="nav" [attr.colspan]="hasSettings ? 4 : 3">
            <div><a routerLink="{{ mainList }}s">{{ appName }} Fusion Tool</a></div>
          </th>
        </tr>
        <tr>
          <th class="nav" routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            [style.width.%]="hasSettings ? 25 : 33.333">
            <div><a routerLink="{{ mainList }}s">
              {{ mainList.charAt(0).toUpperCase() + mainList.slice(1) }} List
            </a></div>
          </th>
          <th class="nav" routerLinkActive="active" [style.width.%]="hasSettings ? 25 : 33.333">
            <div><a routerLink="skills">
              Skill List
            </a></div>
          </th>
          <th class="nav" routerLinkActive="active" [style.width.%]="hasSettings ? 25 : 33.333">
            <div><a routerLink="chart">
              Fusion Chart
            </a></div>
          </th>
          <th *ngIf="hasSettings" class="nav" routerLinkActive="active" [style.width.%]="25">
            <div><a routerLink="settings">
              Fusion Settings
            </a></div>
          </th>
        </tr>
      </thead>
    </table>
  `,
})
export class CompendiumHeaderComponent {
  @Input() appName = 'Shin Megami Tensei';
  @Input() mainList = 'demon';
  @Input() hasSettings = true;
}


@Component({
  selector: 'app-demon-compendium',
  providers: [ PositionEdgesService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [ngStyle]="{ marginLeft: 'auto', marginRight: 'auto', width: isChart ? 'auto' : '1000px' }">
      <div *ngIf="!isChart" appPositionSticky>
        <app-demon-compendium-header appPositionSticky
          [appName]="appName"
          [mainList]="mainList"
          [hasSettings]="hasSettings">
        </app-demon-compendium-header>
      </div>
      <div *ngIf="isChart">
        <app-demon-compendium-header appPositionSticky
          [appName]="appName"
          [mainList]="mainList"
          [hasSettings]="hasSettings">
        </app-demon-compendium-header>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class CompendiumComponent implements OnInit, OnDestroy {
  appName: string;
  isChart: boolean;
  subscriptions: Subscription[] = [];

  @ViewChild(PositionStickyDirective) stickyTable: PositionStickyDirective;
  @Input() mainList = 'demon';
  @Input() hasSettings = true;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscriptions.push(
      this.route.data.subscribe(data => {
        this.appName = data.appName || 'Shin Megami Tensei';
        this.isChart = data.fusionTool === 'chart';
      }));

    setTimeout(() => this.stickyTable.nextEdges());
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
