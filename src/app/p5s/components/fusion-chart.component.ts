import { Component, OnChanges, Input, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FusionDataService } from '../fusion-data.service';
import { CompendiumConfig } from '../models';

@Component({
  selector: 'app-p5s-fusion-chart',
  template: `
    <table class="entry-table">
      <tbody>
        <tr><th class="title" colspan="2">{{ normTitle }}</th></tr>
        @for (row of table; track $index) {
          <tr>
            <th>{{ row.result }}</th>
            <td>{{ row.recipes }}</td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export class P5SFusionChartComponent implements OnChanges {
  @Input() compConfig: CompendiumConfig;
  @Input() normTitle: string;

  table: { result: string, recipes: string }[];

  ngOnChanges() {
    if (this.compConfig) {
      this.fillFusionChart();
    }
  }

  fillFusionChart() {
    const table = [];
    for (const [nameR, recipe] of Object.entries(this.compConfig.pairRecipes)) {
      table.push({ result: nameR, recipes: recipe.join(', ') });
    }
    this.table = table;
  }
}

@Component({
  imports: [P5SFusionChartComponent],
  template: `
    <app-p5s-fusion-chart
      [compConfig]="compConfig"
      [normTitle]="fusionDataService.appName + ' - Normal Fusions'">
    </app-p5s-fusion-chart>
  `
})
export class FusionChartContainerComponent {
  title = inject(Title);
  fusionDataService = inject(FusionDataService);
  compConfig = this.fusionDataService.compConfig;
  appName = `Fusion Chart - ${this.fusionDataService.appName} Fusion Calculator`;

  constructor() {
    this.title.setTitle(this.appName);
  }
}
