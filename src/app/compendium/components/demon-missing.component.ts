import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-demon-missing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="entry-table">
      <thead>
        <tr><th class="title">Entry for {{ name }}</th></tr>
      </thead>
      <tbody>
        <tr>
          <td *ngIf="name && name.includes('%20')">
            Error: Could not find entry in compendium for {{ name }}. Did you mean: 
            <a routerLink="../{{ name.split('%20').join(' ') }}">{{ name.split('%20').join(' ') }}</a>
          </td>
          <td *ngIf="!name || !name.includes('%20')">Error: Could not find entry in compendium for {{ name }}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class DemonMissingComponent {
  @Input() name: string;
}
