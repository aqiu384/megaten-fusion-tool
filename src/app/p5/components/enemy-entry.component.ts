import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { BaseStats, ResistanceElements, ElementOrder } from '../models/constants';
import { Demon } from '../../compendium/models';
import { Compendium } from '../models/compendium';

@Component({
  selector: 'app-enemy-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-stats
      [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
      [statHeaders]="statHeaders"
      [stats]="[demon.exp, demon.price].concat(demon.stats, demon.estats)">
    </app-demon-stats>
    <table>
      <thead>
        <tr>
          <th colspan="4">Negotiation</th>
        </tr>
        <tr>
          <th>Persona</th>
          <th>Personality</th>
          <th>Areas</th>
          <th>Drops</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <a *ngIf="demon.persona && demon.persona != '-'" routerLink="../../personas/{{ demon.persona }}">
              {{ demon.persona }}
            </a>
          </td>
          <td>{{ demon.trait }}</td>
          <td>{{ demon.area }}</td>
          <td>{{ demon.drop }}</td>
        </tr>
      </tbody>
    </table>
    <app-demon-resists
      [resistHeaders]="resistanceHeaders"
      [resists]="demon.resists">
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

  statHeaders = ['EXP', 'Yen', 'HP', 'MP'].concat(BaseStats);
  elemOrder = ElementOrder;
  resistanceHeaders = ResistanceElements;
}
