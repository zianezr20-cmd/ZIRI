# ZIRI V2 🇩🇿

نسخة مطورة من ZIRI جاهزة للنشر على **Cloudflare Pages**.

## ماذا أضيف؟

- واجهة محادثة احترافية.
- حفظ المحادثات في LocalStorage.
- بحث في المحادثات.
- وضع الزائر.
- أزرار اقتراحات سريعة.
- اتصال آمن من الواجهة إلى `Pages Function`.
- تشغيل AI عبر **Cloudflare Workers AI** بدون وضع مفتاح API في `index.html`.
- النموذج الافتراضي: `@cf/meta/llama-3.1-8b-instruct-fast`.

## تفعيل الذكاء الاصطناعي في Cloudflare

1. افتح مشروع ZIRI في Cloudflare Pages.
2. اذهب إلى **Settings → Functions → Bindings** (قد يختلف مكانها قليلًا حسب لوحة Cloudflare الحالية).
3. أضف **Workers AI**.
4. اجعل **Variable name** = `AI`.
5. احفظ.
6. أعد Deploy للمشروع.

Cloudflare توثق أن Pages Functions يمكنها استخدام Workers AI عبر `context.env.AI` بعد إضافة binding باسم `AI`.

## ملاحظة عن المجانية

Workers AI لديه حاليًا تخصيص مجاني قدره **10,000 Neurons يوميًا** على Workers Free. بعد استهلاك الحصة المجانية تتوقف طلبات AI على الخطة المجانية حتى إعادة ضبط الحصة. لذلك لا تعتبر الخدمة غير محدودة مجانًا.

## الملفات

- `index.html` — الواجهة.
- `functions/api/chat.js` — API آمن للذكاء الاصطناعي.
- `assets/ziane-logo.png` — شعار المطور.

## النشر

ارفع محتويات هذا المجلد إلى نفس مشروع Cloudflare Pages الذي تستعمله لـ ZIRI، مع الحفاظ على مجلد `functions`.

بعد النشر افتح:
`https://zianepro09.pages.dev/`

وجرب:
"تحدث معي بالدارجة الجزائرية وعرّفني بنفسك."
