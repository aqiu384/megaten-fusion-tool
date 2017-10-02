import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  OnInit,
  AfterViewChecked,
  OnDestroy
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { SkillElementOrder, InheritElementOrder, APP_TITLE } from '../models/constants';
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
    <td [style.color]="data.cost ? null: 'transparent'">{{ data.cost }}</td>
    <td>{{ data.effect }}</td>
    <td [style.color]="data.power ? null: 'transparent'">{{ data.power }}</td>
    <td [style.color]="data.accuracy ? null: 'transparent'">{{ data.accuracy }}</td>
    <td><div class="element-icon {{ data.inherit }}">{{ data.inherit }}</div></td>
    <td [style.color]="data.rank ? null: 'transparent'">{{ data.rank }}</td>
    <td>
      <ul class="comma-list">
        <li *ngFor="let demon of data.learnedBy">
          <a routerLink="../demons/{{ demon }}">{{ demon }}</a>
        </li>
      </ul>
    </td>
    <td>
      <ul class="comma-list">
        <li *ngFor="let demon of data.dsource">
          <a routerLink="../demons/{{ demon }}">{{ demon }}</a>
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
      <th colspan="8">Skill</th>
      <th colspan="2">How to Acquire</th>
    </tr>
    <tr>
      <th class="sortable {{ sortDirClass(1) }}" (click)="nextSortFunIndex(1)">Element<span>--</span></th>
      <th class="sortable {{ sortDirClass(2) }}" (click)="nextSortFunIndex(2)">Name</th>
      <th class="sortable {{ sortDirClass(3) }}" (click)="nextSortFunIndex(3)">Cost<span>--</span></th>
      <th class="sortable {{ sortDirClass(4) }}" [style.width.px]="200" (click)="nextSortFunIndex(4)">Effect</th>
      <th class="sortable {{ sortDirClass(5) }}" (click)="nextSortFunIndex(5)">Power<span>--</span></th>
      <th class="sortable {{ sortDirClass(6) }}" (click)="nextSortFunIndex(6)">Accuracy<span>--</span></th>
      <th class="sortable {{ sortDirClass(7) }}" (click)="nextSortFunIndex(7)">Inherits<span>--</span></th>
      <th class="sortable {{ sortDirClass(8) }}" (click)="nextSortFunIndex(8)">Rank<span>--</span></th>
      <th class="sortable {{ sortDirClass(9) }}" [style.width.px]="200" (click)="nextSortFunIndex(9)">Learned By</th>
      <th class="sortable {{ sortDirClass(10) }}" [style.width.px]="200" (click)="nextSortFunIndex(10)">D-source</th>
    </tr>
  `,
  styles: [
    'span { visibility: hidden; }'
  ]
})
export class SkillTableHeaderComponent extends SortedTableHeaderComponent { }

@Component({
  selector: 'app-skill-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
          [data]="data">
        </tr>
      </tbody>
    </table>
  `
})
export class SkillListComponent extends SortedTableComponent<Skill> implements AfterViewChecked {
  static readonly SORT_FUNS: ((d1: Skill, d2: Skill) => number)[] = [
    (d1, d2) => (SkillElementOrder[d1.element] - SkillElementOrder[d2.element]) * 10000 + d1.rank - d2.rank,
    (d1, d2) => (SkillElementOrder[d1.element] - SkillElementOrder[d2.element]) * 10000 + d1.rank - d2.rank,
    (d1, d2) => d1.name.localeCompare(d2.name),
    (d1, d2) => d1.cost - d2.cost,
    (d1, d2) => d1.effect.localeCompare(d2.effect),
    (d1, d2) => d2.power - d1.power,
    (d1, d2) => d2.accuracy - d1.accuracy,
    (d1, d2) => InheritElementOrder[d1.inherit] - InheritElementOrder[d2.inherit],
    (d1, d2) => d2.rank - d1.rank,
    (d1, d2) => d2.learnedBy.length - d1.learnedBy.length,
    (d1, d2) => d2.dsource.length - d1.dsource.length,
  ];

  ngAfterViewChecked() {
    this.matchColWidths();
  }

  getSortFun(sortFunIndex: number): (a: Skill, b: Skill) => number {
    return SkillListComponent.SORT_FUNS[sortFunIndex];
  }
}

@Component({
  selector: 'app-skill-list-container',
  providers: [ PositionEdgesService ],
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
      const skills = compendium.getAllSkills();
      skills.sort(SkillListComponent.SORT_FUNS[0]);
      observer.next(skills.slice(0, 50));
      setTimeout(() => observer.next(skills));
    });
  }
}
