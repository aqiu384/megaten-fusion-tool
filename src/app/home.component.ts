import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  template: `
    <table [ngStyle]="{ marginLeft: 'auto', marginRight: 'auto', width: '1080px' }">
      <tr *ngFor="let tool of fusionTools">
        <th [routerLink]="'../' + tool.abbr" class="nav" routerLinkActive="active">
          <a [routerLink]="'../' + tool.abbr">{{ tool.game }}</a>
        </th>
      </tr>
    </table>
  `
})
export class HomeComponent implements OnInit {
  fusionTools = [
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
    { game: 'Megami Ibunroku Persona', abbr: 'mib' },
    { game: 'Persona 3', abbr: 'p3' },
    { game: 'Persona 3 FES', abbr: 'p3fes' },
    { game: 'Persona 3 FES: The Answer', abbr: 'p3aeg' },
    { game: 'Persona 3 Portable', abbr: 'p3p' },
    { game: 'Persona 4', abbr: 'p4' },
    { game: 'Persona 4 Golden', abbr: 'p4g' },
    { game: 'Persona 5', abbr: 'p5' },
    { game: 'Persona 5 Royal', abbr: 'p5r' },
    { game: 'Persona 5 Strikers', abbr: 'p5s' },
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

  constructor(private title: Title) { }

  ngOnInit() {
    this.title.setTitle(`Megami Tensei Fusion Tools`);
  }
}
