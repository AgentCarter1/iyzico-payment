import { Controller, Post, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express'; // Express türlerini içe aktarın

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/create')
  async createPayment(@Res() res: Response) {
    // Response türünü belirtin
    try {
      const paymentInit = await this.paymentService.createPayment();

      if (paymentInit.paymentPageUrl) {
        return res.redirect(paymentInit.paymentPageUrl); // Kullanıcıyı Iyzico ödeme sayfasına yönlendir
      } else {
        console.error('Payment URL not found in Iyzico response:', paymentInit);
        return res.status(500).send("Ödeme URL'si bulunamadı.");
      }
    } catch (error) {
      console.error('Error during payment initialization:', error);
      return res.status(500).send('Ödeme başlatılırken bir hata oluştu.');
    }
  }

  @Post('/callback')
  async paymentCallback(@Req() req: Request, @Res() res: Response) {
    const { token } = req.body; // Token'ı alın
    //console.log('Payment Callback Token:', token);

    try {
      const paymentResult = await this.paymentService.retrievePayment(token);

      if (paymentResult.status === 'success') {
        return res.send('Payment completed successfully!');
      } else {
        return res.send('Payment failed or incomplete.');
      }
    } catch (error) {
      console.error('Error during payment retrieval:', error);
      return res
        .status(500)
        .send('Ödeme durumu sorgulanırken bir hata oluştu.');
    }
  }
}
