// ZIRI V4 — Multilingual AI Assistant
// Cloudflare Pages Function
// Workers AI binding: AI

const MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

const IDENTITY = `
You are ZIRI, a multilingual artificial intelligence assistant with an Algerian identity.

PROJECT:
- Name: ZIRI
- Identity: Algerian AI assistant
- Developer: ZIANE RACHID
- Email: ZIANE200018@GMAIL.COM
- Phone: 0552920520

IDENTITY RULES:
- If asked who you are, say you are ZIRI, an AI assistant with an Algerian identity.
- If asked who developed or created you, say that the ZIRI project was developed by ZIANE RACHID.
- Never claim that Meta created ZIRI.
- Cloudflare is the technology platform used by the project to run AI services.
- Never invent additional personal information about ZIANE RACHID.

LANGUAGE:
- Detect the language used by the user automatically.
- Reply in the same language whenever possible.
- Support Arabic, Algerian Darija, French, English, Spanish, Portuguese,
  Italian, German, Dutch, Turkish, Russian, Ukrainian, Polish, Romanian,
  Greek, Hebrew, Persian, Urdu, Hindi, Bengali, Chinese, Japanese, Korean,
  Vietnamese, Thai, Indonesian, Malay, Swahili and other languages supported
  by the AI model.
- If the user mixes languages, understand the mixture and reply naturally.
- Algerian Darija should be answered naturally when the user uses Darija.

KNOWLEDGE:
- Use your internal knowledge for general questions.
- When external search results are provided, use them carefully.
- Never invent facts, sources, URLs, people, dates or statistics.
- If information is uncertain or unavailable, clearly say so.
- Do not claim to have searched the internet unless search results were actually provided.

STYLE:
- Be helpful, clear and natural.
- Simple questions should receive concise answers.
- Complex questions can receive detailed explanations.
- For programming, provide practical and usable solutions.
`;

function cleanText(text, max = 5000) {
  if (typeof text !== "string") return "";
  return text.replace(/\s+/g, " ").trim().slice(0, max);
}

// Detect common languages/scripts
function detectLanguage(text) {
  const q = text.toLowerCase();

  if (/[\u4e00-\u9fff]/.test(text)) return "zh";
  if (/[\u3040-\u30ff]/.test(text)) return "ja";
  if (/[\uac00-\ud7af]/.test(text)) return "ko";
  if (/[\u0900-\u097f]/.test(text)) return "hi";
  if (/[\u0980-\u09ff]/.test(text)) return "bn";
  if (/[\u0a80-\u0aff]/.test(text)) return "gu";
  if (/[\u0b80-\u0bff]/.test(text)) return "ta";
  if (/[\u0c00-\u0c7f]/.test(text)) return "te";
  if (/[\u0d00-\u0d7f]/.test(text)) return "ml";
  if (/[\u0400-\u04ff]/.test(text)) return "ru";
  if (/[\u0590-\u05ff]/.test(text)) return "he";
  if (/[\u0600-\u06ff]/.test(text)) {
    if (/\b(وش|واش|راك|راني|صحا|بصح|كاين|شحال|علاش|كيفاش)\b/.test(q)) {
      return "ar";
    }
    return "ar";
  }

  if (/\b(le|la|les|des|une|est|avec|pour|dans|bonjour|comment)\b/.test(q)) {
    return "fr";
  }

  if (/\b(el|la|los|las|una|para|hola|cómo|que)\b/.test(q)) {
    return "es";
  }

  if (/\b(der|die|das|und|ist|für|nicht|hallo|wie)\b/.test(q)) {
    return "de";
  }

  if (/\b(il|lo|la|gli|una|per|ciao|come)\b/.test(q)) {
    return "it";
  }

  if (/\b(o|a|os|as|uma|para|como|olá|você)\b/.test(q)) {
    return "pt";
  }

  if (/\b(de|het|een|voor|hoe|hallo|niet)\b/.test(q)) {
    return "nl";
  }

  if (/\b(bir|ve|için|nasıl|merhaba|değil)\b/.test(q)) {
    return "tr";
  }

  if (/\b(hej|hur|och|inte|för)\b/.test(q)) {
    return "sv";
  }

  return "en";
}

// Wikipedia language endpoint
async function searchWikipedia(query, language) {
  try {
    const supported = [
      "ar", "en", "fr", "es", "de", "it", "pt", "nl",
      "tr", "ru", "uk", "pl", "ro", "el", "he", "fa",
      "ur", "hi", "bn", "zh", "ja", "ko", "vi", "th",
      "id", "ms", "sw", "sv"
    ];

    const lang = supported.includes(language) ? language : "en";

    const url =
      `https://${lang}.wikipedia.org/w/api.php` +
      `?action=query` +
      `&generator=search` +
      `&gsrsearch=${encodeURIComponent(query)}` +
      `&gsrlimit=5` +
      `&prop=extracts|info` +
      `&exintro=1` +
      `&explaintext=1` +
      `&inprop=url` +
      `&format=json` +
      `&origin=*`;

    const response = await fetch(url);

    if (!response.ok) return [];

    const data = await response.json();
    const pages = data?.query?.pages || {};

    return Object.values(pages)
      .map(page => ({
        title: cleanText(page.title || "", 300),
        text: cleanText(page.extract || "", 2500),
        url: page.fullurl || ""
      }))
      .filter(item => item.text);

  } catch {
    return [];
  }
}

