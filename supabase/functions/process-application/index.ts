import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_g9aDKBEy_FQT6yxzaq1oQKeNWEhBjF3Ev';
    const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'Ginashe Digital Academy <noreply@academy.ginashe.co.za>';
    
    const body = await req.json();
    const { email, name, type, target_department, details } = body;

    let htmlContent = `<h2>New Platform Submission: ${type ? type.toUpperCase() : 'GENERAL'}</h2>`;
    htmlContent += `<p><strong>Name/Org:</strong> ${name || 'N/A'}</p>`;
    htmlContent += `<p><strong>Contact Email:</strong> ${email || 'N/A'}</p>`;
    
    htmlContent += `<h3>Submission Details:</h3><ul>`;
    if (details && typeof details === 'object') {
        for (const [key, value] of Object.entries(details)) {
          htmlContent += `<li><strong>${key}:</strong> ${value}</li>`;
        }
    }
    htmlContent += `</ul>`;

    const resendReq = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [target_department || 'academy@ginashe.co.za'],
        subject: `[GDA Platform] New ${type} Request from ${name}`,
        html: htmlContent,
        reply_to: email
      })
    });

    const resendRes = await resendReq.json();

    return new Response(
      JSON.stringify(resendRes),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: resendReq.ok ? 200 : 400 
      }
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
