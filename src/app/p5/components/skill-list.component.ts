import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ElementOrder, APP_TITLE } from '../models/constants';
import { Skill } from '../models';
import { Compendium } from '../models/compendium';

import { PositionEdgesService } from '../../shared/position-edges.service';
import { SortedTableHeaderComponent, SortedTableComponent } from '../../shared/sorted-table.component';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'tr.app-skill-table-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <td><div class="element-icon {{ data.element }}">{{ data.element }}</div></td>
    <td>{{ data.name }}</td>
    <td>{{ data.cost | skillCostToString }}</td>
    <td>{{ data.effect }}</td>
    <td>
      <ul class="comma-list">
        <li *ngFor="let entry of data.learnedBy">
          <a routerLink="../personas/{{ entry.demon }}">{{ entry.demon }}</a>
          ({{ entry.level | skillLevelToString }})
        </li>
      </ul>
    </td>
    <td>
      <ul class="comma-list">
        <li *ngFor="let demon of data.talk">
          <a routerLink="../personas/{{ demon }}">{{ demon }}</a>
        </li>
      </ul>
    </td>
    <td>
      <ul class="comma-list">
        <li *ngFor="let demon of data.fuse">
          <a routerLink="../personas/{{ demon }}">{{ demon }}</a>
        </li>
      </ul>
    </td>
  `
})
export class SkillTableRowComponent {
  @Input() data: Skill;
}

@Component({
  selector: 'tfoot.app-skill-table-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tr>
      <th colspan="4">Skill</th>
      <th colspan="3">How to Acquire</th>
    </tr>
    <tr>
      <th class="sortable {{ sortDirClass(1) }}" (click)="nextSortFunIndex(1)">Element<span>--</span></th>
      <th class="sortable {{ sortDirClass(2) }}" (click)="nextSortFunIndex(2)">Name</th>
      <th class="sortable {{ sortDirClass(3) }}" (click)="nextSortFunIndex(3)">Cost<span>--</span></th>
      <th class="sortable {{ sortDirClass(4) }}" [style.width.%]="30" (click)="nextSortFunIndex(4)">Effect</th>
      <th class="sortable {{ sortDirClass(5) }}" [style.width.%]="30" (click)="nextSortFunIndex(5)">Learned By<span>--</span></th>
      <th class="sortable {{ sortDirClass(6) }}" (click)="nextSortFunIndex(6)">Negotiation<span>--</span></th>
      <th class="sortable {{ sortDirClass(7) }}" (click)="nextSortFunIndex(7)">Fusion<span>--</span></th>
    </tr>
  `,
  styles: [
    'span { visibility: hidden; }'
  ]
})
export class SkillTableHeaderComponent extends SortedTableHeaderComponent { }

@Component({
  selector: 'app-skill-list',
  providers: [ PositionEdgesService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <table appPositionSticky>
        <tfoot #stickyHeader appColumnWidths
          class="app-skill-table-header sticky-header"
          [sortFunIndex]="sortFunIndex"
          (sortFunIndexChanged)="sortFunIndex = $event">
        </tfoot>
      </table>
      <table>
        <tfoot #hiddenHeader appColumnWidths
          class="app-skill-table-header"
          [style.visibility]="'collapse'">
        </tfoot>
        <tbody>
          <tr *ngFor="let data of rowData"
            class="app-skill-table-row"
            [ngClass]="{ unique: data.unique }" [data]="data">
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class SkillListComponent extends SortedTableComponent<Skill> {
  static readonly SORT_FUNS: ((d1: Skill, d2: Skill) => number)[] = [
    (d1, d2) => (ElementOrder[d1.element] - ElementOrder[d2.element]) * 10000 + d1.cost - d2.cost,
    (d1, d2) => (ElementOrder[d1.element] - ElementOrder[d2.element]) * 10000 + d1.cost - d2.cost,
    (d1, d2) => d1.name.localeCompare(d2.name),
    (d1, d2) => d1.cost - d2.cost,
    (d1, d2) => d1.effect.localeCompare(d2.effect),
    (d1, d2) => d2.learnedBy.length - d1.learnedBy.length,
    (d1, d2) => d2.talk.length - d1.talk.length,
    (d1, d2) => d2.fuse.length - d1.fuse.length
  ];

  getSortFun(sortFunIndex: number): (a: Skill, b: Skill) => number {
    return SkillListComponent.SORT_FUNS[sortFunIndex];
  }
}

@Component({
  selector: 'app-skill-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-skill-list [rowData]="skills | async"></app-skill-list>
  `
})
export class SkillListContainerComponent implements OnInit, OnDestroy {
  skills: Observable<Skill[]>;
  subscriptions: Subscription[] = [];

  constructor(
    private title: Title,
    private fusionDataService: FusionDataService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.title.setTitle(`List of Skills - ${APP_TITLE}`);

    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(
        this.onCompendiumUpdated.bind(this)));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onCompendiumUpdated(compendium: Compendium) {
    this.changeDetectorRef.markForCheck();
    this.skills = Observable.create(observer => {
      const skills = compendium.allSkills;
      skills.sort(SkillListComponent.SORT_FUNS[0]);
      observer.next(skills.slice(0, 50));
      setTimeout(() => observer.next(skills));
    });
  }
}
