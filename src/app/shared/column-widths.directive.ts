import {
  Directive,
  ElementRef,
  Input,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appColumnWidths]'
})
export class ColumnWidthsDirective {
  @Input() borderWidth = 2;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) { }

  get colWidths(): number[] {
    const colWidths = [];
    const rows = this.elementRef.nativeElement.children;

    if (rows.length) {
      for (const column of rows[rows.length - 1].children) {
        colWidths.push(column.getBoundingClientRect().width - 2 * this.borderWidth);
      }
    }

    return colWidths;
  }

  @Input() set colWidths(colWidths: number[]) {
    const rows = this.elementRef.nativeElement.children;

    if (rows.length) {
      const cols = rows[rows.length - 1].children;

      for (let i = 0; i < cols.length; i++) {
        this.renderer.setStyle(cols[i], 'width', `${colWidths[i]}px`);
      }
    }
  }
}
