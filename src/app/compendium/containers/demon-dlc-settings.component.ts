import { ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Compendium, FusionDataService } from '../models';

export class DemonDlcSettingsContainerComponent implements OnInit, OnDestroy {
  private _dlcDemons: { [name: string]: boolean };
  dlcDemons: { name: string, included: boolean }[];
  subscriptions: Subscription[] = [];
  compendium: Compendium;

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
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  toggleName(name: string) {
    this._dlcDemons[name] = !this._dlcDemons[name];
    this.fusionDataService2.nextDlcDemons(this._dlcDemons);
  }
}
