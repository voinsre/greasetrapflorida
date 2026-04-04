import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { contactAdminEmail, contactUserConfirmation } from '@/lib/email-template';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, website: honeypot } = body;

    if (honeypot) {
      return NextResponse.json({ success: true });
    }

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

    // Send emails (lazy-init Resend)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const from = process.env.RESEND_FROM_EMAIL || 'contact@greasetrapflorida.com';

        await Promise.all([
          // Admin notification
          process.env.ADMIN_EMAIL
            ? resend.emails.send({
                from,
                to: process.env.ADMIN_EMAIL,
                subject: `Contact Form: ${subject || 'General Inquiry'}`,
                html: contactAdminEmail({ name, email, subject, message }),
              })
            : null,
          // User confirmation
          resend.emails.send({
            from,
            to: email,
            subject: 'Message Received \u2014 Grease Trap Florida',
            html: contactUserConfirmation({ name }),
          }),
        ]);
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
