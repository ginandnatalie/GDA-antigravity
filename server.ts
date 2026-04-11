import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Supabase Keep-Alive Configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ffgypwmrmdosaihgpkuw.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_NEMim0nMQmB0LBP3nhPamA_sd2y0Nco';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function pingSupabase() {
  try {
    // Perform a lightweight query to simulate activity
    // We use a common table like 'applications' or just query the schema
    const { data, error } = await supabase.from('applications').select('id').limit(1);
    
    if (error && error.code !== 'PGRST116') { // Ignore "no rows found" errors
      throw error;
    }
    
    console.log(`[Supabase Heartbeat] Activity ping successful at ${new Date().toISOString()}`);
  } catch (err: any) {
    console.error(`[Supabase Heartbeat] Activity ping failed:`, err.message);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Start the heartbeat: Ping every 24 hours
  const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24;
  setInterval(pingSupabase, TWENTY_FOUR_HOURS);
  
  // Manual Supabase Ping
  app.post("/api/ping-supabase", async (req, res) => {
    try {
      await pingSupabase();
      res.json({ success: true, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Communication Log Helper ───
  async function logCommunication(opts: { applicationId?: string, recipientEmail: string, subject: string, emailType: string, status?: string }) {
    try {
      const adminSupabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey);
      await adminSupabase.from('communication_logs').insert({
        application_id: opts.applicationId || null,
        recipient_email: opts.recipientEmail,
        subject: opts.subject,
        email_type: opts.emailType,
        status: opts.status || 'sent',
      });
    } catch (err) {
      console.warn('[Log] Failed to record communication log:', err);
    }
  }

  // ─── Duplicate Check Endpoint ───
  app.post("/api/check-duplicate", async (req, res) => {
    const { email, idNumber } = req.body;
    try {
      const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const admin = createClient(supabaseUrl, adminKey || supabaseAnonKey);

      let match = null;
      if (email) {
        const { data } = await admin.from('applications').select('id, first_name, last_name, email, status, program, student_number').eq('email', email.trim().toLowerCase()).limit(1).maybeSingle();
        if (data) match = data;
      }
      if (!match && idNumber) {
        const { data } = await admin.from('applications').select('id, first_name, last_name, email, status, program, student_number').eq('id_number', idNumber.trim()).limit(1).maybeSingle();
        if (data) match = data;
      }

      res.json({ isDuplicate: !!match, match });
    } catch (err: any) {
      console.error('Duplicate check error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Contact Form Endpoint ───
  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // Send to academy
      if (resend) {
        await resend.emails.send({
          from: 'Ginashe Digital Academy <onboarding@resend.dev>',
          to: ['academy@ginashe.co.za'],
          subject: `[Contact] ${subject} — ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p style="color:#888;font-size:12px;">Sent from the GDA website contact form</p>
          `,
        });

        // Auto-reply to sender
        await resend.emails.send({
          from: 'Ginashe Digital Academy <onboarding@resend.dev>',
          to: [email],
          subject: `Thank you for contacting Ginashe Digital Academy`,
          html: `
            <h2>Thank you, ${name}!</h2>
            <p>We've received your message regarding <strong>"${subject}"</strong> and will respond within 2 business days.</p>
            <p>In the meantime, feel free to explore our <a href="https://academy.ginashe.co.za/admissions">programmes and admissions</a>.</p>
            <br>
            <p>Warm regards,<br>The Admissions Team<br>Ginashe Digital Academy</p>
          `,
        });
      }

      await logCommunication({
        recipientEmail: email,
        subject: `Contact: ${subject}`,
        emailType: 'contact_form',
        status: 'sent',
      });

      res.json({ success: true });
    } catch (err: any) {
      console.error('Contact form error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Paystack Transaction Initialization
  app.post("/api/create-paystack-session", async (req, res) => {
    const { courseId, userId, amount, email } = req.body;

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ error: "Paystack secret key is missing" });
    }

    try {
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: amount * 100, // Amount in kobo/cents
          callback_url: `${req.headers.origin}/?payment=success&courseId=${courseId}`,
          metadata: {
            courseId,
            userId,
          },
        }),
      });

      const data = await response.json();

      if (!data.status) {
        throw new Error(data.message || "Failed to initialize transaction");
      }

      res.json({ url: data.data.authorization_url });
    } catch (err: any) {
      console.error("Paystack Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // API Route for sending status emails
  app.post("/api/send-status-email", async (req, res) => {
    const { email, name, status, program } = req.body;
    console.log(`[Email] Sending status email to ${email} (Status: ${status})`);

    const fromEmail = process.env.RESEND_FROM_EMAIL || "Ginashe Digital Academy <noreply@academy.ginashe.co.za>";

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is missing. Email not sent.");
      return res.status(200).json({ message: "Email skipped (no API key)" });
    }

    try {
      const subject = status === 'approved' 
        ? `Congratulations! Your application for ${program} was Approved`
        : `Update regarding your application for ${program}`;

      const message = status === 'approved'
        ? `Hi ${name},\n\nWe are excited to inform you that your application for the ${program} at Ginashe Digital Academy has been APPROVED! \n\nPlease log in to your student portal to see the next steps.\n\nBest regards,\nGDA Admissions Team`
        : `Hi ${name},\n\nThank you for your interest in Ginashe Digital Academy. After careful review, we regret to inform you that we are unable to move forward with your application for ${program} at this time.\n\nWe wish you the best in your future endeavours.\n\nBest regards,\nGDA Admissions Team`;

      if (!resend) {
        console.warn("[Resend] API key missing. Email skipped.");
        return res.json({ success: true, message: "Email skipped (no API key)" });
      }

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [email],
        replyTo: "academy@ginashe.co.za",
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
                  <a href="${req.headers.origin || ''}/verify" style="display: inline-block; padding: 14px 28px; background-color: #D4AF37; color: #080b12; text-decoration: none; border-radius: 6px; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Access Student Portal</a>
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
      });

      if (error) {
        console.error("[Resend Error] Status Email:", error);
        return res.status(500).json({ error: error.message });
      }

      console.log(`[Email] Status email sent successfully to ${email}`);
      res.json({ success: true, data });
    } catch (err: any) {
      console.error("[Server Error] Status Email:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // API Route for processing new applications (Emails + Auth)
  app.post("/api/process-application", async (req, res) => {
    const { email, name, program, details, type = 'individual' } = req.body;
    console.log(`[Process] New application from ${email} (${type})`);

    const fromEmail = process.env.RESEND_FROM_EMAIL || "Ginashe Digital Academy <noreply@academy.ginashe.co.za>";

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is missing. Emails skipped.");
      return res.status(200).json({ message: "Emails skipped (no API key)" });
    }

    // Initialize Supabase with Service Role Key for Admin actions
    const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!adminKey) {
      console.warn("SUPABASE_SERVICE_ROLE_KEY is missing. Auth invitation skipped.");
    }

    const adminSupabase = createClient(
      process.env.VITE_SUPABASE_URL || supabaseUrl,
      adminKey || supabaseAnonKey
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
            <div style="display: inline-block; padding: 12px; background: #1a1a1c; border: 1px solid #D4AF37; border-radius: 8px;">
              <span style="color: #D4AF37; font-weight: 900; font-size: 20px; letter-spacing: 1px;">GINASHE</span>
            </div>
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
            <div style="display: inline-block; padding: 12px; background: #1a1a1c; border: 1px solid #D4AF37; border-radius: 8px;">
              <span style="color: #D4AF37; font-weight: 900; font-size: 20px; letter-spacing: 1px;">GINASHE</span>
            </div>
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

      let receiptEmail: any = { data: null, error: null };
      if (resend) {
        receiptEmail = await resend.emails.send({
          from: fromEmail,
          to: [email],
          replyTo: "academy@ginashe.co.za",
          subject: subject,
          html: messageHtml,
        });

        if (receiptEmail.error) {
          console.error("[Resend Error] Receipt Email:", receiptEmail.error);
          await logCommunication({ recipientEmail: email, subject, emailType: 'confirmation', status: 'failed' });
        } else {
          console.log(`[Email] Receipt email sent successfully to ${email}`);
          await logCommunication({ recipientEmail: email, subject, emailType: 'confirmation' });
        }
      } else {
        console.warn("[Resend] API key missing. Receipt email skipped.");
      }

      // 2. Trigger Supabase Auth Invitation (ONLY for individuals)
      let authData = null;
      if (isIndividual && adminKey) {
        const origin = req.headers.origin || '';
        console.log(`[Auth] Sending invitation with origin: ${origin}`);
        const { data, error } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
          data: { full_name: name },
          redirectTo: `${origin}/verify`
        });
        authData = data;
        if (error) console.warn("[Supabase Error] Auth Invitation:", error.message);
        else console.log(`[Auth] Invitation sent successfully to ${email}`);
      }

      let adminEmail: any = { data: null, error: null };
      if (resend) {
        adminEmail = await resend.emails.send({
          from: fromEmail,
          to: ["academy@ginashe.co.za"],
          replyTo: "academy@ginashe.co.za",
          subject: `NEW ${type.toUpperCase()} ${isIndividual ? 'APPLICATION' : 'ENQUIRY'}: ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9; color: #333;">
              <h2 style="color: #D4AF37;">New ${type} Submission</h2>
              <p><strong>Name/Org:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${program ? `<p><strong>Program:</strong> ${program}</p>` : ''}
              <p><strong>Type:</strong> ${type}</p>
              <p><strong>Details:</strong></p>
              <pre style="background: #eee; padding: 10px; border-radius: 5px;">${JSON.stringify(details, null, 2)}</pre>
              <p><a href="${req.headers.origin || ''}/admin" style="display: inline-block; padding: 10px 20px; background: #D4AF37; color: white; text-decoration: none; border-radius: 5px;">View in Admin Dashboard</a></p>
            </div>
          `,
        });

        if (adminEmail.error) {
          console.error("[Resend Error] Admin Email:", adminEmail.error);
          await logCommunication({ recipientEmail: 'academy@ginashe.co.za', subject: `NEW ${type.toUpperCase()}: ${name}`, emailType: 'admin_notification', status: 'failed' });
        } else {
          console.log(`[Email] Admin notification sent successfully`);
          await logCommunication({ recipientEmail: 'academy@ginashe.co.za', subject: `NEW ${type.toUpperCase()}: ${name}`, emailType: 'admin_notification' });
        }
      } else {
        console.warn("[Resend] API key missing. Admin email skipped.");
      }

      // 4. Record History in the applications table
      try {
        const historyEntry = {
          event: 'Application Received',
          timestamp: new Date().toISOString(),
          details: 'Initial submission received and processing emails started.'
        };

        // We'll try to append to a history column if it exists, or just log it
        const { error: historyError } = await supabase
          .from('applications')
          .update({ 
            status: 'pending',
            // We assume there might be a history column, if not this will just fail or ignore
            // In a real scenario, we'd use a JSONB append
          })
          .eq('email', email)
          .eq('program', program);

        if (historyError) {
          console.warn("History Recording Error (Column might not exist):", historyError.message);
        }
      } catch (historyErr) {
        console.error("History Recording Catch:", historyErr);
      }

      res.json({ 
        success: true, 
        receipt: receiptEmail.data, 
        admin: adminEmail.data,
        auth: authData 
      });
    } catch (err: any) {
      console.error("Process Application Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Initial ping after server is ready to avoid blocking startup
    setTimeout(pingSupabase, 5000);
  });
}

startServer();
