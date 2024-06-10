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
      [recipeConfig]="recipeConfig">
    </app-recipe-generator>
  `
})
export class RecipeGeneratorContainerComponent implements OnInit, OnDestroy {
  compendium: Compendium;
  squareChart: SquareChart;
  recipeConfig: RecipeGeneratorConfig;
  subscriptions: Subscription[] = [];
  maxSkills = 8;

  constructor(private fusionDataService: FusionDataService, private title: Title) {
    const compConfig = this.fusionDataService.compConfig;
    this.recipeConfig = {
      fissionCalculator: this.fusionDataService.fissionCalculator,
      fusionCalculator: this.fusionDataService.fusionCalculator,
      races: compConfig.races,
      skillElems: compConfig.skillElems,
      inheritElems: compConfig.affinityElems,
      displayElems: {},
      restrictInherits: true,
      triExclusiveRaces: ['Fool', 'Fortune', 'Tower', 'Judgement', 'Aeon', 'Jester'],
      triFissionCalculator: this.fusionDataService.triFissionCalculator,
      triFusionCalculator: this.fusionDataService.triFusionCalculator,
      defaultDemon: 'Pixie'
    };
  }

  ngOnInit()    { this.setTitle(); this.subscribeAll(); }
  ngOnDestroy() { this.unsubscribeAll(); }

  setTitle() {
    this.title.setTitle(`Recipe Generator - ${this.fusionDataService.appName}`);
  }

  subscribeAll() {
    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(comp => {
        this.compendium = comp;
      }));

    this.subscriptions.push(
      this.fusionDataService.squareChart.subscribe(chart => {
        this.squareChart = chart;
      }));
  }

  unsubscribeAll() {
    for (const subscription of this.subscriptions) { subscription.unsubscribe(); }
  }
}
