import { Injectable } from '@nestjs/common';
import * as Iyzipay from 'iyzipay';

@Injectable()
export class PaymentService {
  private iyzipay: Iyzipay;

  constructor() {
    this.iyzipay = new Iyzipay({
      apiKey: 'sandbox-HgrdH8h7nmOdF9KBBP9DbmuO6JIBXM2M',
      secretKey: 'sandbox-4ANULr9tpDn6uKpt2jRzGwYxGjcKevxq',
      uri: 'https://sandbox-api.iyzipay.com',
    });
  }

  async createPayment(): Promise<any> {
    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: '123456789',
      price: '100.00', // Belirlediğin fiyat
      paidPrice: '100.00',
      currency: Iyzipay.CURRENCY.TRY,
      basketId: 'B67832',
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: 'http://localhost:7001/payment/callback', // Ngrok URL'niz
      buyer: {
        id: 'BY789',
        name: 'John',
        surname: 'Doe',
        gsmNumber: '+905350000000',
        email: 'email@domain.com',
        identityNumber: '74300864791',
        registrationAddress:
          'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732',
      },
      shippingAddress: {
        contactName: 'Jane Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34742',
      },
      billingAddress: {
        contactName: 'Jane Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34742',
      },
      basketItems: [
        {
          id: 'BI101',
          name: 'Product 1',
          category1: 'Category',
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: '100.00',
        },
      ],
    };

    return new Promise((resolve, reject) => {
      this.iyzipay.checkoutFormInitialize.create(request, (err, result) => {
        if (err) {
          console.error('Iyzico Error:', err);
          reject(err);
        } else {
          //console.log('Iyzico Result:', result); // Yanıtı konsola yazdırarak kontrol edin
          resolve(result);
        }
      });
    });
  }

  async retrievePayment(token: string): Promise<any> {
    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: '123456789',
      token: token,
    };

    return new Promise((resolve, reject) => {
      this.iyzipay.checkoutForm.retrieve(request, (err, result) => {
        if (err) {
          console.error('Error retrieving payment:', err);
          reject(err);
        } else {
          const { status, price } = result;
          console.log('Payment Status:', status);
          console.log('Payment Price:', price);
          resolve(result);
        }
      });
    });
  }
}
