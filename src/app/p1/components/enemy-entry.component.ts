import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Demon, CompendiumConfig } from '../models';
import { Compendium } from '../models/compendium';

@Component({
  selector: 'app-enemy-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-stats
      [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
      [price]="demon.price"
      [statHeaders]="compConfig.enemyStats"
      [stats]="demon.stats"
      [fusionHeaders]="['Traits', 'Drops']"
      [inherits]="demon.inherits">
      <td>{{ demon.trait }}</td>
      <td>{{ demon.drop }}</td>
    </app-demon-stats>
    <app-demon-stats
      [title]="'Stats'"
      [statHeaders]="compConfig.baseStats"
      [stats]="demon.atks">
    </app-demon-stats>
    <app-demon-resists *ngIf="compConfig.presistElems.length"
      [resistHeaders]="compConfig.presistElems"
      [resists]="demon.presists">
    </app-demon-resists>
    <app-demon-resists
      [resistHeaders]="compConfig.mresistElems"
      [resists]="demon.mresists">
    </app-demon-resists>
    <app-demon-skills
      [title]="'Transferable Skills'"
      [hasLvl]="false"
      [hasTarget]="true"
      [elemOrder]="compConfig.elemOrder"
      [compendium]="compendium"
      [skillLevels]="demon.transfers">
    </app-demon-skills>
    <app-demon-skills
      [title]="'Nontransferable Skills'"
      [hasLvl]="false"
      [hasTarget]="true"
      [elemOrder]="compConfig.elemOrder"
      [compendium]="compendium"
      [skillLevels]="demon.skills">
    </app-demon-skills>
    <app-p1-fusion-table *ngIf="compConfig.appCssClasses[0] === 'p1'">
    </app-p1-fusion-table>
  `
})
export class EnemyEntryComponent {
  @Input() name: string;
  @Input() demon: Demon;
  @Input() compendium: Compendium;
  @Input() compConfig: CompendiumConfig;
}
