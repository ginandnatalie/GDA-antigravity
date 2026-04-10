import { createClient } from "@supabase/supabase-js";

export async function onRequestPost(context) {
  const { request, env } = context;
  const { email, name, program, details, type = 'individual' } = await request.json();

  if (!env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is missing. Emails skipped.");
    return new Response(JSON.stringify({ message: "Emails skipped (no API key)" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Initialize Supabase with Service Role Key for Admin actions
  const adminKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!adminKey) {
    console.error("CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing in environment variables.");
  }

  const supabase = createClient(
    env.VITE_SUPABASE_URL,
    adminKey || ""
  );

  try {
    const isIndividual = type === 'individual';
    
    // 1. Send Receipt Confirmation Email to Applicant
    const subject = isIndividual 
      ? `Application Received: ${program} - Ginashe Digital Academy`
      : `Enquiry Received: ${type === 'organisation' ? 'Organisation' : 'Partnership'} - Ginashe Digital Academy`;

    const messageHtml = isIndividual ? `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #080b12; color: #f0f0f0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="https://academy.ginashe.co.za/logo.png" alt="Ginashe Digital Academy" style="width: 180px; height: auto;" />
        </div>
        
        <div style="background-color: #11141d; border: 1px solid #1e2330; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
          <h2 style="color: #D4AF37; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 16px; text-align: center;">Application Received</h2>
          <p style="font-size: 16px; margin-bottom: 24px;">Hi ${name},</p>
          <p style="line-height: 1.7; font-size: 15px; color: #d1d5db; margin-bottom: 24px;">
            Thank you for applying for the <strong>${program}</strong> at Ginashe Digital Academy. We've received your application and our admissions team is already reviewing your profile.
          </p>
          
          <div style="background-color: #1a1a1c; padding: 24px; border-radius: 8px; border-left: 4px solid #D4AF37; margin: 32px 0;">
            <p style="margin: 0; font-weight: 800; color: #D4AF37; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Critical Next Step:</p>
            <p style="margin: 12px 0 0 0; line-height: 1.6; font-size: 14px; color: #f0f0f0;">
              We have sent you a <strong>separate email</strong> titled "Account Creation Confirmation". Please check your inbox to set your password and activate your student portal.
            </p>
          </div>
          
          <p style="line-height: 1.7; font-size: 15px; color: #d1d5db;">
            Expect to hear from us within 2 business days regarding your next steps.
          </p>
          
          <p style="margin-top: 32px; font-weight: 600; color: #f0f0f0;">
            Best regards,<br>
            <span style="color: #D4AF37;">GDA Admissions Team</span>
          </p>
        </div>
        
        <div style="text-align: center; padding-top: 24px; border-top: 1px solid #1e2330;">
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
            Ginashe Digital Academy &copy; 2026. All rights reserved.
          </p>
        </div>
      </div>
    ` : `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #080b12; color: #f0f0f0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="https://academy.ginashe.co.za/logo.png" alt="Ginashe Digital Academy" style="width: 180px; height: auto;" />
        </div>
        
        <div style="background-color: #11141d; border: 1px solid #1e2330; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
          <h2 style="color: #D4AF37; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 16px; text-align: center;">Enquiry Received</h2>
          <p style="font-size: 16px; margin-bottom: 24px;">Hi ${name},</p>
          <p style="line-height: 1.7; font-size: 15px; color: #d1d5db; margin-bottom: 24px;">
            Thank you for your interest in partnering with Ginashe Digital Academy. We have received your <strong>${type}</strong> enquiry.
          </p>
          
          <p style="line-height: 1.7; font-size: 15px; color: #d1d5db;">
            Our partnerships team will review your submission and reach out to you within 2-3 business days to discuss how we can work together.
          </p>
          
          <p style="margin-top: 32px; font-weight: 600; color: #f0f0f0;">
            Best regards,<br>
            <span style="color: #D4AF37;">GDA Partnerships Team</span>
          </p>
        </div>
        
        <div style="text-align: center; padding-top: 24px; border-top: 1px solid #1e2330;">
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
            Ginashe Digital Academy &copy; 2026. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const fromEmail = env.RESEND_FROM_EMAIL || "Ginashe Digital Academy <noreply@send.academy.ginashe.co.za>";

    const receiptResponse = await fetch("https://api.resend.com/emails", {
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
        html: messageHtml,
      }),
    });

    if (!receiptResponse.ok) {
      const errorData = await receiptResponse.json();
      console.error("[Resend Error] Receipt Email:", errorData);
    } else {
      console.log(`[Email] Receipt email sent to ${email}`);
    }

    // 2. Trigger Supabase Auth Invitation (ONLY for individuals)
    let authData = null;
    if (isIndividual) {
      const origin = new URL(request.url).origin;
      
      // Check if user already exists in auth
      const { data: userSearch } = await supabase.auth.admin.listUsers();
      const existingUser = userSearch?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

      if (existingUser) {
        console.log(`[Auth] User ${email} already exists. Skipping invitation.`);
        authData = { existing: true, user: existingUser };
      } else {
        const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
          data: { full_name: name },
          redirectTo: `${origin}/student-portal`
        });
        authData = data;
        if (error) console.warn("Supabase Auth Invitation Error:", error.message);
        else console.log(`[Auth] Invitation sent to ${email}`);
      }
    }

    // 3. Send Admin Notification Email
    const adminResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: ["academy@ginashe.co.za"],
        reply_to: "academy@ginashe.co.za",
        subject: `NEW ${type.toUpperCase()}: ${name}`,
        html: `
          <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #080b12; color: #f0f0f0; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <img src="https://academy.ginashe.co.za/logo.png" alt="Ginashe Digital Academy" style="width: 150px; height: auto;" />
            </div>
            
            <div style="background-color: #11141d; border: 1px solid #1e2330; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
              <h2 style="color: #D4AF37; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 16px; text-align: center;">New ${type} Submission</h2>
              <div style="line-height: 1.7; font-size: 14px; color: #d1d5db;">
                <p><strong>Name/Org:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${program ? `<p><strong>Program:</strong> ${program}</p>` : ''}
                <p><strong>Type:</strong> ${type}</p>
                <p><strong>Details:</strong></p>
                <pre style="background: #1a1a1c; padding: 16px; border-radius: 8px; border: 1px solid #1e2330; color: #888; font-size: 12px; overflow-x: auto;">${JSON.stringify(details, null, 2)}</pre>
              </div>
              
              <div style="margin-top: 32px; text-align: center;">
                <a href="${new URL(request.url).origin}/admin-portal" style="display: inline-block; padding: 12px 24px; background-color: #D4AF37; color: #080b12; text-decoration: none; border-radius: 6px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">View in Admin Dashboard</a>
              </div>
            </div>
            
            <div style="text-align: center; padding-top: 24px; border-top: 1px solid #1e2330;">
              <p style="font-size: 11px; color: #4b5563;">
                GDA Automated Notification System
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!adminResponse.ok) {
      const errorData = await adminResponse.json();
      console.error("[Resend Error] Admin Email:", errorData);
    } else {
      console.log(`[Email] Admin notification sent`);
    }

    const receiptData = await receiptResponse.json();
    const adminData = await adminResponse.json();

    return new Response(JSON.stringify({ 
      success: true, 
      receipt: receiptData, 
      admin: adminData,
      auth: authData
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Process Application Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
