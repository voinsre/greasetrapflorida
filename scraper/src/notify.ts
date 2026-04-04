import { Resend } from "resend";

// ── Types ────────────────────────────────────────────────────────────────────

export interface NotificationReport {
  mode: string;
  dryRun: boolean;
  startTime: Date;
  endTime: Date;
  newDiscovered: number;
  preFilterPassed?: number;
  preFilterRejected?: number;
  newAdded: number;
  newAddedNames: string[];
  rejected: number;
  rejectionSummary: Record<string, number>;
  existingUpdated: number;
  closedRemoved: number;
  totalDirectory: number;
  totalCounties: number;
  totalCities: number;
  totalVerified: number;
  apiCalls: number;
  errors: string[];
  rebuildTriggered: boolean;
}

// ── Main notification function ───────────────────────────────────────────────

export async function sendNotification(
  report: NotificationReport,
  mode: string,
  dryRun: boolean,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("RESEND_API_KEY not set — skipping email notification");
    return;
  }

  const resend = new Resend(apiKey);
  const to = process.env.NOTIFY_EMAIL ?? "v.srezovski@gmail.com";
  const from = process.env.NOTIFY_FROM ?? "hello@greasetrapflorida.com";

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const runTimeMs = report.endTime.getTime() - report.startTime.getTime();
  const runMin = Math.floor(runTimeMs / 60000);
  const runSec = Math.floor((runTimeMs % 60000) / 1000);

  const dryRunPrefix = dryRun ? "[DRY RUN] " : "";
  const subject = `${dryRunPrefix}[Grease Trap FL] ${mode} Scrape Report — ${date}`;

  const newAddedList =
    report.newAddedNames.length > 0
      ? report.newAddedNames.map((n) => `<li>${escapeHtml(n)}</li>`).join("")
      : "<li>None</li>";

  const rejectionList = Object.entries(report.rejectionSummary)
    .map(([reason, count]) => `<li>${escapeHtml(reason)}: ${count}</li>`)
    .join("");

  const errorList =
    report.errors.length > 0
      ? report.errors
          .slice(0, 20)
          .map((e) => `<li>${escapeHtml(e)}</li>`)
          .join("")
      : "<li>None</li>";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  ${dryRun ? '<div style="background: #fff3cd; border: 2px solid #ffc107; padding: 12px; margin-bottom: 20px; border-radius: 6px; text-align: center;"><strong>This was a dry run. No database changes were made.</strong></div>' : ""}

  <h2 style="color: #1a5f2a; border-bottom: 2px solid #1a5f2a; padding-bottom: 8px;">
    ${escapeHtml(mode)} Scrape Report
  </h2>

  <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
    <tr><td style="padding: 6px 12px; border: 1px solid #ddd; background: #f8f8f8;"><strong>Run mode</strong></td><td style="padding: 6px 12px; border: 1px solid #ddd;">${escapeHtml(mode)}</td></tr>
    <tr><td style="padding: 6px 12px; border: 1px solid #ddd; background: #f8f8f8;"><strong>Date/Time</strong></td><td style="padding: 6px 12px; border: 1px solid #ddd;">${report.endTime.toISOString()}</td></tr>
    <tr><td style="padding: 6px 12px; border: 1px solid #ddd; background: #f8f8f8;"><strong>Run time</strong></td><td style="padding: 6px 12px; border: 1px solid #ddd;">${runMin}m ${runSec}s</td></tr>
    <tr><td style="padding: 6px 12px; border: 1px solid #ddd; background: #f8f8f8;"><strong>Google API calls</strong></td><td style="padding: 6px 12px; border: 1px solid #ddd;">${report.apiCalls}</td></tr>
  </table>

  <h3>Discovery & Processing</h3>
  <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
    <tr><td style="padding: 6px 12px; border: 1px solid #ddd; background: #f8f8f8;"><strong>New discovered</strong></td><td style="padding: 6px 12px; border: 1px solid #ddd;">${report.newDiscovered}</td></tr>
    ${report.preFilterPassed != null ? `<tr><td style="padding: 6px 12px; border: 1px solid #ddd; background: #f8f8f8;"><strong>Pre-filter</strong></td><td style="padding: 6px 12px; border: 1px solid #ddd;">${report.preFilterPassed} passed / ${report.preFilterRejected} rejected before scraping</td></tr>` : ""}
    <tr><td style="padding: 6px 12px; border: 1px solid #ddd; background: #f8f8f8;"><strong>New added</strong></td><td style="padding: 6px 12px; border: 1px solid #ddd;">${report.newAdded}</td></tr>
    <tr><td style="padding: 6px 12px; border: 1px solid #ddd; background: #f8f8f8;"><strong>Rejected</strong></td><td style="padding: 6px 12px; border: 1px solid #ddd;">${report.rejected}</td></tr>
    <tr><td style="padding: 6px 12px; border: 1px solid #ddd; background: #f8f8f8;"><strong>Existing updated</strong></td><td style="padding: 6px 12px; border: 1px solid #ddd;">${report.existingUpdated}</td></tr>
    <tr><td style="padding: 6px 12px; border: 1px solid #ddd; background: #f8f8f8;"><strong>Closed/removed</strong></td><td style="padding: 6px 12px; border: 1px solid #ddd;">${report.closedRemoved}</td></tr>
  </table>

  ${report.newAdded > 0 ? `<h3>New Businesses Added</h3><ul>${newAddedList}</ul>` : ""}

  ${rejectionList ? `<h3>Rejection Reasons</h3><ul>${rejectionList}</ul>` : ""}

  <h3>Directory Totals</h3>
  <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
    <tr><td style="padding: 6px 12px; border: 1px solid #ddd; background: #f8f8f8;"><strong>Total businesses</strong></td><td style="padding: 6px 12px; border: 1px solid #ddd;">${report.totalDirectory}</td></tr>
    <tr><td style="padding: 6px 12px; border: 1px solid #ddd; background: #f8f8f8;"><strong>Counties</strong></td><td style="padding: 6px 12px; border: 1px solid #ddd;">${report.totalCounties}</td></tr>
    <tr><td style="padding: 6px 12px; border: 1px solid #ddd; background: #f8f8f8;"><strong>Cities</strong></td><td style="padding: 6px 12px; border: 1px solid #ddd;">${report.totalCities}</td></tr>
    <tr><td style="padding: 6px 12px; border: 1px solid #ddd; background: #f8f8f8;"><strong>Verified</strong></td><td style="padding: 6px 12px; border: 1px solid #ddd;">${report.totalVerified}</td></tr>
  </table>

  <h3>Errors</h3>
  <ul>${errorList}</ul>

  <p><strong>Rebuild triggered:</strong> ${report.rebuildTriggered ? "Yes" : "No"}</p>

  <hr style="margin-top: 24px; border: none; border-top: 1px solid #ddd;">
  <p style="font-size: 12px; color: #999;">Automated report from greasetrapflorida.com scraper service</p>
</body>
</html>`.trim();

  try {
    await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
    console.log(`Notification email sent to ${to}`);
  } catch (err) {
    console.error("Failed to send notification:", err);
  }
}

// ── Send error notification ──────────────────────────────────────────────────

export async function sendErrorNotification(
  error: Error,
  mode: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const to = process.env.NOTIFY_EMAIL ?? "v.srezovski@gmail.com";
  const from = process.env.NOTIFY_FROM ?? "hello@greasetrapflorida.com";

  const html = `
<div style="font-family: sans-serif; padding: 20px;">
  <h2 style="color: #dc3545;">Scraper Error — ${escapeHtml(mode)} mode</h2>
  <p><strong>Time:</strong> ${new Date().toISOString()}</p>
  <p><strong>Error:</strong> ${escapeHtml(error.message)}</p>
  <pre style="background: #f8f8f8; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${escapeHtml(error.stack ?? "")}</pre>
</div>`.trim();

  try {
    await resend.emails.send({
      from,
      to,
      subject: `[Grease Trap FL] SCRAPER ERROR — ${mode}`,
      html,
    });
  } catch {
    console.error("Failed to send error notification email");
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
