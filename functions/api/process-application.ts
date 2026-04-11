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
    const origin = new URL(request.url).origin;
    let invitationLink = "";

    // 1. Handle Auth Setup (ONLY for individuals)
    if (isIndividual) {
      try {
        // Generate a MANUAL 6-digit OTP for the unified email
        const manualOtp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Update the application record with the manual OTP for verification
        const { data: latestApp } = await supabase
          .from('applications')
          .select('id, history')
          .eq('email', email.trim().toLowerCase())
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestApp) {
          const currentHistory = typeof latestApp.history === 'string' ? JSON.parse(latestApp.history) : (latestApp.history || []);
          const updatedHistory = [{
            event: 'Manual OTP Generated',
            otp: manualOtp,
            timestamp: new Date().toISOString(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }, ...currentHistory];

          await supabase
            .from('applications')
            .update({ history: JSON.stringify(updatedHistory) })
            .eq('id', latestApp.id);
        }

        // Create the user in Supabase but SKIP the automatic email
        await supabase.auth.admin.inviteUserByEmail(email.trim().toLowerCase(), {
          data: { full_name: name, manual_otp: manualOtp },
          redirectTo: `${origin}/verify`,
          // GOTRUE flag to skip the system invitation email
          skipInvitation: true 
        });

        // Store the manual OTP locally for the email template
        invitationLink = manualOtp;
        console.log(`[Auth] Manual OTP ${manualOtp} generated and stored for ${email}`);
      } catch (authErr: any) {
        console.error("Auth pre-processing error:", authErr.message);
      }
    }
    
    // 2. Prepare ACTIVATION Email (Email #1)
    const subject = isIndividual 
      ? `ACTION REQUIRED: Activate Your Academy Account`
      : `Enquiry Received: ${type === 'organisation' ? 'Organisation' : 'Partnership'} - Ginashe Digital Academy`;

    const messageHtml = isIndividual ? `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #080b12; color: #f0f0f0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="https://academy.ginashe.co.za/logo.png" alt="Ginashe Digital Academy" style="width: 180px; height: auto;" />
        </div>
        
        <div style="background-color: #11141d; border: 1px solid #1e2330; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
          <h2 style="color: #D4AF37; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 16px; text-align: center;">Activate Your Account</h2>
          <p style="font-size: 16px; margin-bottom: 24px;">Hi ${name},</p>
          <p style="line-height: 1.7; font-size: 15px; color: #d1d5db; margin-bottom: 24px;">
            Thank you for applying to **Ginashe Digital Academy**. To begin your admission process and access your portal, please verify your account using the code below.
          </p>

          ${invitationLink ? `
          <div style="background-color: #1a1a1c; padding: 40px; border-radius: 12px; border: 1px solid #D4AF37; text-align: center; margin: 32px 0;">
            <p style="margin: 0 0 16px 0; font-weight: 800; color: #D4AF37; text-transform: uppercase; font-size: 13px; letter-spacing: 2px;">Your Activation Code</p>
            <p style="margin: 0 0 24px 0; font-size: 48px; font-weight: 900; color: #D4AF37; letter-spacing: 12px; font-family: monospace;">${invitationLink}</p>
            <p style="margin: 0 0 24px 0; line-height: 1.6; font-size: 14px; color: #d1d5db;">
              Enter this 6-digit code on the Academy activation screen to secure your account and set your password.
            </p>
            <a href="${origin}/verify?email=${encodeURIComponent(email)}" style="display: inline-block; padding: 14px 32px; background-color: #D4AF37; color: #080b12; text-decoration: none; border-radius: 8px; font-weight: 900; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(212,175,55,0.2);">Verify Now →</a>
          </div>
          ` : `
          <div style="background-color: #1a1a1c; padding: 24px; border-radius: 8px; border-left: 4px solid #D4AF37; margin: 32px 0;">
            <p style="margin: 0; font-weight: 800; color: #D4AF37; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Portal Access:</p>
            <p style="margin: 12px 0 0 0; line-height: 1.6; font-size: 14px; color: #f0f0f0;">
              Your account is already active. Please <a href="${origin}/portal" style="color: #D4AF37; text-decoration: underline;">sign in here</a> to check your application status.
            </p>
          </div>
          `}
          
          <p style="line-height: 1.7; font-size: 14px; color: #9ca3af; text-align: center;">
            This security code is required to safely initialize your student credentials.
          </p>
          
          <p style="margin-top: 32px; font-weight: 600; color: #f0f0f0; text-align: center;">
            Excellence through innovation,<br>
            <span style="color: #D4AF37;">GDA Admissions Team</span>
          </p>
        </div>
        
        <div style="text-align: center; padding-top: 24px; border-top: 1px solid #1e2330; font-size: 12px; color: #6b7280;">
            Ginashe Digital Academy &copy; 2026. All rights reserved.
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

    // 3. Send Notification Emails via Resend
    const resendHeaders = {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    };

    // A. Send Student Receipt
    const receiptResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: resendHeaders,
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        reply_to: "academy@ginashe.co.za",
        subject: subject,
        html: messageHtml,
      }),
    });

    if (!receiptResponse.ok) console.error("[Resend Error] Receipt Email:", await receiptResponse.json());

    // B. Send Admin Notification
    const adminResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: resendHeaders,
      body: JSON.stringify({
        from: fromEmail,
        to: ["academy@ginashe.co.za"],
        reply_to: "academy@ginashe.co.za",
        subject: `ACTION REQUIRED: New ${type.toUpperCase()} from ${name}`,
        html: `
          <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #080b12; color: #f0f0f0; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <img src="https://academy.ginashe.co.za/logo.png" alt="Ginashe Digital Academy" style="width: 150px; height: auto;" />
            </div>
            
            <div style="background-color: #11141d; border: 1px solid #1e2330; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
              <h2 style="color: #D4AF37; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 24px; text-align: center;">New ${type} Submission</h2>
              <div style="line-height: 1.7; font-size: 14px; color: #d1d5db;">
                <p><strong>Name/Org:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${program ? `<p><strong>Program:</strong> ${program}</p>` : ''}
                <p><strong>Type:</strong> ${type}</p>
                <p style="margin-top: 20px;"><strong>Form Data:</strong></p>
                <div style="background: #1a1a1c; padding: 16px; border-radius: 8px; border: 1px solid #1e2330; font-family: monospace; font-size: 12px; color: #9ca3af;">
                  ${Object.entries(details).map(([k, v]) => `<div style="margin-bottom: 4px;"><strong style="color: #D4AF37;">${k}:</strong> ${typeof v === 'object' ? JSON.stringify(v) : v}</div>`).join('')}
                </div>
              </div>
              
              <div style="margin-top: 32px; text-align: center;">
                <a href="${origin}/admin" style="display: inline-block; padding: 12px 24px; background-color: #D4AF37; color: #080b12; text-decoration: none; border-radius: 6px; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px;">Open Admin Dashboard</a>
              </div>
            </div>
          </div>
        `,
      }),
    });

    if (!adminResponse.ok) console.error("[Resend Error] Admin Email:", await adminResponse.json());

    return new Response(JSON.stringify({ 
      success: true, 
      msg: "Emails processed successfully",
      invitation_link: "N/A"
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Process Application Error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
