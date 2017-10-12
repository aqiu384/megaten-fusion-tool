import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MEGATEN_FUSION_TOOLS } from './constants';

@Component({
  template: `
    <table>
      <thead>
        <tr>
          <th colspan="2">Data Sources</th>
        </tr>
        <tr>
          <th>Fusion Tool</th>
          <th>Data Sources</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let tool of fusionTools">
          <td><a routerLink="../{{ tool.tool }}">{{ tool.game }}</a></td>
          <td><a href="{{ tool.src }}">{{ tool.src }}</a></td>
        </tr>
        <tr>
          <td>Report Issue</td>
          <td><a href="https://github.com/aqiu384/megaten-fusion-tool/issues">
            https://github.com/aqiu384/megaten-fusion-tool/issues
          </a></td>
        </tr>
      </tbody>
    </table>
  `
})
export class HomeComponent implements OnInit {
  fusionTools = MEGATEN_FUSION_TOOLS;

  constructor(private title: Title) { }

  ngOnInit() {
    this.title.setTitle(`Megami Tensei Fusion Tools`);
  }
}
