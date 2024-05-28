import { Component, ChangeDetectionStrategy, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { PositionEdgesService } from '../../shared/position-edges.service';
import { PositionStickyDirective } from '../../shared/position-sticky.directive';
import Tranlations from '../data/translations.json';

@Component({
  selector: 'app-smt-fusions',
  providers: [ PositionEdgesService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <table #stickyTable appPositionSticky class="list-table">
        <thead>
          <tr>
            <th *ngFor="let option of fusionOptions"
              class="nav"
              routerLinkActive="active"
              [routerLink]="option.link"
              [style.width.%]="100 / fusionOptions.length"
              [routerLinkActiveOptions]="{ exact: true }">
              <a [routerLink]="option.link">{{ option.title | translateComp:lang }}</a>
            </th>
          </tr>
          <tr *ngIf="excludedDlc">
            <th [attr.colspan]="fusionOptions.length" class="title">
              {{ msgs.DlcExcluded | translateComp:lang }}
            </th>
          <tr>
          <tr *ngIf="showFusionAlert">
            <th [attr.colspan]="fusionOptions.length" class="title"><ng-content></ng-content></th>
          <tr>
        </thead>
      </table>
      <router-outlet></router-outlet>
    </div>
  `
})
export class SmtFusionsComponent implements OnInit, OnChanges {
  @ViewChild(PositionStickyDirective) stickyTable: PositionStickyDirective;
  @Input() hasTripleFusion = false;
  @Input() showFusionAlert = false;
  @Input() excludedDlc = false;
  @Input() lang = 'en';

  msgs = Tranlations.SmtFusionsComponent;
  fusionOptions = [
    { title: this.msgs.NormalFissions, link: 'fissions' },
    { title: this.msgs.NormalFusions, link: 'fusions' }
  ];

  ngOnInit() {
    if (this.hasTripleFusion) {
      this.fusionOptions = [
        { title: this.msgs.DoubleFissions, link: 'fissions' },
        { title: this.msgs.TripleFissions, link: 'fissions/triple' },
        { title: this.msgs.TripleFusions, link: 'fusions/triple' },
        { title: this.msgs.DoubleFusions, link: 'fusions' }
      ];
    }
  }

  ngOnChanges() {
    setTimeout(() => this.stickyTable.nextEdges());
  }
}
