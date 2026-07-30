import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-demon-missing',
  imports: [RouterModule],
  template: `
    <table class="entry-table">
      <thead>
        <tr><th class="title">Entry for {{ name }}</th></tr>
      </thead>
      <tbody>
        <tr>
          @if (name && name.includes('%20')) {
            <td>
              Error: Could not find entry in compendium for {{ name }}. Did you mean:
              <a routerLink="../{{ name.split('%20').join(' ') }}">{{ name.split('%20').join(' ') }}</a>
            </td>
          }
          @if (!name || !name.includes('%20')) {
            <td>Error: Could not find entry in compendium for {{ name }}</td>
          }
        </tr>
      </tbody>
    </table>
  `
})
export class DemonMissingComponent {
  @Input() name: string;
}
