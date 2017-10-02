import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { APP_TITLE } from '../models/constants';
import { Compendium } from '../models/compendium';

import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-fusion-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <thead>
        <tr><th>Included DLC Demons</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let demon of dlcDemons">
          <td>
            <label>{{ demon.name }}
              <input type="checkbox"
                [checked]="demon.included"
                (change)="toggleIncludedSubapp(demon.name)">
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class FusionSettingsComponent implements OnInit, OnDestroy {
  private _dlcDemons: { [name: string]: boolean };

  compendium: Compendium;
  dlcDemons: { name: string, included: boolean }[];
  subscriptions: Subscription[] = [];

  constructor(
    private title: Title,
    private fusionDataService: FusionDataService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.title.setTitle(`Fusion Settings - ${APP_TITLE}`);
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

  toggleIncludedSubapp(name: string) {
    this._dlcDemons[name] = !this._dlcDemons[name];
    this.fusionDataService.nextDlcDemons(this._dlcDemons);
  }
}
