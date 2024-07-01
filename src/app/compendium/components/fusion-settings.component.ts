import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FusionSettings } from '../models/fusion-settings';
import { translateComp } from '../models/translator';
import Translations from  '../data/translations.json';

@Component({
  selector: 'app-fusion-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container>
      <h2>{{ msgs.DlcTitle | translateComp:lang }}</h2>
      <table class="entry-table">
        <thead>
          <tr><th class="title">Unlock Conditions</th></tr>
        </thead>
        <tbody>
          <ng-container *ngIf="showEnableAll">
            <tr><th>All Demons</th></tr>
            <tr>
              <td>
                <button (click)="toggledAll.emit(true)" style="width: 50%;">Enable All</button>
                <button (click)="toggledAll.emit(false)" style="width: 50%;">Disable All</button>
              </td>
            </tr>
          </ng-container>
          <ng-container *ngFor="let cat of fusionSettings.displayHeaders">
            <tr><th>{{ cat.category }}</th></tr>
            <tr *ngFor="let setting of cat.settings">
              <td>
                <label>{{ setting.caption }}
                  <input type="checkbox"
                    [checked]="setting.enabled"
                    (change)="toggledName.emit(setting.name)">
                </label>
              </td>
            </tr>
          </ng-container>
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
  @Output() toggledAll = new EventEmitter<boolean>();
  @Output() toggledName = new EventEmitter<string>();
  msgs = Translations.FusionSettingsComponent;

  constructor(private title: Title) { }

  @Input() set appTitle(appTitle: string) {
    this.title.setTitle(translateComp(this.msgs.AppTitle, this.lang) + appTitle);
  }
}
