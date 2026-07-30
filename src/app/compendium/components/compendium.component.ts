import { Component, Input, OnInit, OnDestroy, ViewChild, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { PositionEdgesService } from '../../shared/position-edges.service';
import { PositionStickyDirective } from '../../shared/position-sticky.directive';
import { TranslateCompPipe } from '../pipes';
import Translations from '../data/translations.json';

@Component({
  selector: 'app-demon-compendium-header',
  imports: [CommonModule, RouterModule, TranslateCompPipe],
  template: `
    <table [ngStyle]="{ marginLeft: 'auto', marginRight: 'auto', width: '1080px' }">
      <thead>
        <tr>
          <th class="nav" routerLinkActive="active"
            [routerLink]="mainList + 's'"
            [routerLinkActiveOptions]="{ exact: true }"
            [style.width.%]="1 / hlength()">
            <a [routerLink]="mainList + 's'">
              {{ (mainList === 'demon' ? msgs.DemonList : msgs.PersonaList) | translateComp:lang }}
            </a>
          </th>
          <th class="nav" routerLink="skills" routerLinkActive="active" [style.width.%]="1 / hlength()">
            <a routerLink="skills">
              {{ msgs.SkillList | translateComp:lang }}
            </a>
          </th>
          <th class="nav" routerLink="chart" routerLinkActive="active" [style.width.%]="1 / hlength()">
            <a routerLink="chart">
              {{ msgs.FusionChart | translateComp:lang }}
            </a>
          </th>
          @for (l of otherLinks(); track l) {
            <th class="nav" routerLinkActive="active"
              [routerLink]="l.link"
              [routerLinkActiveOptions]="{ exact: true }"
              [style.width.%]="1 / hlength()">
              <a [routerLink]="l.link">
                {{ l.title }}
              </a>
            </th>
          }
          @if (hasSettings) {
            <th class="nav" routerLink="settings" routerLinkActive="active" [style.width.%]="1 / hlength()">
              <a routerLink="settings">
                {{ msgs.FusionSettings | translateComp:lang }}
              </a>
            </th>
          }
        </tr>
        <tr>
          <th [attr.colspan]="hlength()" class="title">{{ appName }}{{ msgs.FusionCalculator | translateComp:lang }}</th>
        </tr>
      </thead>
    </table>
  `
})
export class CompendiumHeaderComponent {
  @Input() appName = 'Shin Megami Tensei';
  @Input() mainList = 'demon';
  @Input() hasSettings = true;
  @Input() lang = 'en';
  otherLinks = input<{ title: string; link: string }[]>([]);

  msgs = Translations.CompendiumComponent;
  hlength = computed(() => 3 + this.otherLinks().length + (this.hasSettings ? 1 : 0))
}

@Component({
  selector: 'app-demon-compendium',
  imports: [CommonModule, RouterModule, PositionStickyDirective, CompendiumHeaderComponent],
  providers: [PositionEdgesService],
  template: `
    <div [ngStyle]="{ marginLeft: 'auto', marginRight: 'auto', width: isChart ? 'auto' : '1080px' }">
      @if (!isChart) {
        <div appPositionSticky>
          <app-demon-compendium-header appPositionSticky
            [appName]="appName"
            [mainList]="mainList"
            [hasSettings]="hasSettings"
            [lang]="lang"
            [otherLinks]="otherLinks">
          </app-demon-compendium-header>
        </div>
      }
      @if (isChart) {
        <div>
          <app-demon-compendium-header appPositionSticky
            [appName]="appName"
            [mainList]="mainList"
            [hasSettings]="hasSettings"
            [lang]="lang"
            [otherLinks]="otherLinks">
          </app-demon-compendium-header>
        </div>
      }
      <router-outlet></router-outlet>
    </div>
  `
})
export class CompendiumComponent implements OnInit, OnDestroy {
  appName: string;
  isChart: boolean;
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
