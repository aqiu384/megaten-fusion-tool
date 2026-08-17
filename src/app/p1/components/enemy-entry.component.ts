import { Component, Input } from '@angular/core';
import { Demon, CompendiumConfig } from '../models';
import { Compendium } from '../models/compendium';
import { DemonStatsComponent } from '../../compendium/components/demon-stats.component';
import { DemonResistsComponent } from '../../compendium/components/demon-resists.component';
import { DemonSkillsComponent } from '../../compendium/components/demon-skills.component';
import { P1FusionTableComponent } from './p1-fusion-table.component';

@Component({
  selector: 'app-enemy-entry',
  imports: [DemonStatsComponent, DemonResistsComponent, DemonSkillsComponent, P1FusionTableComponent],
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
    @if (compConfig.presistElems.length) {
      <app-demon-resists
        [resistHeaders]="compConfig.presistElems"
        [resists]="demon.presists">
      </app-demon-resists>
    }
    <app-demon-resists
      [resistHeaders]="compConfig.mresistElems"
      [resists]="demon.mresists">
    </app-demon-resists>
    <app-demon-skills
      [hasLvl]="false"
      [hasTarget]="true"
      [elemOrder]="compConfig.elemOrder"
      [compendium]="compendium"
      [skillLevels]="demon.skills">
    </app-demon-skills>
    @if (compConfig.appCssClasses[0] === 'p1') {
      <app-p1-fusion-table>
      </app-p1-fusion-table>
    }
  `
})
export class EnemyEntryComponent {
  @Input() name: string;
  @Input() demon: Demon;
  @Input() compendium: Compendium;
  @Input() compConfig: CompendiumConfig;
}
