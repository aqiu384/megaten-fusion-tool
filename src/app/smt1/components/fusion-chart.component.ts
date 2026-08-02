import { Component, inject, computed } from '@angular/core';
import { FusionDataService } from '../fusion-data.service';
import { FusionChartComponent } from '../../compendium/components/fusion-chart.component';
import { SpeciesTripleChartComponent } from './species-triple-chart.component';

@Component({
  selector: 'app-fusion-chart-container',
  imports: [FusionChartComponent, SpeciesTripleChartComponent],
  template: `
    @let normChart = normChart$();
    @let tripChart = tripChart$();
    @let fullChart = fullChart$();
    @if (!fullChart) {
      <app-fusion-chart
        [normChart]="normChart"
        [tripChart]="normChart"
        [mitaTable]="mitamaTable"
        [normTitle]="'Light and Neutral Normal Fusions'"
        [tripTitle]="'Dark Normal Fusions'">
      </app-fusion-chart>
      <app-fusion-chart
        [normChart]="tripChart"
        [tripChart]="tripChart"
        [mitaTable]="tripleMitamaTable"
        [normTitle]="'Light and Neutral Triple Fusions'"
        [tripTitle]="'Dark Triple Fusions'">
      </app-fusion-chart>
    }
    @if (fullChart && !hasDarkRanks) {
      <app-fusion-chart
        [normChart]="fullChart"
        [mitaTable]="mitamaTable"
        [filterDarks]="false"
        [normTitle]="'Normal Fusions'">
      </app-fusion-chart>
      @if (hasTripleFusion) {
        <app-species-triple-chart
          [speciesChart]="tripChart"
          [title]="appName + ' - Triple Fusions'">
        </app-species-triple-chart>
      }
    }
    @if (fullChart && hasDarkRanks) {
      <app-fusion-chart
        [normChart]="fullChart"
        [tripChart]="fullChart"
        [mitaTable]="mitamaTable"
        [normTitle]="'Light and Neutral Normal Fusions'"
        [tripTitle]="'Dark Normal Fusions'">
      </app-fusion-chart>
      <app-species-triple-chart
        [speciesChart]="tripChart"
        [title]="appName + ' - Triple Fusions'">
      </app-species-triple-chart>
    }
  `,
})
export class FusionChartContainerComponent {
  fusionDataService = inject(FusionDataService);
  compConfig = this.fusionDataService.compConfig;
  appName = this.compConfig.appTitle;
  mitamaTable = this.compConfig.mitamaTable;
  tripleMitamaTable = this.compConfig.tripleMitamaTable;
  hasDarkRanks = this.compConfig.darknessRecipes;
  hasTripleFusion = !this.compConfig.appCssClasses.includes('mjn1');

  normChart$ = computed(() => this.fusionDataService.squareChart$().normalChart);
  tripChart$ = computed(() => this.fusionDataService.squareChart$().tripleChart);
  fullChart$ = computed(() => this.fusionDataService.compConfig.useSpeciesFusion ?
    this.fusionDataService.fusionChart$() : null
  );
}
