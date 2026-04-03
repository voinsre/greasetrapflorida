import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { business_id, business_name, name, email, phone, establishment_type, message } = body;

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

    // Send email notification (lazy-init Resend)
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'leads@greasetrapflorida.com',
          to: process.env.ADMIN_EMAIL,
          subject: `New Lead: ${business_name || 'General Inquiry'}`,
          html: `
            <h2>New Quote Request</h2>
            <p><strong>Business:</strong> ${business_name || 'N/A'}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Establishment:</strong> ${establishment_type || 'N/A'}</p>
            <p><strong>Message:</strong> ${message || 'N/A'}</p>
          `,
        });
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
