import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const url = `https://us18.api.mailchimp.com/3.0/lists/${process.env.NEXT_PUBLIC_MAILCHIMP_LIST_KEY}/members`;
  const headers = {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY}`
  };
  const reqPayload = await req.json();
  const data = {
    email_address: reqPayload.email,
    status: 'subscribed'
  };
  try {
    const response = await axios.post(url, data, { headers });
    if (response.status === 200)
      return NextResponse.json({ message: 'Subscribed!!' }, { status: 200 });
    return NextResponse.json({ message: 'Not Subscribed!!' }, { status: 500 });
  } catch (error) {
    console.error('Mailchimp API error:', error);
    return NextResponse.json(
      { message: 'Not Subscribed!!' },
      {
        status: 400
      }
    );
  }
}
