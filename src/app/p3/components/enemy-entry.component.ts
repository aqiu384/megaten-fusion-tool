import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { BaseStats, ResistElements, ElementOrder } from '../constants';
import { Demon } from '../../compendium/models';
import { Compendium } from '../models/compendium';

@Component({
  selector: 'app-enemy-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-stats
      [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
      [statHeaders]="statHeaders"
      [stats]="demon.stats">
    </app-demon-stats>
    <app-demon-resists
      [resistHeaders]="resistanceHeaders"
      [resists]="demon.resists">
    </app-demon-resists>
    <app-demon-skills
      [elemOrder]="elemOrder"
      [compendium]="compendium"
      [skillLevels]="demon.eskills">
    </app-demon-skills>
  `
})
export class EnemyEntryComponent {
  @Input() name: string;
  @Input() demon: Demon;
  @Input() compendium: Compendium;

  statHeaders = ['HP', 'MP'];
  elemOrder = ElementOrder;
  resistanceHeaders = ResistElements.concat(['almighty']);
}
