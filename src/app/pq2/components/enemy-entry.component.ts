import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { Compendium } from '../models/compendium';
import { Demon, CompendiumConfig } from '../models';

@Component({
  selector: 'app-enemy-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-stats
      [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
      [statHeaders]="compConfig.enemyStats.concat(compConfig.enemyGrowths)"
      [fusionHeaders]="['Location']"
      [stats]="demon.stats.concat(demon.growths)">
      <td>{{ demon.area }}</td>
    </app-demon-stats>
    <table class="entry-table" *ngIf="demon.drop !== '-'">
      <thead>
        <tr>
          <th colspan="2" class="title">Drops</th>
        </tr>
        <tr>
          <th colspan="2">Item</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let drop of demon.dropOdds | keyvalue">
          <td>{{ drop.key }}</td>
          <td *ngIf="drop.value">{{ drop.value % 1000 < 100 ? drop.value % 1000 : 100 }}%{{ drop.value <= 100 ? '' : '*' }}</td>
        </tr>
      </tbody>
    </table>
    <app-demon-resists
      [resistHeaders]="compConfig.resistElems"
      [resists]="demon.resists"
      [ailmentHeaders]="compConfig.ailmentElems"
      [ailments]="demon.ailments">
    </app-demon-resists>
    <app-demon-skills
      [hasTarget]="true"
      [hasLvl]="false"
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
  @Input() lang = 'en';
}
