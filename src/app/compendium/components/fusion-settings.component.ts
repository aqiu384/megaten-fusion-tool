import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FusionSettings } from '../models/fusion-settings';

@Component({
  selector: 'app-fusion-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container>
      <h2>{{ dlcTitle }}</h2>
      <table class="entry-table">
        <thead>
          <tr><th class="title">Unlock Conditions</th></tr>
        </thead>
        <tbody>
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
  @Input() dlcTitle = 'Included DLC Demons';
  @Input() langEn = true;
  @Input() fusionSettings: FusionSettings;
  @Output() toggledName = new EventEmitter<string>();

  constructor(private title: Title) { }

  @Input() set appTitle(appTitle: string) {
    this.title.setTitle((this.langEn ? 'Fusion Settings - ' : '合体設定 ') + appTitle);
  }
}
