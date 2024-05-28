import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import Translations from './compendium/data/translations.json';
import FusionTools from './compendium/data/fusion-tools.json';

@Component({
  template: `
    <table [ngStyle]="{ marginLeft: 'auto', marginRight: 'auto', width: '1080px' }">
      <tr *ngFor="let tool of listTools">
        <th [routerLink]="'../' + tool.game" class="nav" routerLinkActive="active">
          <a [routerLink]="'../' + tool.game + (tool.game[0] === 'p' ? '/personas' : '/demons')">{{ tool.titles[langInd] }}</a>
        </th>
      </tr>
    </table>
  `
})
export class HomeComponent implements OnInit {
  fusionTools = FusionTools;
  langs = Translations.Languages.Languages;
  msgs = Translations.AppComponent;
  listTools = FusionTools;
  langInd = 0;
  lang = 'en';

  constructor(private title: Title, private route: ActivatedRoute) { }

  ngOnInit() {
    const lang = this.route.snapshot.data.lang;
    this.lang = this.langs.includes(lang) ? lang : 'en';
    this.langInd = this.langs.indexOf(this.lang);
    this.listTools = this.fusionTools.filter(t => t.titles[this.langInd] && t.titles[this.langInd] !== '-')
    this.title.setTitle(this.msgs.AppTitle[this.langInd]);
  }
}
