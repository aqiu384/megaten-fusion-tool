import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-fusion-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container>
      <h2>Enabled Fusion Settings</h2>
      <table class="entry-table">
        <thead>
          <tr><th class="title">Fusion Settings</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let setting of chartSettings">
            <td>
              <label>{{ setting.name }}
                <input type="checkbox"
                  [checked]="setting.enabled"
                  (change)="toggleChartSetting(setting.name)">
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </ng-container>
  `
})
export class FusionSettingsComponent implements OnInit, OnDestroy {
  private _chartSettings: { [name: string]: boolean };

  subscriptions: Subscription[] = [];

  get chartSettings(): { name: string, enabled: boolean }[] {
    return Object.entries(this._chartSettings).map(([ name, enabled ]) => ({ name, enabled }));
  }

  constructor(
    private title: Title,
    private fusionDataService: FusionDataService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.title.setTitle(`Fusion Settings - ${this.fusionDataService.appName}`);
    this.subscriptions.push(this.fusionDataService.fusionChart.subscribe(chart => {
      this.changeDetectorRef.markForCheck();
      this._chartSettings = Object.assign({}, chart.chartSettings);
    }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  toggleChartSetting(setting: string) {
    this._chartSettings[setting] = !this._chartSettings[setting];
    this.fusionDataService.nextChartSettings(this._chartSettings);
  }
}
