import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-demon-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form">
      <h2>Password Generator</h2>
      <table class="entry-table">
        <thead>
          <tr><th colspan="2" class="title">Passwords</th></tr>
          <tr>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <textarea formControlName="password" (input)="emitPassword()"></textarea>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  `,
  styles: [`
    textarea { width: 16em; height: 3em; border-width: 3px; }
    textarea.ng-valid { border-color: lime; }
    textarea.ng-invalid { border-color: red; }
  `]
})
export class DemonPasswordComponent implements OnChanges {
  @Input() encoding: string;
  @Input() inverseEncoding: { [letter: string]: number };
  @Input() encodeBytes: number[];
  @Output() decodedBytes = new EventEmitter<number[]>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnChanges(): void { this.setPassword(); }

  createForm() {
    const validChars =
      "しんいくみＢやるＹけひＫＦとＨむＡちにＺきＷよＬをのたれＮえＳふわＪそりすＣめＰへＱＧＲＤこＭＴまつせかはＥＵてさなあもゆおうろ" +
      "0-9A-Za-z&?$%#+-";
    const passwordRegex = new RegExp(`^(\\s*)([${validChars}]{16})(\\s*)([${validChars}]{16})(\\s*)$`);

    this.form = this.fb.group({
      password: [null, [Validators.required, Validators.pattern(passwordRegex)]],
    });
  }

  emitPassword() {
    if (this.form.valid) {
      const password = this.form.controls.password.value.replace(/\s/g, '');
      this.decodedBytes.emit(password.split('').map(c => this.inverseEncoding[c]));
    }
  }

  setPassword() {
    const password = this.encodeBytes.map(b => this.encoding.charAt(b)).join('');
    this.form.setValue({
      password: `${password.substring(0, 16)}\n${password.substring(16)}`
    });
  }
}
