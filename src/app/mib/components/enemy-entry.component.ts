import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { BaseStats, PhysResistanceElements, MagicResistanceElements, SkillElementOrder } from '../constants';
import { Compendium } from '../models/compendium';
import { Enemy } from '../models';

@Component({
  selector: 'app-enemy-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-stats
      [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
      [statHeaders]="statHeaders"
      [stats]="demon.stats.concat(demon.estats, demon.atks)">
    </app-demon-stats>
    <table>
      <thead>
        <tr>
          <th colspan="5">Negotiation</th>
        </tr>
        <tr>
          <th>Type</th>
          <th>Subtype</th>
          <th>Areas</th>
          <th>Traits</th>
          <th>Drops</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ demon.type }}</td>
          <td>{{ demon.subtype }}</td>
          <td>{{ demon.area }}</td>
          <td>{{ demon.traits.join(', ') }}</td>
          <td>{{ demon.drop }}</td>
        </tr>
      </tbody>
    </table>
    <table *ngIf="demon.contacts.length">
      <thead>
        <tr>
          <th colspan="3">Contacts</th>
        </tr>
        <tr>
          <th>Actor</th>
          <th>Action</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let contact of demon.contacts">
          <td>{{ contact.actor }}</td>
          <td>{{ contact.action }}</td>
          <td>{{ contact.result }}</td>
        </tr>
      </tbody>
    </table>
    <app-demon-resists
      [resistHeaders]="pResistanceHeaders"
      [resists]="demon.presists">
    </app-demon-resists>
    <app-demon-resists
      [resistHeaders]="mResistanceHeaders"
      [resists]="demon.mresists">
    </app-demon-resists>
    <app-demon-skills
      [title]="'Transferable Skills'"
      [hasLvl]="false"
      [hasTarget]="true"
      [elemOrder]="elemOrder"
      [compendium]="compendium"
      [skillLevels]="demon.transfers">
    </app-demon-skills>
    <app-demon-skills
      [title]="'Nontransferable Skills'"
      [hasLvl]="false"
      [hasTarget]="true"
      [elemOrder]="elemOrder"
      [compendium]="compendium"
      [skillLevels]="demon.skills">
    </app-demon-skills>
    <app-mib-fusion-table>
    </app-mib-fusion-table>
  `
})
export class EnemyEntryComponent {
  @Input() name: string;
  @Input() demon: Enemy;
  @Input() compendium: Compendium;

  statHeaders = ['HP', 'MP'].concat(BaseStats, ['MAtk', 'MDef']);
  pResistanceHeaders = PhysResistanceElements;
  mResistanceHeaders = MagicResistanceElements;
  elemOrder = SkillElementOrder;
}
