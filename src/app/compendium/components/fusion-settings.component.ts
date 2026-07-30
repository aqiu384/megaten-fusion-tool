import { Component, Input, output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FusionSettings } from '../models/fusion-settings';

import { translateComp } from '../models/translator';
import { TranslateCompPipe } from '../pipes';
import Translations from  '../data/translations.json';

@Component({
  selector: 'app-fusion-settings',
  imports: [TranslateCompPipe],
  template: `
    <ng-container>
      <h2>{{ msgs.DlcTitle | translateComp:lang }}</h2>
      <table class="entry-table">
        <thead>
          <tr><th class="title">Unlock Conditions</th></tr>
        </thead>
        <tbody>
          @if (showEnableAll) {
            <tr><th>All Demons</th></tr>
            <tr>
              <td>
                <button (click)="toggledAll.emit(true)" style="width: 50%;">Enable All</button>
                <button (click)="toggledAll.emit(false)" style="width: 50%;">Disable All</button>
              </td>
            </tr>
          }
          @for (cat of fusionSettings.displayHeaders; track cat) {
            <tr><th>{{ cat.category }}</th></tr>
            @for (setting of cat.settings; track setting) {
              <tr>
                <td>
                  <label>{{ setting.caption }}
                    <input type="checkbox"
                      [checked]="setting.enabled"
                      (change)="toggledName.emit(setting.name)">
                  </label>
                </td>
              </tr>
            }
          }
        </tbody>
      </table>
    </ng-container>
  `
})
export class FusionSettingsComponent {
  @Input() dlcDemons: { name: string, included: boolean }[];
  @Input() lang = 'en';
  @Input() fusionSettings: FusionSettings;
  @Input() showEnableAll = false;
  toggledAll = output<boolean>();
  toggledName = output<string>();
  msgs = Translations.FusionSettingsComponent;

  constructor(private title: Title) { }

  @Input() set appTitle(appTitle: string) {
    this.title.setTitle(translateComp(this.msgs.AppTitle, this.lang) + appTitle);
  }
}