// DuckDuckGo general search information
async function searchDuckDuckGo(query) {
  try {
    const url =
      "https://api.duckduckgo.com/" +
      `?q=${encodeURIComponent(query)}` +
      "&format=json" +
      "&no_html=1" +
      "&skip_disambig=0";

    const response = await fetch(url);

    if (!response.ok) return [];

    const data = await response.json();

    const results = [];

    if (data?.AbstractText) {
      results.push({
        title: cleanText(data.Heading || query, 300),
        text: cleanText(data.AbstractText, 2500),
        url: data.AbstractURL || ""
      });
    }

    if (Array.isArray(data?.RelatedTopics)) {
      for (const item of data.RelatedTopics.slice(0, 6)) {
        if (item?.Text) {
          results.push({
            title: cleanText(
              item.Text.split(" - ")[0] || query,
              300
            ),
            text: cleanText(item.Text, 1800),
            url: item.FirstURL || ""
          });
        }
      }
    }

    return results;

  } catch {
    return [];
  }
}

// Questions that benefit from external information
function needsSearch(query) {
  const q = query.toLowerCase();

  const words = [
    "today", "tonight", "now", "latest", "recent",
    "current", "news", "price", "prices", "score",
    "result", "results", "schedule", "weather",
    "2024", "2025", "2026",
    "اليوم", "الآن", "درك", "حاليا", "حالياً",
    "آخر", "اخر", "جديد", "حديث", "خبر", "أخبار",
    "سعر", "أسعار", "نتيجة", "نتائج", "موعد",
    "من هو", "من هي", "ما هو", "ما هي",
    "aujourd", "maintenant", "dernier", "dernière",
    "actualités", "prix", "résultat",
    "hoy", "ahora", "último", "noticias", "precio",
    "heute", "jetzt", "neu", "nachrichten", "preis",
    "oggi", "adesso", "notizie", "prezzo",
    "agora", "notícias", "preço",
    "bugün", "şimdi", "haber", "fiyat"
  ];

  return words.some(word => q.includes(word));
}

function removeDuplicates(items) {
  const unique = [];
  const seen = new Set();

  for (const item of items) {
    const key = (
      item.title +
      "|" +
      item.text
    ).slice(0, 500);

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  return unique;
}

export async function onRequestPost(context) {
  try {

    if (!context.env.AI) {
      return Response.json(
        {
          error:
            "Workers AI Binding باسم AI غير مفعّل."
        },
        { status: 503 }
      );
    }

    const body = await context.request.json();

    const messages = Array.isArray(body.messages)
      ? body.messages.slice(-12)
      : [];

    const safeMessages = messages
      .filter(
        m =>
          m &&
          (m.role === "user" ||
           m.role === "assistant") &&
          typeof m.content === "string"
      )
      .map(m => ({
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

    const lastUserMessage =
      [...safeMessages]
        .reverse()
        .find(m => m.role === "user");

    const question =
      cleanText(lastUserMessage?.content || "");

    const language = detectLanguage(question);

    let searchResults = [];

    if (question && needsSearch(question)) {

      const [wikiResults, duckResults] =
        await Promise.all([
          searchWikipedia(question, language),
          searchDuckDuckGo(question)
        ]);

      searchResults = removeDuplicates([
        ...wikiResults,
        ...duckResults
      ]).slice(0, 10);
    }

    let searchContext = "";

    if (searchResults.length) {

      searchContext =
        `

EXTERNAL INFORMATION FOUND ONLINE
Language used for the search: ${language}

Use the following information carefully:

${searchResults
  .map(
    (item, index) =>
      `[SOURCE ${index + 1}]
Title: ${item.title}
Information: ${item.text}
URL: ${item.url}`
  )
  .join("\n\n")}

Important:
- Treat search results as reference material, not absolute truth.
- Do not invent details that are not supported.
- If sources disagree, explain the uncertainty.
- Mention useful sources naturally when appropriate.
`;
    }

    const system = {
      role: "system",
      content:
        IDENTITY +
        `

CURRENT USER LANGUAGE:
${language}

Always understand the user's language and answer naturally in that language.

${searchContext}
`
    };

    const aiMessages = [
      system,
      ...safeMessages.slice(0, -1),
      {
        role: "user",
        content: question
      }
    ];

    const result = await context.env.AI.run(
      MODEL,
      {
        messages: aiMessages,
        max_tokens: 1200,
        temperature: 0.45
      }
    );

    const answer =
      result?.response ||
      "I could not generate a response right now.";

    return Response.json({
      response: answer,
      language,
      searched: searchResults.length > 0,
      sources: searchResults
        .filter(item => item.url)
        .slice(0, 5)
        .map(item => ({
          title: item.title,
          url: item.url
        }))
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
