import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { RecipeGeneratorConfig } from '../../compendium/models';
import { Compendium } from '../models/compendium';
import { PersonaFusionChart } from '../../compendium/models/per-fusion-chart';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-recipe-generator-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-recipe-generator
      [defaultDemon]="defaultDemon"
      [maxSkills]="maxSkills"
      [compendium]="compendium"
      [fusionChart]="fusionChart"
      [recipeConfig]="recipeConfig">
    </app-recipe-generator>
  `
})
export class RecipeGeneratorContainerComponent implements OnInit, OnDestroy {
  compendium: Compendium;
  fusionChart: PersonaFusionChart;
  recipeConfig: RecipeGeneratorConfig;
  subscriptions: Subscription[] = [];
  defaultDemon = 'Pixie';
  maxSkills = 8;

  constructor(private fusionDataService: FusionDataService, private title: Title) {
    const compConfig = this.fusionDataService.compConfig;
    this.recipeConfig = {
      fissionCalculator: this.fusionDataService.fissionCalculator,
      fusionCalculator: this.fusionDataService.fusionCalculator,
      races: compConfig.races,
      skillElems: compConfig.skillElems,
      inheritElems: compConfig.inheritElems,
      restrictInherits: true,
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
      this.fusionDataService.fusionChart.subscribe(chart => {
        this.fusionChart = chart;
      }));
  }

  unsubscribeAll() {
    for (const subscription of this.subscriptions) { subscription.unsubscribe(); }
  }
}
