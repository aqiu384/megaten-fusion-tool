import { Component, inject } from '@angular/core';
import { FusionDataService } from '../fusion-data.service';
import { FusionChartComponent } from '../../compendium/components/fusion-chart.component';

@Component({
  selector: 'app-fusion-chart-container',
  imports: [FusionChartComponent],
  template: `
    @if (hasLightDark) {
      <app-fusion-chart
        [lang]="lang"
        [normChart]="normChart$()"
        [tripChart]="normChart$()"
        [normTitle]="'Light and Neutral Normal Fusions'"
        [tripTitle]="'Dark Normal Fusions'"
        [mitaTable]="mitamaTable">
      </app-fusion-chart>
    }
    @if (!hasLightDark) {
      <app-fusion-chart
        [lang]="lang"
        [filterDarks]="false"
        [normChart]="normChart$()"
        [mitaTable]="mitamaTable">
      </app-fusion-chart>
    }
  `
})
export class FusionChartContainerComponent {
  fusionDataService = inject(FusionDataService);
  lang = this.fusionDataService.compConfig.lang;
  mitamaTable = this.fusionDataService.compConfig.elementTable.pairs || null;
  hasLightDark = this.fusionDataService.compConfig.hasLightDark;
  normChart$ = this.fusionDataService.fusionChart$;
}
