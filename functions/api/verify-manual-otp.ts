import { createClient } from "@supabase/supabase-js";

export async function onRequestPost(context) {
  const { request, env } = context;
  const { email, otp, password } = await request.json();

  if (!email || !otp || !password) {
    return new Response(JSON.stringify({ error: "Email, OTP, and password are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Initialize Supabase with Service Role Key
  const supabase = createClient(
    env.VITE_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // 1. Fetch the latest application for this email
    const { data: app, error: fetchError } = await supabase
      .from('applications')
      .select('id, history')
      .eq('email', email.trim().toLowerCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError || !app) {
      return new Response(JSON.stringify({ error: "No pending application found for this email" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Parse history and find the latest OTP
    const history = typeof app.history === 'string' ? JSON.parse(app.history) : (app.history || []);
    const latestOtpEvent = history.find(h => h.event === 'Manual OTP Generated');

    if (!latestOtpEvent) {
      return new Response(JSON.stringify({ error: "No activation code has been generated for this email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Check OTP Match and Expiry
    if (latestOtpEvent.otp !== otp.trim()) {
      return new Response(JSON.stringify({ error: "Invalid activation code. Please check your email and try again." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const expiry = new Date(latestOtpEvent.expires_at);
    if (expiry < new Date()) {
      return new Response(JSON.stringify({ error: "This activation code has expired. Please request a new one." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4. Find the Supabase Auth user
    const { data: userSearch } = await supabase.auth.admin.listUsers();
    const users = (userSearch?.users || []) as any[];
    const targetUser = users.find(u => u.email?.toLowerCase() === email.trim().toLowerCase());

    if (!targetUser) {
      // Create user if not found (fallback)
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password: password,
        email_confirm: true,
        user_metadata: { full_name: "GDA Student" }
      });
      if (createError) throw createError;
    } else {
      // Update existing user with the new password
      const { error: updateError } = await supabase.auth.admin.updateUserById(targetUser.id, {
        password: password,
        email_confirm: true
      });
      if (updateError) throw updateError;
    }

    // 5. DATA BRIDGE: Sync application details to the Profile
    const { data: fullApp } = await supabase
      .from('applications')
      .select('*')
      .eq('id', app.id)
      .single();

    if (fullApp) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: targetUser ? targetUser.id : (await supabase.auth.admin.listUsers()).data.users.find(u => u.email?.toLowerCase() === email.trim().toLowerCase())?.id,
          first_name: fullApp.first_name,
          last_name: fullApp.last_name,
          phone: fullApp.phone,
          date_of_birth: fullApp.date_of_birth,
          gender: fullApp.gender,
          nationality: fullApp.nationality,
          address_line1: fullApp.address_line1,
          city: fullApp.city,
          province: fullApp.province,
          country: fullApp.country,
          postal_code: fullApp.postal_code,
          role: 'student',
          updated_at: new Date().toISOString()
        });
      
      if (profileError) console.error("Profile sync error:", profileError.message);
    }

    // 6. OFFICIAL WELCOME EMAIL (Email #2)
    try {
      const origin = new URL(request.url).origin;
      const fromEmail = env.RESEND_FROM_EMAIL || "Ginashe Digital Academy <noreply@send.academy.ginashe.co.za>";
      
      const welcomeHtml = `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #080b12; color: #f0f0f0; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://academy.ginashe.co.za/logo.png" alt="Ginashe Digital Academy" style="width: 180px; height: auto;" />
          </div>
          
          <div style="background-color: #11141d; border: 1px solid #1e2330; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
            <h2 style="color: #D4AF37; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 16px;">Welcome to the Academy</h2>
            <p style="font-size: 16px; margin-bottom: 24px;">Hi ${fullApp?.first_name || 'Student'},</p>
            <p style="line-height: 1.7; font-size: 15px; color: #d1d5db; margin-bottom: 24px;">
              Your account is now active and your profile has been successfully initialized! We are thrilled to welcome you to **Ginashe Digital Academy**, Africa's premier hub for digital innovation.
            </p>

            <div style="background-color: #1a1a1c; border-left: 4px solid #D4AF37; padding: 20px; margin-bottom: 32px;">
              <h3 style="color: #D4AF37; font-size: 14px; margin-top: 0; text-transform: uppercase; letter-spacing: 1px;">📅 Your Admission Roadmap</h3>
              <ul style="padding-left: 20px; font-size: 13px; color: #d1d5db; line-height: 1.8;">
                <li><strong>Phase 1:</strong> Initial Application Review (In Progress)</li>
                <li><strong>Phase 2:</strong> Credential Verification & Interview</li>
                <li><strong>Phase 3:</strong> Final Offer & Enrollment</li>
              </ul>
            </div>

            <div style="background-color: #1a1a1c; border-radius: 8px; padding: 20px; margin-bottom: 32px; border: 1px solid #1e2330;">
              <h3 style="color: #f0f0f0; font-size: 14px; margin-top: 0;">📎 Required Documents</h3>
              <p style="font-size: 12px; color: #9ca3af;">Please ensure you have digital copies of the following ready for your verification interview:</p>
              <ul style="font-size: 12px; color: #d1d5db; line-height: 1.6;">
                <li>Certified ID or Passport</li>
                <li>Latest Curriculum Vitae (CV)</li>
                <li>Highest Academic Qualifications</li>
                <li>Proof of Residential Address</li>
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="${origin}/portal" style="display: inline-block; padding: 14px 32px; background-color: #D4AF37; color: #080b12; text-decoration: none; border-radius: 8px; font-weight: 900; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Access Your Student Portal →</a>
            </div>
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #6b7280; padding-top: 24px; border-top: 1px solid #1e2330;">
              Ginashe Digital Academy &copy; 2026. Excellence through Innovation.
          </div>
        </div>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          reply_to: "academy@ginashe.co.za",
          subject: "Welcome to Ginashe Digital Academy - Your Digital Journey Starts Now",
          html: welcomeHtml,
        }),
      });
    } catch (emailErr) {
      console.error("Welcome email trigger error:", emailErr);
    }

    // 7. Success! Clear the OTP or log success in history
    const updatedHistory = [{
      event: 'Account Activated via Manual OTP',
      timestamp: new Date().toISOString(),
      details: 'Full profile synced and welcome kit sent.'
    }, ...history];

    await supabase
      .from('applications')
      .update({ history: JSON.stringify(updatedHistory) })
      .eq('id', app.id);

    return new Response(JSON.stringify({ success: true, message: "Account activated successfully. Welcome email sent." }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("Manual OTP Verification Error:", err.message);
    return new Response(JSON.stringify({ error: err.message || "An unexpected error occurred during activation" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
