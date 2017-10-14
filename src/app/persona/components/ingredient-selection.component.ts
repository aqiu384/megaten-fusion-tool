import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { FUSION_DATA_SERVICE } from '../../compendium/constants';
import { Demon, Compendium, FusionDataService, FusionEntry } from '../../compendium/models';
import { toFusionEntry } from '../../compendium/models/conversions';

import { CurrentDemonService } from '../../compendium/current-demon.service';

@Component({
  selector: 'app-ingredient-selection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-entry-table
      [baseUrl]="'.'"
      [title]="'Select the first ingredient for ' + currentDemon"
      [rowData]="ingredients">
    </app-fusion-entry-table>
  `
})
export class IngredientSelectionComponent implements OnInit, OnDestroy {
  compendium: Compendium;
  currentDemon: string;
  ingredients: FusionEntry[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private currentDemonService: CurrentDemonService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(FUSION_DATA_SERVICE) private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(compendium => {
        this.compendium = compendium;
        this.getForwardFusions();
      }));

    this.subscriptions.push(
      this.currentDemonService.currentDemon.subscribe(name => {
        this.currentDemon = name;
        this.getForwardFusions();
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  getForwardFusions() {
    if (this.compendium && this.currentDemon) {
      this.changeDetectorRef.markForCheck();

      this.ingredients = this.compendium
        .allDemons.map(demon => ({ race1: demon.race, lvl1: demon.lvl, name1: demon.name }));
    }
  }
}
