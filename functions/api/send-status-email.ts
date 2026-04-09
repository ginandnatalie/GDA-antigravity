export async function onRequestPost(context) {
  const { request, env } = context;
  const { email, name, status, program } = await request.json();

  if (!env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is missing. Email not sent.");
    return new Response(JSON.stringify({ message: "Email skipped (no API key)" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const subject = status === 'approved' 
      ? `Congratulations! Your application for ${program} was Approved`
      : `Update regarding your application for ${program}`;

    const message = status === 'approved'
      ? `Hi ${name},\n\nWe are excited to inform you that your application for the ${program} at Ginashe Digital Academy has been APPROVED! \n\nPlease log in to your student portal to see the next steps.\n\nBest regards,\nGDA Admissions Team`
      : `Hi ${name},\n\nThank you for your interest in Ginashe Digital Academy. After careful review, we regret to inform you that we are unable to move forward with your application for ${program} at this time.\n\nWe wish you the best in your future endeavours.\n\nBest regards,\nGDA Admissions Team`;

    const fromEmail = env.RESEND_FROM_EMAIL || "Ginashe Digital Academy <noreply@academy.ginashe.co.za>";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        reply_to: "academy@ginashe.co.za",
        subject: subject,
        html: `
          <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #080b12; color: #f0f0f0; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; padding: 12px; background: #1a1a1c; border: 1px solid #D4AF37; border-radius: 8px;">
                <span style="color: #D4AF37; font-weight: 900; font-size: 20px; letter-spacing: 1px;">GINASHE</span>
              </div>
            </div>
            
            <div style="background-color: #11141d; border: 1px solid #1e2330; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
              <h2 style="color: #D4AF37; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 16px; text-align: center;">${status === 'approved' ? 'Congratulations!' : 'Application Update'}</h2>
              <div style="line-height: 1.7; font-size: 15px; color: #d1d5db;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              
              ${status === 'approved' ? `
                <div style="margin-top: 32px; text-align: center;">
                  <a href="${new URL(request.url).origin}/student-portal" style="display: inline-block; padding: 14px 28px; background-color: #D4AF37; color: #080b12; text-decoration: none; border-radius: 6px; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Access Student Portal</a>
                </div>
              ` : ''}
            </div>
            
            <div style="text-align: center; padding-top: 24px; border-top: 1px solid #1e2330;">
              <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
                Ginashe Digital Academy &copy; 2026. All rights reserved.
              </p>
              <p style="font-size: 11px; color: #4b5563;">
                Sandton Campus, Johannesburg, South Africa
              </p>
            </div>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend Error:", data);
      return new Response(JSON.stringify({ error: data.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Server Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
