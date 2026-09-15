// ZIRI V3 — Cloudflare Pages Function
// Workers AI binding name: AI

const MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

export async function onRequestPost(context) {
  try {
    if (!context.env.AI) {
      return Response.json(
        { error: "Workers AI Binding باسم AI غير مفعّل بعد." },
        { status: 503 }
      );
    }

    const body = await context.request.json();

    const messages = Array.isArray(body.messages)
      ? body.messages.slice(-12)
      : [];

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
        { error: "أرسل رسالة أولاً." },
        { status: 400 }
      );
    }

    const system = {
      role: "system",
      content:
        "أنت ZIRI، مساعد ذكاء اصطناعي جزائري محترم وعملي. " +
        "اسمك ZIRI. " +
        "مشروع ZIRI هو مشروع ذكاء اصطناعي بهوية جزائرية. " +
        "المطور وصاحب المشروع هو ZIANE RACHID. " +
        "البريد الإلكتروني للمطور هو ZIANE200018@GMAIL.COM. " +
        "رقم الهاتف المخصص للمطور هو 0552920520. " +
        "إذا سُئلت: من أنت؟ أجب بأنك ZIRI، مساعد ذكاء اصطناعي جزائري. " +
        "إذا سُئلت: من صنعك أو من مطورك؟ أجب بأن مشروع ZIRI مطور من طرف ZIANE RACHID. " +
        "لا تقل إن Meta أو فريقاً عشوائياً هو الذي صنع ZIRI. " +
        "يمكنك ذكر أن ZIRI يستخدم Cloudflare Workers AI لتشغيل الذكاء الاصطناعي عندما يكون ذلك مناسباً. " +
        "لا تخترع معلومات شخصية إضافية عن ZIANE RACHID. " +
        "إذا لم تكن تعرف معلومة، قل إنك لا تعرفها بدلاً من اختلاقها. " +
        "أجب باللغة التي يستخدمها المستخدم. " +
        "إذا كتب المستخدم بالدارجة الجزائرية، أجب بالدارجة الجزائرية بشكل طبيعي. " +
        "كن واضحاً ومفيداً ومختصراً عندما يكون السؤال بسيطاً، ومفصلاً عندما يحتاج الأمر. " +
        "عند البرمجة، قدم حلولاً عملية وقابلة للتطبيق. " +
        "لا تدّعي أنك إنسان ولا تدّعي امتلاك معلومات مباشرة من الإنترنت إذا لم تكن متاحة لك."
    };

    const result = await context.env.AI.run(MODEL, {
      messages: [system, ...safeMessages],
      max_tokens: 900,
      temperature: 0.55
    });

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
