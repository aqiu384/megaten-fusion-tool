import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-demon-dlc-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <thead>
        <tr><th>{{ dlcTitle }}</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let demon of dlcDemons">
          <td>
            <label>{{ demon.name.split(',').join(', ') }}
              <input type="checkbox"
                [checked]="demon.included"
                (change)="toggledName.emit(demon.name)">
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class DemonDlcSettingsComponent {
  @Input() dlcDemons: { name: string, included: boolean }[];
  @Input() dlcTitle = 'Included DLC Demons';
  @Output() toggledName = new EventEmitter<string>();

  constructor(private title: Title) { }

  @Input() set appTitle(appTitle: string) {
    this.title.setTitle(`Fusion Settings - ${appTitle}`);
  }
}
