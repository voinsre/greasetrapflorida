import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { leadAdminEmail, leadUserConfirmation } from '@/lib/email-template';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { business_id, business_name, name, email, phone, establishment_type, message, website: honeypot } = body;

    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required.' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: dbError } = await supabase.from('leads').insert({
      business_id: business_id || null,
      business_name: business_name || null,
      name,
      email,
      phone,
      establishment_type: establishment_type || null,
      message: message || null,
    });

    if (dbError) {
      console.error('Lead insert error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save lead.' },
        { status: 500 }
      );
    }

    const emailData = { business_name, name, email, phone, establishment_type, message };

    // Send emails (lazy-init Resend)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const from = process.env.RESEND_FROM_EMAIL || 'leads@greasetrapflorida.com';

        await Promise.all([
          // Admin notification
          process.env.ADMIN_EMAIL
            ? resend.emails.send({
                from,
                to: process.env.ADMIN_EMAIL,
                subject: `New Lead: ${business_name || 'General Inquiry'}`,
                html: leadAdminEmail(emailData),
              })
            : null,
          // User confirmation
          resend.emails.send({
            from,
            to: email,
            subject: 'Your Quote Request \u2014 Grease Trap Florida',
            html: leadUserConfirmation({ name, business_name }),
          }),
        ]);
      } catch (emailErr) {
        console.error('Email notification failed:', emailErr);
        // Don't fail the request if email fails
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
