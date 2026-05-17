import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { optionalEnv } from '../helpers/env';

async function sendReport(): Promise<void> {
  // Invoked with "failed" argument only when tests have actually failed in CI.
  const hasFailed = process.argv[2] === 'failed';
  if (!hasFailed) return;

  // Skip silently when SMTP secrets are not configured (e.g. forks, open PRs).
  // This prevents the CI job from failing just because email isn't wired up.
  const smtpHost = process.env['SMTP_HOST'];
  const smtpUser = process.env['SMTP_USER'];
  const smtpPass = process.env['SMTP_PASSWORD'];
  const emailTo  = process.env['REPORT_EMAIL_TO'];

  if (!smtpHost || !smtpUser || !smtpPass || !emailTo) {
    console.log('SMTP credentials not configured — skipping failure email.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(optionalEnv('SMTP_PORT', '587'), 10),
    secure: process.env['SMTP_SECURE'] === 'true',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const reportDir = path.resolve('playwright-report');
  const reportIndex = path.join(reportDir, 'index.html');

  const environment = optionalEnv('ENV', 'qa');
  const branch = optionalEnv('GITHUB_REF_NAME', 'unknown-branch');
  const runUrl = process.env['GITHUB_SERVER_URL'] && process.env['GITHUB_REPOSITORY'] && process.env['GITHUB_RUN_ID']
    ? `${process.env['GITHUB_SERVER_URL']}/${process.env['GITHUB_REPOSITORY']}/actions/runs/${process.env['GITHUB_RUN_ID']}`
    : 'local run';

  const recipients = emailTo;
  const sender = smtpUser;
  const timestamp = new Date().toUTCString();

  await transporter.sendMail({
    from: sender,
    to: recipients,
    subject: `[MB QA] Test failure — ${environment} | ${branch} | ${timestamp}`,
    html: `
      <h2>Playwright Test Failure</h2>
      <table>
        <tr><td><strong>Environment</strong></td><td>${environment}</td></tr>
        <tr><td><strong>Branch</strong></td><td>${branch}</td></tr>
        <tr><td><strong>Run</strong></td><td><a href="${runUrl}">${runUrl}</a></td></tr>
        <tr><td><strong>Timestamp</strong></td><td>${timestamp}</td></tr>
      </table>
      <p>See the attached HTML report for full details.</p>
    `,
    attachments: fs.existsSync(reportIndex)
      ? [{ filename: 'playwright-report.html', path: reportIndex }]
      : [],
  });

  console.log(`Report emailed to: ${recipients}`);
}

sendReport().catch((err) => {
  console.error('Failed to send report email:', err);
  process.exit(1);
});
