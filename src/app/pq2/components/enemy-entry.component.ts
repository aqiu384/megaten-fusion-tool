import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemonStatsComponent } from '../../compendium/components/demon-stats.component';
import { DemonResistsComponent } from '../../compendium/components/demon-resists.component';
import { DemonSkillsComponent } from '../../compendium/components/demon-skills.component';
import { Compendium } from '../models/compendium';
import { Demon, CompendiumConfig } from '../models';

@Component({
  selector: 'app-enemy-entry',
  imports: [CommonModule, DemonStatsComponent, DemonResistsComponent, DemonSkillsComponent],
  template: `
    <app-demon-stats
      [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
      [statHeaders]="compConfig.enemyStats.concat(compConfig.enemyGrowths)"
      [fusionHeaders]="['Location']"
      [stats]="demon.stats.concat(demon.growths)">
      <td>{{ demon.area }}</td>
    </app-demon-stats>
    @if (demon.drop !== '-') {
      <table class="entry-table">
        <thead>
          <tr>
            <th colspan="2" class="title">Drops</th>
          </tr>
          <tr>
            <th colspan="2">Item</th>
          </tr>
        </thead>
        <tbody>
          @for (drop of demon.dropOdds | keyvalue; track drop) {
            <tr>
              <td>{{ drop.key }}</td>
              @if (drop.value) {
                <td>{{ drop.value % 1000 < 100 ? drop.value % 1000 : 100 }}%{{ drop.value <= 100 ? '' : '*' }}</td>
              }
            </tr>
          }
        </tbody>
      </table>
    }
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
