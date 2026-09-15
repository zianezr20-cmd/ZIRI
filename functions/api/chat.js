// ZIRI V2 — Cloudflare Pages Function
// Workers AI binding name: AI

const MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

export async function onRequestPost(context) {
  try {
    // التأكد أن Workers AI مربوط
    if (!context.env.AI) {
      return Response.json(
        {
          error: "Workers AI Binding باسم AI غير مفعّل بعد."
        },
        { status: 503 }
      );
    }

    // قراءة البيانات القادمة من الموقع
    const body = await context.request.json();

    const messages = Array.isArray(body.messages)
      ? body.messages.slice(-12)
      : [];

    // تنظيف الرسائل وحمايتها
    const safeMessages = messages
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
      .map((m) => ({
        role: m.role,
        content: m.content.slice(0, 8000)
      }));

    if (!safeMessages.length) {
      return Response.json(
        {
          error: "أرسل رسالة أولاً."
        },
        { status: 400 }
      );
    }

    // شخصية ZIRI
    const system = {
      role: "system",
      content:
        "أنت ZIRI، مساعد ذكي جزائري محترم وعملي. " +
        "أجب باللغة التي يستخدمها المستخدم. " +
        "إذا كتب بالدارجة الجزائرية، يمكنك الرد بالدارجة بشكل طبيعي. " +
        "كن واضحاً ومفيداً ولا تدّعي أنك إنسان. " +
        "عند البرمجة أعطِ حلولاً قابلة للتطبيق واذكر التحذيرات المهمة باختصار."
    };

    // إرسال الطلب إلى Cloudflare Workers AI
    const result = await context.env.AI.run(MODEL, {
      messages: [system, ...safeMessages],
      max_tokens: 700,
      temperature: 0.6
    });

    // إرسال جواب ZIRI للموقع
    return Response.json({
      response:
        result?.response || "لم أستطع توليد رد الآن."
    });

  } catch (error) {
    return Response.json(
      {
        error:
          "خطأ في خدمة ZIRI: " +
          (error?.message || "unknown")
      },
      { status: 500 }
    );
  }
}
