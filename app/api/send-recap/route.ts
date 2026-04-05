import { Resend } from 'resend'
import { COACHES } from '@/lib/coaches'
import { CoachKey } from '@/lib/types'

export async function POST(req: Request) {
  try {
    const { name, email, session } = await req.json()

    if (!name || !email || !session) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY || !process.env.RESEND_SENDER_EMAIL) {
      return Response.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const coach = COACHES[session.coach as CoachKey]

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0e0f13;
      color: #e8e9f0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 32px;
      font-weight: 300;
      letter-spacing: 2px;
      color: #7c6af7;
      margin-bottom: 8px;
    }
    .subtitle {
      font-size: 14px;
      color: #6b6f82;
    }
    .card {
      background: #16181f;
      border: 1px solid #2a2d38;
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 24px;
    }
    .coach-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    .coach-icon {
      font-size: 32px;
    }
    .coach-name {
      font-size: 20px;
      font-weight: 500;
    }
    .section {
      margin-bottom: 24px;
    }
    .label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #6b6f82;
      margin-bottom: 8px;
    }
    .reframe {
      font-family: 'DM Serif Display', Georgia, serif;
      font-style: italic;
      font-size: 24px;
      line-height: 1.4;
      color: #e8e9f0;
      margin-bottom: 16px;
    }
    .distortion-tag {
      display: inline-block;
      background: rgba(124, 106, 247, 0.15);
      color: #7c6af7;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
    }
    .action {
      font-size: 15px;
      line-height: 1.6;
      color: #9196aa;
    }
    .footer {
      text-align: center;
      padding-top: 32px;
      border-top: 1px solid #2a2d38;
      color: #6b6f82;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">re·frame</div>
      <div class="subtitle">Your session recap</div>
    </div>

    <div class="card">
      <div class="coach-header">
        <span class="coach-icon">${coach.icon}</span>
        <span class="coach-name">${coach.name}</span>
      </div>

      <div class="section">
        <div class="label">Your reframe</div>
        <div class="reframe">${session.reframe}</div>
      </div>

      <div class="section">
        <div class="label">Pattern identified</div>
        <span class="distortion-tag">${session.distortion}</span>
      </div>

      <div class="section">
        <div class="label">One thing to try</div>
        <div class="action">${session.action}</div>
      </div>
    </div>

    <div class="footer">
      You're doing the work, ${name}. That matters.
    </div>
  </div>
</body>
</html>
    `

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_SENDER_EMAIL!,
      to: email,
      subject: "Your reframe from today's session",
      html
    })

    if (error) {
      console.error('Resend error:', error)
      return Response.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return Response.json({ success: true, data })
  } catch (error) {
    console.error('Send recap error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
