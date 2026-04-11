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

    // 5. Success! Clear the OTP or log success in history
    const updatedHistory = [{
      event: 'Account Activated via Manual OTP',
      timestamp: new Date().toISOString()
    }, ...history];

    await supabase
      .from('applications')
      .update({ history: JSON.stringify(updatedHistory) })
      .eq('id', app.id);

    return new Response(JSON.stringify({ success: true, message: "Account activated successfully" }), {
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
