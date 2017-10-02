import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../constants';
import { Compendium, CompendiumConfig, FusionDataService } from '../models';

@Component({
  selector: 'app-dlc-fusion-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <thead>
        <tr><th>Included DLC Personas</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let demon of dlcDemons">
          <td>
            <label>{{ demon.name.split(',').join(' and ') }}
              <input type="checkbox"
                [checked]="demon.included"
                (change)="toggleIncludedDemon(demon.name)">
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class DlcFusionSettingsComponent implements OnInit, OnDestroy {
  private _dlcDemons: { [name: string]: boolean };

  compendium: Compendium;
  dlcDemons: { name: string, included: boolean }[];
  subscriptions: Subscription[] = [];

  constructor(
    private title: Title,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(COMPENDIUM_CONFIG) private compendiumConfig: CompendiumConfig,
    @Inject(FUSION_DATA_SERVICE) private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
    this.title.setTitle(`Fusion Settings - ${this.compendiumConfig.appTitle}`);
    this.subscriptions.push(this.fusionDataService.compendium.subscribe(comp => {
      this.changeDetectorRef.markForCheck();
      this.compendium = comp;
      this._dlcDemons = Object.assign({}, this.compendium.dlcDemons);
      this.dlcDemons = Object.entries(this._dlcDemons).map(([ name, included ]) => ({ name, included }));
    }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  toggleIncludedDemon(name: string) {
    this._dlcDemons[name] = !this._dlcDemons[name];
    this.fusionDataService.nextDlcDemons(this._dlcDemons);
  }
}
