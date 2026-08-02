import { Component, inject } from '@angular/core';
import { FusionDataService } from '../fusion-data.service';
import { FusionChartComponent } from '../../compendium/components/fusion-chart.component';

@Component({
  imports: [FusionChartComponent],
  template: `
    <app-fusion-chart
      [normChart]="fusionDataService.fusionChart$()"
      [filterDarks]="false"
      [normTitle]="'Normal Fusions'">
    </app-fusion-chart>
  `
})
export class FusionChartContainerComponent {
  fusionDataService = inject(FusionDataService);
}
