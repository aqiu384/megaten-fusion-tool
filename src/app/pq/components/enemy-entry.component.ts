import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { BaseStats, ResistElements, Ailments, ElementOrder } from '../constants';
import { Demon } from '../../compendium/models';
import { Compendium } from '../models/compendium';

@Component({
  selector: 'app-enemy-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-stats
      [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
      [statHeaders]="statHeaders"
      [stats]="[demon.exp].concat(demon.stats, demon.estats)">
    </app-demon-stats>
    <table>
      <thead>
        <tr>
          <th colspan="2">Appearances</th>
        </tr>
        <tr>
          <th>Areas</th>
          <th>Drops</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ demon.area }}</td>
          <td>{{ demon.drop }}</td>
        </tr>
      </tbody>
    </table>
    <app-demon-resists
      [resistHeaders]="resistanceHeaders"
      [ailmentHeaders]="ailmentHeaders"
      [resists]="demon.resists"
      [ailments]="demon.ailments">
    </app-demon-resists>
    <app-demon-skills
      [elemOrder]="elemOrder"
      [compendium]="compendium"
      [skillLevels]="demon.skills">
    </app-demon-skills>
  `
})
export class EnemyEntryComponent {
  @Input() name: string;
  @Input() demon: Demon;
  @Input() compendium: Compendium;

  statHeaders = ['EXP', 'HP', 'Atk', 'Def', 'St', 'Ma', 'En', 'Ag', 'Lu'];
  elemOrder = ElementOrder;
  resistanceHeaders = ResistElements.concat('almighty');
  ailmentHeaders = Ailments;
}
