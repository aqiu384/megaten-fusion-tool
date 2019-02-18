import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';

declare var qrcode: any;

@Component({
  selector: 'app-qrcode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [innerHtml]="qrImg"></div>
  `
})
export class QrcodeComponent implements OnChanges {
  @Input() byteArray = [];
  @Input() errorLvl = 'L';
  @Input() typeNum = 10;

  qrFactory = qrcode(this.typeNum, this.errorLvl);
  qrImg = null;

  ngOnChanges() { this.createQrcode(); }

  createQrcode() {
    this.qrFactory = qrcode(this.typeNum, this.errorLvl);
    this.qrFactory.addData(this.byteArray.map(c => String.fromCharCode(c)).join(''));
    this.qrFactory.make();
    this.qrImg = this.qrFactory.createImgTag(5);
  }
}