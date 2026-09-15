// ZIRI V5 — AI Image Generation
// Cloudflare Pages Function
// Workers AI binding: AI

const IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";

export async function onRequestPost(context) {
  try {
    if (!context.env.AI) {
      return Response.json(
        { error: "Workers AI Binding باسم AI غير مفعّل." },
        { status: 503 }
      );
    }

    const body = await context.request.json();

    const prompt =
      typeof body?.prompt === "string"
        ? body.prompt.trim().slice(0, 2048)
        : "";

    if (!prompt) {
      return Response.json(
        { error: "اكتب وصفًا للصورة أولاً." },
        { status: 400 }
      );
    }

    const result = await context.env.AI.run(IMAGE_MODEL, {
      prompt,
      steps: 4,
      seed: Math.floor(Math.random() * 2147483647)
    });

    if (!result?.image) {
      return Response.json(
        { error: "لم يتم إنشاء الصورة." },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      image: `data:image/jpeg;base64,${result.image}`,
      model: IMAGE_MODEL
    });

  } catch (error) {
    return Response.json(
      {
        error:
          "خطأ في توليد الصورة: " +
          (error?.message || "unknown")
      },
      { status: 500 }
    );
  }
}
