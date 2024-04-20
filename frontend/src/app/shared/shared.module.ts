import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from "./error-message/error-message.component";


@NgModule({
  declarations: [
    ErrorMessageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ErrorMessageComponent
  ]
})
export class SharedModule { }
