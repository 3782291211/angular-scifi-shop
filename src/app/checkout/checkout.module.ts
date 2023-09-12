import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout/checkout.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AddressStepComponent } from './address-step/address-step.component';
import { NgLetModule } from 'ng-let';
import { NgxStripeModule } from 'ngx-stripe';
import { PaymentComponent } from './payment/payment.component';
import { SpinnerModule } from '../spinner/spinner.module';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    CheckoutComponent,
    AddressStepComponent,
    PaymentComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    NgLetModule,
    SpinnerModule,
    ClipboardModule,
    NgxStripeModule.forRoot(import.meta.env.NG_APP_STRIPE_KEY)
  ],
  exports: [
    AddressStepComponent
  ]
})
export class CheckoutModule { }
