import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

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
        <tr>
          <td><a routerLink="../smt3">Shin Megami Tensei III: Nocturne</a></td>
          <td><a href="http://www.phpsimplicity.com/heretic/">
            http://www.phpsimplicity.com/heretic/
          </a></td>
        </tr>
        <tr>
          <td><a routerLink="../smtsj">Shin Megami Tensei: Strange Journey</a></td>
          <td><a href="https://www.gamefaqs.com/ds/961651-shin-megami-tensei-strange-journey/faqs/59384">
            https://www.gamefaqs.com/ds/961651-shin-megami-tensei-strange-journey/faqs/59384
          </a></td>
        </tr>
        <tr>
          <td><a routerLink="../smt4">Shin Megami Tensei IV</a></td>
          <td><a href="https://erikku.github.io/smt4tool/">
            https://erikku.github.io/smt4tool/
          </a></td>
        </tr>
        <tr>
          <td><a routerLink="../smt4f">Shin Megami Tensei IV: Apocalypse</a></td>
          <td><a href="http://gamers-high.com/megami4-final">
            http://gamers-high.com/megami4-final/
          </a></td>
        </tr>
        <tr>
          <td><a routerLink="../p5">Persona 5</a></td>
          <td><a href="http://spwiki.net/persona5/">
            http://spwiki.net/persona5/
          </a></td>
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
  constructor(private title: Title) { }

  ngOnInit() {
    this.title.setTitle(`Megami Tensei Fusion Tools`);
  }
}
