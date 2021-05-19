import { Component, ChangeDetectionStrategy, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PasswordEncodings } from '../models/constants';

@Component({
  selector: 'app-demon-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form">
      <textarea formControlName="password"></textarea>
    </form>
  `,
  styles: [`
    textarea { width: 98%; border-width: 3px; }
    textarea.ng-valid { border-color: lime; }
    textarea.ng-invalid { border-color: red; }
  `]
})
export class DemonPasswordComponent {
  @Output() passwordBytes = new EventEmitter<number[]>();

  form: FormGroup;
  isRedux = false;

  engRegex: RegExp;
  passwordRegex: RegExp;
  engBase64: { [char: string]: number; };
  japBase64: { [char: string]: number; };

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    const engCode = this.isRedux ? PasswordEncodings.ren : PasswordEncodings.eng;
    const engChars = this.isRedux ? PasswordEncodings.renChars : PasswordEncodings.engChars;

    this.engBase64 = engCode.split('').reduce((acc, c, i) => { acc[c] = i; return acc; }, {});
    this.japBase64 = PasswordEncodings.jap.split('').reduce((acc, c, i) => { acc[c] = i; return acc; }, {});
    this.japBase64 = PasswordEncodings.jen.split('').reduce((acc, c, i) => { acc[c] = i; return acc; }, this.japBase64);
    this.engRegex = new RegExp(['^([', engChars, ']){32}$'].join(''));
    this.passwordRegex = new RegExp([
      '^(\\s*)([', PasswordEncodings.jap, ']{16}|[', PasswordEncodings.jen, ']{16}|[', engChars, ']{16})',
      '(\\s*)([', PasswordEncodings.jap, ']{16}|[', PasswordEncodings.jen, ']{16}|[', engChars, ']{16})(\\s*)$'
    ].join(''));

    this.form = this.fb.group({
      password: [null, [Validators.required, Validators.pattern(this.passwordRegex)]],
    });

    this.form.valueChanges.subscribe(form => {
      const password = form.password.replace(/\s/g, '');
      if (this.form.valid) {
        if (this.engRegex.test(password)) {
          this.passwordBytes.emit(password.split('').map(c => this.engBase64[c]));
        } else {
          this.passwordBytes.emit(password.split('').map(c => this.japBase64[c]));
        }
      }
    });
  }
}

@Component({
  selector: 'app-redux-demon-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form">
      <textarea formControlName="password"></textarea>
    </form>
  `,
  styles: [`
    textarea { width: 98%; border-width: 3px; }
    textarea.ng-valid { border-color: lime; }
    textarea.ng-invalid { border-color: red; }
  `]
})
export class ReduxDemonPasswordComponent extends DemonPasswordComponent {
  createForm() {
    this.isRedux = true;
    super.createForm();
  }
}
