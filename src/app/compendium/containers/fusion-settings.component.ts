import { ChangeDetectorRef, OnInit, OnDestroy, Directive } from '@angular/core';
import { Subscription } from 'rxjs';

import { Compendium, FusionDataService } from '../models';
import { FusionSettings } from '../models/fusion-settings';

@Directive()
export class FusionSettingsContainerComponent implements OnInit, OnDestroy {
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

  toggleAll(enable: boolean) {
    const toggles = {};

    for (const cat of this.fusionSettings.displayHeaders) {
      for (const setting of cat.settings) {
        toggles[setting.name] = enable
      }
    }

    this.fusionDataService2.updateFusionSettings(toggles);
  }

  toggleName(name: string) {
    const toggles = {};
    toggles[name] = !this.fusionSettings.isEnabled(name);
    this.fusionDataService2.updateFusionSettings(toggles);
  }
}
