import { Component, computed, inject } from '@angular/core';
import { FusionChartComponent } from '../../compendium/components/fusion-chart.component';
import { FusionDataService } from '../fusion-data.service';

@Component({
  imports: [FusionChartComponent],
  template: `
    <app-fusion-chart
      [normChart]="squareChart$().normalChart"
      [tripChart]="hasTripleFusion ? squareChart$().tripleChart : null"
      [normTitle]="'Normal Fusions'"
      [tripTitle]="hasTripleFusion ? 'Triple Fusions' : null"
      [mitaTable]="this.mitaTable$()"
      [isPersona]="true">
    </app-fusion-chart>
  `
})
export class FusionChartContainerComponent {
  fusionDataService = inject(FusionDataService);
  compConfig = this.fusionDataService.compConfig;
  hasTripleFusion = this.compConfig.hasTripleFusion;

  compendium$ = this.fusionDataService.compendium$;
  squareChart$ = this.fusionDataService.squareChart$;
  mitaTable$ = computed(() => {
    const compendium = this.compendium$();
    const normChart = this.squareChart$().normalChart;
    const elemRaces = normChart.elementDemons.map(dname => compendium.getDemon(dname).race);
    const table: string[][] = [];

    if (this.compConfig.elementTable.elems.length > 0) {
      for (let i = 0; i < elemRaces.length; i++) {
        const raceA = elemRaces[i];
        table.push(elemRaces.slice(0, i + 1).map(raceB => normChart.getRaceFusion(raceA, raceB)));
      }
    }

    return table;
  });
}
