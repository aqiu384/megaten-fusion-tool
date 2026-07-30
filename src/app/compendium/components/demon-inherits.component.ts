import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateCompPipe, TranslateElementLabelPipe, RoundInheritPercentPipe, ElementAffinityToStringPipe } from '../pipes';
import Translations from '../data/translations.json';

@Component({
  selector: 'app-demon-inherits',
  imports: [CommonModule, TranslateCompPipe, TranslateElementLabelPipe, RoundInheritPercentPipe, ElementAffinityToStringPipe],
  template: `
    <table class="entry-table">
      <thead>
        <tr>
          @if (!hasLvls) {
            <th [attr.colspan]="inheritHeaders.length" class="title">Inheritable Skills</th>
          }
          @if (hasLvls && inheritHeaders.length) {
            <th [attr.colspan]="inheritHeaders.length" class="title">
              {{ msgs.SkillAffinities | translateComp:lang }}
            </th>
          }
        </tr>
        <tr [ngClass]="{ capitalize: !hasIcons }">
          @for (element of inheritHeaders; track $index) {
            <th [style.width.%]="100 / inheritHeaders.length">
              @if (!hasIcons) {
                {{ element }}
              }
              @if (hasIcons) {
                <div [title]="element | translateElementLabel:lang" class="element-icon {{ element }}">{{ element }}</div>
              }
            </th>
          }
        </tr>
      </thead>
      <tbody>
        @if (!hasLvls && !hasChance) {
          <tr>
            @for (inherit of inherits; track $index) {
              <td [style.color]="inherit ? null : 'transparent'">
                {{ inherit ? 'yes' : 'no' }}
              </td>
            }
          </tr>
        }
        @if (hasChance) {
          <tr>
            @for (affinity of inherits; track $index) {
              <td class="affinity{{ affinity | roundInheritPercent }}">
                {{ affinity }}%
              </td>
            }
          </tr>
        }
        @if (hasLvls) {
          <tr>
            @for (affinity of inherits; track $index) {
              <td class="affinity{{ affinity }}">
                {{ affinity | affinityToString }}
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: [`
    .capitalize { text-transform: capitalize; }
  `],
})
export class DemonInheritsComponent {
  @Input() inheritHeaders: string[] = [];
  @Input() inherits: number[] = [];
  @Input() hasChance = false;
  @Input() hasIcons = true;
  @Input() hasLvls = false;
  @Input() lang = 'en';
  msgs = Translations.DemonInheritsComponent;
}
