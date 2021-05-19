import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { FusionChart } from '../../compendium/models';

@Component({
  selector: 'app-species-triple-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <tr><th class="title" [attr.colspan]="table[0].length">{{ title }}</th></tr>
      <tr><th *ngFor="let race of table[0]">{{ race.slice(0, 4) }}</th></tr>
      <tr *ngFor="let row of table.slice(1, table.length - 1)">
        <th>{{ row[0] }}</th>
        <td *ngFor="let col of row.slice(1, row.length -1)">{{ col.slice(0, 4) }}</td>
        <th>{{ row[row.length - 1] }}</th>
      </tr>
      <tr><th *ngFor="let race of table[table.length - 1]">{{ race.slice(0, 4) }}</th></tr>
    </table>
  `,
  styles: [`
    table { width: auto; margin: 0 auto; }
    td.elem { color: lime; }
    td.trip { color: lightgray; }
    td.ra-2 { color: orange; }
    td.ra-1 { color: red; }
    td.ran1 { color: lime; }
    td.ran2 { color: cyan; }
    td.None { color: #222; }
    td.Sala, td.Flae, td.Ara,  td.Fien { color: red; }
    td.Undi, td.Aqua, td.Nigi, td.Enig { color: cyan; }
    td.Sylp, td.Aero, td.Kusi, td.UMA  { color: lime; }
    td.Gnom, td.Erth, td.Saki, td.Rand { color: orange; }
    td.Empt { background-color: black; color: transparent; }
  `]
})
export class SpeciesTripleChartComponent implements OnChanges {
  @Input() speciesChart: FusionChart;
  @Input() title: string;

  table: string[][] = [];

  ngOnChanges() {
    this.fillFusionChart();
  }

  fillFusionChart() {
    this.table = [];

    const species = this.speciesChart.races;
    const specRow = [''].concat(species, ['']);

    this.table.push(specRow);

    for (let s1 = 0; s1 < species.length; s1++) {
      for (let s2 = s1 + 1; s2 < species.length; s2++) {
        const specLook = '3' + species[s1] + '|3' + species[s2];
        this.table.push([species[s1]].concat(
          species.map(specT1 => this.speciesChart.getRaceFusion('3' + specT1, specLook)), [species[s2]]
        ));
      }
    }

    this.table.push(specRow);
  }
}
