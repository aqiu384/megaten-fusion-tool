import { ChangeDetectorRef, OnInit, OnDestroy, Directive } from '@angular/core';
import { Subscription } from 'rxjs';

import { Compendium, FusionDataService } from '../models';
import { FusionSettings } from '../models/fusion-settings';

@Directive()
export class DemonDlcSettingsContainerComponent implements OnInit, OnDestroy {
  private _dlcDemons: { [name: string]: boolean };
  dlcDemons: { name: string, included: boolean }[];
  subscriptions: Subscription[] = [];
  compendium: Compendium;
  fusionSettings: FusionSettings;

  constructor(
    private changeDetector2: ChangeDetectorRef,
    private fusionDataService2: FusionDataService
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.fusionDataService2.compendium.subscribe(comp => {
      this.changeDetector2.markForCheck();
      this.compendium = comp;
      this._dlcDemons = Object.assign({}, this.compendium.dlcDemons);
      this.dlcDemons = Object.entries(this._dlcDemons).map(([ name, included ]) => ({ name, included }));
    }));

    this.subscriptions.push(this.fusionDataService2.fusionSettings.subscribe(settings => {
      this.fusionSettings = settings;
    }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  toggleName(name: string) {
    const toggles = {};
    toggles[name] = !this.fusionSettings.isEnabled(name);
    this.fusionDataService2.updateFusionSettings(toggles);
  }
}
