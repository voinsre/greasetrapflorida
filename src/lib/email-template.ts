/**
 * Shared branded email template for all transactional emails.
 * Uses inline styles for maximum email client compatibility.
 * Follows the site's gray-900 / amber-500 design language.
 */

const BRAND = {
  name: 'Grease Trap Florida',
  url: 'https://greasetrapflorida.com',
  amber: '#f59e0b',
  amberDark: '#d97706',
  gray900: '#111827',
  gray600: '#4b5563',
  gray100: '#f3f4f6',
};

function layout(body: string, preheader?: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND.gray900};padding:24px 32px;text-align:center;">
              <a href="${BRAND.url}" style="color:${BRAND.amber};font-size:22px;font-weight:700;text-decoration:none;letter-spacing:-0.02em;">
                ${BRAND.name}
              </a>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:${BRAND.gray100};padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
              <a href="${BRAND.url}" style="color:${BRAND.amberDark};font-size:14px;font-weight:700;text-decoration:none;">${BRAND.name}</a>
              <p style="margin:6px 0 0;font-size:13px;color:${BRAND.gray600};">
                Florida&rsquo;s grease trap service directory
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">
                This is an automated message. Please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

function heading(text: string) {
  return `<h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:${BRAND.gray900};">${text}</h1>`;
}

function paragraph(text: string) {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${BRAND.gray600};">${text}</p>`;
}

function dataRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 12px;font-size:14px;color:${BRAND.gray600};font-weight:600;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:8px 12px;font-size:14px;color:${BRAND.gray900};">${value}</td>
    </tr>`;
}

function dataTable(rows: [string, string][]) {
  const rowsHtml = rows
    .filter(([, v]) => v && v !== 'N/A')
    .map(([l, v]) => dataRow(l, v))
    .join('');
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.gray100};border-radius:8px;margin:16px 0 24px;border:1px solid #e5e7eb;">
      ${rowsHtml}
    </table>`;
}

function ctaButton(text: string, href: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background-color:${BRAND.amber};border-radius:8px;">
          <a href="${href}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">${text}</a>
        </td>
      </tr>
    </table>`;
}

// ─── Lead / Quote ────────────────────────────────────────────────

export function leadAdminEmail(data: {
  business_name?: string;
  name: string;
  email: string;
  phone: string;
  establishment_type?: string;
  message?: string;
}) {
  return layout(
    [
      heading('New Quote Request'),
      paragraph(`A potential customer just submitted a quote request${data.business_name ? ` for <strong>${data.business_name}</strong>` : ''}.`),
      dataTable([
        ['Name', data.name],
        ['Email', `<a href="mailto:${data.email}" style="color:${BRAND.amberDark};text-decoration:none;">${data.email}</a>`],
        ['Phone', `<a href="tel:${data.phone}" style="color:${BRAND.amberDark};text-decoration:none;">${data.phone}</a>`],
        ['Business', data.business_name || 'General Inquiry'],
        ['Establishment', data.establishment_type || 'N/A'],
        ['Message', (data.message || 'N/A').replace(/\n/g, '<br>')],
      ]),
      paragraph('Reply promptly — quick responses win the job.'),
    ].join(''),
    `New quote request from ${data.name}`
  );
}

export function leadUserConfirmation(data: {
  name: string;
  business_name?: string;
}) {
  const firstName = data.name.split(' ')[0];
  return layout(
    [
      heading(`Thanks, ${firstName}!`),
      paragraph(`We have received your quote request${data.business_name ? ` for <strong>${data.business_name}</strong>` : ''} and it has been forwarded to verified grease trap service providers in your area.`),
      paragraph('<strong>What happens next:</strong>'),
      paragraph('• A qualified provider will reach out within <strong>24 hours</strong><br>• Compare quotes from multiple companies<br>• No obligation — the quote is completely free'),
      ctaButton('Browse More Companies', `${BRAND.url}/companies`),
      paragraph(`If you have questions in the meantime, visit our <a href="${BRAND.url}/guides" style="color:${BRAND.amberDark};text-decoration:none;font-weight:600;">guides</a> or <a href="${BRAND.url}/contact" style="color:${BRAND.amberDark};text-decoration:none;font-weight:600;">contact us</a>.`),
    ].join(''),
    `Your quote request has been received`
  );
}

// ─── Claim ───────────────────────────────────────────────────────

export function claimAdminEmail(data: {
  business_name?: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
}) {
  return layout(
    [
      heading('New Business Claim'),
      paragraph(`Someone wants to claim <strong>${data.business_name || 'a business'}</strong>.`),
      dataTable([
        ['Business', data.business_name || 'Unknown'],
        ['Name', data.name],
        ['Email', `<a href="mailto:${data.email}" style="color:${BRAND.amberDark};text-decoration:none;">${data.email}</a>`],
        ['Phone', `<a href="tel:${data.phone}" style="color:${BRAND.amberDark};text-decoration:none;">${data.phone}</a>`],
        ['Role', data.role || 'N/A'],
      ]),
      paragraph('Review this claim and verify ownership before approving.'),
    ].join(''),
    `New claim for ${data.business_name || 'a business'}`
  );
}

export function claimUserConfirmation(data: {
  name: string;
  business_name?: string;
}) {
  const firstName = data.name.split(' ')[0];
  return layout(
    [
      heading(`Claim Received, ${firstName}!`),
      paragraph(`We have received your claim for <strong>${data.business_name || 'your business'}</strong> and our team is reviewing it.`),
      paragraph('<strong>What happens next:</strong>'),
      paragraph("• Our team will verify your ownership within <strong>48 hours</strong><br>• You will receive an email once your claim is approved<br>• After approval, you can update your listing info and earn a verified badge"),
      ctaButton('View Your Listing', `${BRAND.url}/companies`),
      paragraph(`Questions? <a href="${BRAND.url}/contact" style="color:${BRAND.amberDark};text-decoration:none;font-weight:600;">Contact us</a> and we will help.`),
    ].join(''),
    `Your business claim is being reviewed`
  );
}

// ─── Contact ─────────────────────────────────────────────────────

export function contactAdminEmail(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  return layout(
    [
      heading('New Contact Message'),
      paragraph(`<strong>${data.name}</strong> reached out via the contact form.`),
      dataTable([
        ['Name', data.name],
        ['Email', `<a href="mailto:${data.email}" style="color:${BRAND.amberDark};text-decoration:none;">${data.email}</a>`],
        ['Subject', data.subject || 'General Inquiry'],
        ['Message', data.message.replace(/\n/g, '<br>')],
      ]),
    ].join(''),
    `Contact form: ${data.subject || 'General Inquiry'}`
  );
}

export function contactUserConfirmation(data: {
  name: string;
}) {
  const firstName = data.name.split(' ')[0];
  return layout(
    [
      heading(`Thanks for reaching out, ${firstName}!`),
      paragraph('We have received your message and will get back to you as soon as possible — typically within one business day.'),
      paragraph('In the meantime, you might find these resources helpful:'),
      paragraph(`• <a href="${BRAND.url}/guides" style="color:${BRAND.amberDark};text-decoration:none;font-weight:600;">Grease Trap Guides</a> — sizing, maintenance, and regulations<br>• <a href="${BRAND.url}/companies" style="color:${BRAND.amberDark};text-decoration:none;font-weight:600;">Find a Provider</a> — browse verified companies near you<br>• <a href="${BRAND.url}/cost" style="color:${BRAND.amberDark};text-decoration:none;font-weight:600;">Cost Guide</a> — what to expect for pricing`),
    ].join(''),
    `We received your message`
  );
}
