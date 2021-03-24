import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import MEGATEN_FUSION_TOOLS from './data-sources.json';

@Component({
  template: `
    <table [ngStyle]="{ marginLeft: 'auto', marginRight: 'auto', width: '1080px' }">
      <thead>
        <tr>
          <th>Fusion Tool</th>
          <th>Data Sources</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let tool of fusionTools">
          <th class="nav" [routerLink]="'../' + tool.tool">
            <a [routerLink]="'../' + tool.tool">{{ tool.game }}</a>
          </th>
          <td>
            <ul>
              <li *ngFor="let src of tool.srcs">
                <a href="{{ src }}">{{ src }}</a>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th class="nav external">
            <div>
              <a href="https://github.com/aqiu384/megaten-fusion-tool/issues">Report Issue</a>
            </div>
          </th>
          <td>
            <ul>
              <li>
                <a href="https://github.com/aqiu384/megaten-fusion-tool/issues">
                  https://github.com/aqiu384/megaten-fusion-tool/issues
                </a>
              </li>
            </ul>
          </td>
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
