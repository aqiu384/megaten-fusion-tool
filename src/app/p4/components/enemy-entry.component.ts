import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { Demon } from '../../compendium/models';
import { Compendium } from '../models/compendium';
import { CompendiumConfig } from '../models';

@Component({
  selector: 'app-enemy-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-stats
      [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
      [statHeaders]="['HP', 'MP'].concat(compConfig.baseStats)"
      [stats]="demon.stats.concat(demon.estats)">
    </app-demon-stats>
    <table class="entry-table">
      <thead>
        <tr>
          <th colspan="2" class="title">Appearances</th>
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
      [resistHeaders]="compConfig.enemyResists"
      [resists]="demon.resists">
    </app-demon-resists>
    <app-demon-skills
      [elemOrder]="compConfig.elemOrder"
      [compendium]="compendium"
      [skillLevels]="demon.skills">
    </app-demon-skills>
  `
})
export class EnemyEntryComponent {
  @Input() name: string;
  @Input() demon: Demon;
  @Input() compendium: Compendium;
  @Input() compConfig: CompendiumConfig;
}
