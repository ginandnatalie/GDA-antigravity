export async function onRequestPost(context) {
  const { request, env } = context;
  const { courseId, userId, amount, email } = await request.json();

  if (!env.PAYSTACK_SECRET_KEY) {
    return new Response(JSON.stringify({ error: "Paystack secret key is missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const origin = new URL(request.url).origin;
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Amount in kobo/cents
        callback_url: `${origin}/?payment=success&courseId=${courseId}`,
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

    return new Response(JSON.stringify({ url: data.data.authorization_url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Paystack Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
