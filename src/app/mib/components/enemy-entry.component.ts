import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { BaseStats, PhysResistanceElements, MagicResistanceElements, SkillElementOrder } from '../constants';
import { Compendium } from '../models/compendium';
import { Enemy } from '../models';

@Component({
  selector: 'app-enemy-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="demon">
      <table>
        <thead>
          <tr>
            <th colspan="5">Lvl {{ demon.lvl }} {{ demon.race }} {{ demon.name }}</th>
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
            <td>{{ demon.areas.join(', ') }}</td>
            <td>{{ demon.traits.join(', ') }}</td>
            <td>{{ demon.drops }}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th [attr.colSpan]="statHeaders.length">Stats</th>
          </tr>
          <tr>
            <th *ngFor="let stat of statHeaders">{{ stat }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td *ngFor="let stat of demon.stats">{{ stat }}</td>
            <td *ngFor="let atk of demon.atks">{{ atk }}</td>
          </tr>
        </tbody>
      </table>
      <table>
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
    </ng-container>
    <ng-container *ngIf="!demon">
      <table>
        <thead>
          <tr><th>Entry for {{ name }}</th></tr>
        </thead>
        <tbody>
          <tr><td>Error: Could not find entry in compendium for {{ name }}</td></tr>
        </tbody>
      </table>
    </ng-container>
  `
})
export class EnemyEntryComponent {
  @Input() name: string;
  @Input() demon: Enemy;
  @Input() compendium: Compendium;

  statHeaders = ['HP', 'MP'].concat(BaseStats).concat(['MAtk', 'MDef']);
  pResistanceHeaders = PhysResistanceElements;
  mResistanceHeaders = MagicResistanceElements;
  elemOrder = SkillElementOrder;
}
