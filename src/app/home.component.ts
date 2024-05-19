import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import PAGE_TRANSLATION_JSON from './page-translations/data/translations.json'

@Component({
  template: `
    <table [ngStyle]="{ marginLeft: 'auto', marginRight: 'auto', width: '1080px' }">
      <tr *ngFor="let tool of fusionTools">
        <th [routerLink]="'../' + tool.abbr" class="nav" routerLinkActive="active">
          <a [routerLink]="'../' + tool.abbr + (tool.game.includes('Persona') ? '/personas' : '/demons')">{{ tool.game }}</a>
        </th>
      </tr>
    </table>
  `
})
export class HomeComponent implements OnInit {
  static readonly FUSION_TOOLS_EN = [
    { game: 'Shin Megami Tensei', abbr: 'smt1' },
    { game: 'Shin Megami Tensei II', abbr: 'smt2' },
    { game: 'Shin Megami Tensei If...', abbr: 'smtif' },
    { game: 'Shin Megami Tensei NINE', abbr: 'smt9' },
    { game: 'Shin Megami Tensei IMAGINE', abbr: 'smtim' },
    { game: 'Shin Megami Tensei III: Nocturne', abbr: 'smt3' },
    { game: 'Shin Megami Tensei: Strange Journey', abbr: 'smtsj' },
    { game: 'Shin Megami Tensei: Strange Journey Redux', abbr: 'smtdsj' },
    { game: 'Shin Megami Tensei IV', abbr: 'smt4' },
    { game: 'Shin Megami Tensei IV Apocalypse', abbr: 'smt4f' },
    { game: 'Shin Megami Tensei V', abbr: 'smt5' },
    { game: 'Shin Megami Tensei: Devil Summoner', abbr: 'dsum' },
    { game: 'Devil Summoner: Soul Hackers', abbr: 'dssh' },
    { game: 'Raidou Kuzunoha vs. The Soulless Army', abbr: 'krch' },
    { game: 'Raidou Kuzunoha vs. King Abaddon', abbr: 'krao' },
    { game: 'Soul Hackers 2', abbr: 'sh2' },
    { game: 'Megami Ibunroku Persona', abbr: 'p1' },
    { game: 'Persona 2: Innocent Sin', abbr: 'p2t' },
    { game: 'Persona 2: Eternal Punishment', abbr: 'p2b' },
    { game: 'Persona 3', abbr: 'p3' },
    { game: 'Persona 3 FES', abbr: 'p3f' },
    { game: 'Persona 3 FES: The Answer', abbr: 'p3a' },
    { game: 'Persona 3 Portable', abbr: 'p3p' },
    { game: 'Persona 3 Reload', abbr: 'p3r' },
    { game: 'Persona 4', abbr: 'p4' },
    { game: 'Persona 4 Golden', abbr: 'p4g' },
    { game: 'Persona 5', abbr: 'p5' },
    { game: 'Persona 5 Royal', abbr: 'p5r' },
    { game: 'Persona 5 Strikers', abbr: 'p5s' },
    { game: 'Persona 5 Tactica', abbr: 'p5t' },
    { game: 'Persona Q: Shadow of the Labyrinth', abbr: 'pq' },
    { game: 'Persona Q2: New Cinema Labyrinth', abbr: 'pq2' },
    { game: 'Majin Tensei', abbr: 'mjn1' },
    { game: 'Majin Tensei II: Spiral Nemesis', abbr: 'mjn2' },
    { game: 'Devil Survivor', abbr: 'ds1' },
    { game: 'Devil Survivor Overclocked', abbr: 'dso' },
    { game: 'Devil Survivor 2', abbr: 'ds2' },
    { game: 'Devil Survivor 2 Record Breaker', abbr: 'ds2br' },
    { game: 'Shin Megami Tensei: Liberation Dx2', abbr: 'dx2' },
  ]

  static readonly FUSION_TOOLS_JP = [
    { game: '真・女神転生IV', abbr: 'smt4' },
    { game: '真・女神転生IV FINAL', abbr: 'smt4f' },
    { game: '真・女神転生V', abbr: 'smt5' },
    { game: 'ソウルハッカーズ2', abbr: 'sh2' }
  ]

  static readonly FUSION_TOOLS_ZH_CN = [
    { game: '女神异闻录3 Reload', abbr: 'p3r' }
  ]

  static readonly LANGUAGE_MAP = {
    'en': HomeComponent.FUSION_TOOLS_EN,
    'ja': HomeComponent.FUSION_TOOLS_JP,
    'zh-cn': HomeComponent.FUSION_TOOLS_ZH_CN
  }

  lang = 'en';
  fusionTools = HomeComponent.FUSION_TOOLS_EN;

  constructor(private title: Title, private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot.data.lang) {
      this.lang = this.route.snapshot.data.lang
    }
    this.fusionTools = HomeComponent.LANGUAGE_MAP[this.lang];
    this.title.setTitle(PAGE_TRANSLATION_JSON['fusion-tool-title'][this.lang]);
  }
}
