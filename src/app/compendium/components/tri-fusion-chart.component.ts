import { Component, inject } from '@angular/core';
import { FUSION_TRIO_SERVICE } from '../constants';
import { FusionChartComponent } from './fusion-chart.component';

@Component({
  selector: 'app-triple-fusion-chart',
  imports: [FusionChartComponent],
  template: `
    <app-fusion-chart
      [normChart]="fusionTrioService.squareChart$().normalChart"
      [tripChart]="fusionTrioService.squareChart$().tripleChart"
      [normTitle]="'Normal Fusions'"
      [tripTitle]="'Triple Fusions'">
    </app-fusion-chart>
  `
})
export class TripleFusionChartComponent {
  fusionTrioService = inject(FUSION_TRIO_SERVICE);
}
