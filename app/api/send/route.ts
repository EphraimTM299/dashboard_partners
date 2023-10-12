
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import AppleReceiptEmail from '../../emails/welcome';

const resend = new Resend('re_HzYbXMrB_3Xe5iTqvVwcTCd2MqNvAJXN2');

export async function POST(resuest:Request) {
  const{firstname, email, clientAddress,lastName, invoiceDate, orderID, laundromat, delivery, price, serviceName, total} = await resuest.json();
  try {
    const data = await resend.emails.send({
      from: 'Ethan Hunt <info@teillo.com>',
      to: `${email}`,
      subject: 'Thank you for your business',
      react: AppleReceiptEmail({
        firstname, clientAddress, email, lastName,invoiceDate,orderID, laundromat, delivery, price, serviceName, total 
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
