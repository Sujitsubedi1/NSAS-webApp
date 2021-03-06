import { Component, OnInit, AfterViewChecked } from '@angular/core';
declare let paypal: any;
import { ActionSequence } from 'protractor';
import { reject } from 'q';

@Component({
  selector: 'app-donate-from-paypal',
  templateUrl: './donate-from-paypal.component.html',
  styleUrls: ['./donate-from-paypal.component.css']
})
export class DonateFromPaypalComponent implements AfterViewChecked{
  addScript: boolean = false;

  paypalLoad: boolean = true;
  finalAmount: Number;
  paypalConfig = {
    env :'sandbox',
    style:
    {
      label: 'paypal',
      size:  'medium',
      shape: 'pill',
      color: 'blue',
      tagline: false
    },
    client:
    {
      sandbox: 'AYbsLqYpRhzKVClfSnh_NPyEqG66DdUWM7WfV0uE5m79_sX90RcL4KTCRXc5spZgRlo1yNUo5ADGWbJV',
      production: '<your-pproduction-key here>'
    },
    commit: true,
    payment: (data,actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            { amount: { total: this.finalAmount,currency: 'USD'}}
          ]
        }
      })
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then(function() {
          //Redirect when payment is succesful\\\
           window.alert('Payment Complete!');


      })
    }
  };
  ngAfterViewChecked() : void
  {
      if (!this.addScript)
        {
            this.addPaypalScript().then(() => {
              paypal.Button.render(this.paypalConfig,'#paypal-checkout-button ')
            ;
             this.paypalLoad= false;
            })
        }
  }
  addPaypalScript()
  {
    this.addScript= true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script');
      scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js'
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    })
  }
}

