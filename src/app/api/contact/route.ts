import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: dbError } = await supabase.from('contact_messages').insert({
      name,
      email,
      subject: subject || null,
      message,
    });

    if (dbError) {
      console.error('Contact message insert error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save message.' },
        { status: 500 }
      );
    }

    // Send email notification (lazy-init Resend)
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'contact@greasetrapflorida.com',
          to: process.env.ADMIN_EMAIL,
          subject: `Contact Form: ${subject || 'General Inquiry'}`,
          html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        });
      } catch (emailErr) {
        console.error('Email notification failed:', emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request.' },
      { status: 400 }
    );
  }
}
