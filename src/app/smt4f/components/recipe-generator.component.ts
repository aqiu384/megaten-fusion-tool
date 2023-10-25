import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { RecipeGeneratorConfig, SquareChart } from '../../compendium/models';
import { Compendium } from '../models/compendium';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-recipe-generator-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-recipe-generator
      [maxSkills]="maxSkills"
      [compendium]="compendium"
      [squareChart]="squareChart"
      [recipeConfig]="recipeConfig"
      [langEn]="langEn">
    </app-recipe-generator>
  `
})
export class RecipeGeneratorContainerComponent implements OnInit, OnDestroy {
  compendium: Compendium;
  squareChart: SquareChart;
  recipeConfig: RecipeGeneratorConfig;
  appName: string;
  subscriptions: Subscription[] = [];
  maxSkills = 8;
  langEn = true;

  constructor(private fusionDataService: FusionDataService, private title: Title) {
    const compConfig = this.fusionDataService.compConfig;
    const isSh2 = compConfig.appCssClasses.includes('sh2');
    this.langEn = compConfig.lang !== 'ja';
    this.appName = (this.langEn ? 'Recipe Generator - ' : '合体レシピ ') + fusionDataService.appName;
    this.maxSkills = isSh2 ? 6 : 8;
    this.recipeConfig = {
      fissionCalculator: this.fusionDataService.fissionCalculator,
      fusionCalculator: this.fusionDataService.fusionCalculator,
      races: compConfig.races,
      skillElems: compConfig.skillElems,
      inheritElems: compConfig.affinityElems,
      restrictInherits: isSh2,
      triExclusiveRaces: [],
      triFissionCalculator: null,
      triFusionCalculator: null,
      defaultDemon: compConfig.defaultRecipeDemon
    };
  }

  ngOnInit()    { this.title.setTitle(this.appName); this.subscribeAll(); }
  ngOnDestroy() { this.unsubscribeAll(); }

  subscribeAll() {
    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(comp => {
        this.compendium = comp;
      }));

    this.subscriptions.push(
      this.fusionDataService.fusionChart.subscribe(chart => {
        this.squareChart = {
          normalChart: chart,
          tripleChart: chart,
          raceOrder: this.fusionDataService.compConfig.raceOrder
        }
      }));
  }

  unsubscribeAll() {
    for (const subscription of this.subscriptions) { subscription.unsubscribe(); }
  }
}
