import { Component, Input } from '@angular/core';
import { AbstractControl } from "@angular/forms";

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss'
})
export class ErrorMessageComponent {
  @Input() form?: AbstractControl;
  @Input() errors?: {[key: string]: string[] | null} = {};
}
