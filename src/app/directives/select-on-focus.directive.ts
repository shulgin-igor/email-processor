import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appSelectOnFocus]',
})
export class SelectOnFocusDirective {
  @Input() set appSelectOnFocus(value: boolean) {
    if (value) {
      this.el.nativeElement.focus();
    }
  }

  constructor(private readonly el: ElementRef) {}
}
