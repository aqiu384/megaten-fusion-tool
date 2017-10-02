import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PositionEdgesService } from './position-edges.service';
import { PositionStickyDirective } from './position-sticky.directive';
import { ColumnWidthsDirective } from './column-widths.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PositionStickyDirective,
    ColumnWidthsDirective
  ],
  exports: [
    PositionStickyDirective,
    ColumnWidthsDirective
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}
