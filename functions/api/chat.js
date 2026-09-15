<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ZIRI V3 — مساعدك الذكي الجزائري</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, Tahoma, sans-serif;
      background: #f5f7fa;
      color: #172033;
      min-height: 100vh;
    }

    header {
      height: 72px;
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand img {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      object-fit: cover;
    }

    .brand-text h1 {
      font-size: 20px;
    }

    .brand-text span {
      font-size: 12px;
      color: #6b7280;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    button {
      border: 0;
      cursor: pointer;
      font-family: inherit;
    }

    .top-btn {
      background: #f0f2f5;
      padding: 10px 14px;
      border-radius: 10px;
      color: #273142;
      font-weight: 600;
    }

    .top-btn:hover {
      background: #e5e7eb;
    }

    main {
      max-width: 1050px;
      margin: auto;
      padding: 30px 18px 130px;
    }

    .welcome {
      text-align: center;
      padding: 35px 10px 25px;
    }

    .welcome-logo {
      width: 80px;
      height: 80px;
      border-radius: 22px;
      object-fit: cover;
      margin-bottom: 16px;
    }

    .welcome h2 {
      font-size: 30px;
      margin-bottom: 8px;
    }

    .welcome p {
      color: #667085;
      line-height: 1.7;
    }

    .quick-prompts {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin: 20px 0 30px;
    }

    .prompt {
      background: #ffffff;
      border: 1px solid #e4e7ec;
      border-radius: 14px;
      padding: 16px;
      text-align: right;
      transition: 0.2s;
    }

    .prompt:hover {
      transform: translateY(-2px);
      border-color: #b8c0cc;
      box-shadow: 0 5px 20px rgba(0,0,0,0.05);
    }

    .prompt strong {
      display: block;
      margin-bottom: 6px;
    }

    .prompt small {
      color: #667085;
    }

    #chat {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .message {
      display: flex;
      width: 100%;
    }

    .message.user {
      justify-content: flex-start;
    }

    .message.assistant {
      justify-content: flex-end;
    }

    .bubble {
      max-width: 78%;
      padding: 14px 17px;
      border-radius: 18px;
      line-height: 1.75;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .user .bubble {
      background: #172033;
      color: #ffffff;
      border-bottom-left-radius: 5px;
    }

    .assistant .bubble {
      background: #ffffff;
      border: 1px solid #e4e7ec;
      border-bottom-right-radius: 5px;
    }

    .typing {
      opacity: 0.65;
      font-style: italic;
    }

    .composer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(255,255,255,0.96);
      backdrop-filter: blur(10px);
      border-top: 1px solid #e5e7eb;
      padding: 12px 16px;
      z-index: 20;
    }

    .composer-inner {
      max-width: 1050px;
      margin: auto;
      display: flex;
      gap: 10px;
    }

    #messageInput {
      flex: 1;
      min-height: 52px;
      max-height: 150px;
      resize: vertical;
      border: 1px solid #d0d5dd;
      border-radius: 14px;
      padding: 14px;
      font-family: inherit;
      font-size: 15px;
      outline: none;
    }

    #messageInput:focus {
      border-color: #667085;
    }

    #sendBtn {
      width: 58px;
      border-radius: 14px;
      background: #172033;
      color: white;
      font-size: 20px;
    }

    #sendBtn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .status {
      max-width: 1050px;
      margin: 7px auto 0;
      font-size: 12px;
      color: #667085;
      padding: 0 4px;
    }

    footer {
      text-align: center;
      color: #98a2b3;
      font-size: 12px;
      margin-top: 30px;
    }

    .modal-bg {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 100;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal-bg.show {
      display: flex;
    }

    .modal {
      background: white;
      width: min(500px, 100%);
      border-radius: 20px;
      padding: 25px;
      position: relative;
    }

    .modal h3 {
      margin-bottom: 15px;
    }

    .modal p {
      line-height: 1.8;
      color: #475467;
      margin-bottom: 8px;
    }

    .close-modal {
      position: absolute;
      top: 12px;
      left: 12px;
      background: #f2f4f7;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      font-size: 18px;
    }

    @media (max-width: 750px) {
      header {
        padding: 0 12px;
      }

      .top-btn {
        padding: 8px 10px;
        font-size: 12px;
      }

      .quick-prompts {
        grid-template-columns: repeat(2, 1fr);
      }

      .bubble {
        max-width: 90%;
      }

      .welcome h2 {
        font-size: 25px;
      }
    }

    @media (max-width: 450px) {
      .brand-text span {
        display: none;
      }

      .quick-prompts {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>

<body>

<header>
  <div class="brand">
    <img src="assets/ziane-logo.png" alt="ZIRI">
    <div class="brand-text">
      <h1>ZIRI</h1>
      <span>مساعدك الذكي الجزائري — V3</span>
    </div>
  </div>

  <div class="header-actions">
    <button class="top-btn" id="newChatBtn">＋ محادثة جديدة</button>
    <button class="top-btn" id="aboutBtn">حول ZIRI</button>
  </div>
</header>

<main>

  <section class="welcome" id="welcome">
    <img
      class="welcome-logo"
      src="assets/ziane-logo.png"
      alt="ZIRI"
    >

    <h2>مرحبا، أنا ZIRI 👋</h2>

    <p>
      مساعد ذكاء اصطناعي جزائري يساعدك في الأسئلة، البرمجة،
      الأفكار والمعلومات.
    </p>
  </section>

  <section class="quick-prompts" id="quickPrompts">

    <button class="prompt" data-prompt="من أنت؟">
      <strong>من أنت؟</strong>
      <small>تعرف على ZIRI</small>
    </button>

    <button class="prompt" data-prompt="من مطورك؟">
      <strong>من مطورك؟</strong>
      <small>تعرف على صاحب المشروع</small>
    </button>

    <button class="prompt" data-prompt="ساعدني في تعلم البرمجة">
      <strong>تعلم البرمجة</strong>
      <small>ابدأ رحلة البرمجة</small>
    </button>

    <button class="prompt" data-prompt="اعطني فكرة مشروع مربح">
      <strong>فكرة مشروع</strong>
      <small>أفكار عملية ومبتكرة</small>
    </button>

  </section>

  <section id="chat"></section>

  <footer>
    ZIRI V3 — يستخدم Cloudflare Workers AI
  </footer>

</main>

<div class="composer">
  <div class="composer-inner">

    <textarea
      id="messageInput"
      placeholder="اكتب رسالتك هنا..."
      rows="1"
    ></textarea>

    <button id="sendBtn" title="إرسال">
      ➤
    </button>

  </div>

  <div class="status" id="status">
    جاهز
  </div>
</div>

<div class="modal-bg" id="aboutModal">

  <div class="modal">

    <button class="close-modal" id="closeModal">×</button>

    <h3>حول ZIRI</h3>

    <p>
      ZIRI هو مشروع مساعد ذكاء اصطناعي بهوية جزائرية.
    </p>

    <p>
      تم تطوير المشروع بواسطة:
      <strong>ZIANE RACHID</strong>
    </p>

    <p>
      البريد:
      <strong>ZIANE200018@GMAIL.COM</strong>
    </p>

    <p>
      الهاتف:
      <strong>0552920520</strong>
    </p>

    <p>
      يعتمد ZIRI على Cloudflare Workers AI لتشغيل نموذج الذكاء الاصطناعي.
    </p>

  </div>

</div>

<script>
  const CHAT_KEY = "ziri_v3_chat";
  const HISTORY_KEY = "ziri_v3_history";

  const chat = document.getElementById("chat");
  const input = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");
  const status = document.getElementById("status");
  const newChatBtn = document.getElementById("newChatBtn");
  const aboutBtn = document.getElementById("aboutBtn");
  const aboutModal = document.getElementById("aboutModal");
  const closeModal = document.getElementById("closeModal");
  const welcome = document.getElementById("welcome");
  const quickPrompts = document.getElementById("quickPrompts");

  let messages = [];

  /*
   * V3 لا تستعمل تخزين V2.
   * هذا يجعل المحادثة القديمة لا تظهر تلقائياً.
   */

  function saveMessages() {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  }

  function loadMessages() {
    try {
      const saved = localStorage.getItem(CHAT_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          messages = parsed;
        }
      }
    } catch (error) {
      messages = [];
    }
  }

  function render() {
    chat.innerHTML = "";

    if (messages.length > 0) {
      welcome.style.display = "none";
      quickPrompts.style.display = "none";
    } else {
      welcome.style.display = "block";
      quickPrompts.style.display = "grid";
    }

    messages.forEach(message => {
      addMessageToScreen(message.role, message.content);
    });

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  }

  function addMessageToScreen(role, content) {
    const wrapper = document.createElement("div");

    wrapper.className =
      "message " +
      (role === "user" ? "user" : "assistant");

    const bubble = document.createElement("div");

    bubble.className = "bubble";
    bubble.textContent = content;

    wrapper.appendChild(bubble);
    chat.appendChild(wrapper);

    return bubble;
  }

  function setStatus(text) {
    status.textContent = text;
  }

  async function sendMessage(text) {

    text = text.trim();

    if (!text || sendBtn.disabled) {
      return;
    }

    messages.push({
      role: "user",
      content: text
    });

    saveMessages();
    render();

    input.value = "";
    sendBtn.disabled = true;
    setStatus("يفكر...");

    const typingWrapper = document.createElement("div");

    typingWrapper.className = "message assistant";

    const typingBubble = document.createElement("div");

    typingBubble.className = "bubble typing";
    typingBubble.textContent = "ZIRI يفكر...";

    typingWrapper.appendChild(typingBubble);
    chat.appendChild(typingWrapper);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });

    try {

      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          messages: messages.slice(-12)
        })
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("الخادم لم يرجع استجابة صحيحة.");
      }

      if (!response.ok) {
        throw new Error(
          data?.error || "حدث خطأ في خدمة ZIRI."
        );
      }

      const answer =
        data?.response ||
        "لم أستطع توليد رد الآن.";

      messages.push({
        role: "assistant",
        content: answer
      });

      saveMessages();

      typingWrapper.remove();

      render();

      setStatus("جاهز");

    } catch (error) {

      typingWrapper.remove();

      const errorMessage =
        "تعذر الاتصال بخدمة ZIRI.\n\n" +
        (error?.message || "خطأ غير معروف");

      messages.push({
        role: "assistant",
        content: errorMessage
      });

      saveMessages();
      render();

      setStatus("حدث خطأ");
    }

    sendBtn.disabled = false;
    input.focus();
  }

  function newChat() {

    if (messages.length > 0) {

      const confirmed = confirm(
        "هل تريد بدء محادثة جديدة؟"
      );

      if (!confirmed) {
        return;
      }
    }

    messages = [];

    localStorage.removeItem(CHAT_KEY);

    render();

    setStatus("محادثة جديدة");
    input.focus();
  }

  sendBtn.addEventListener("click", () => {
    sendMessage(input.value);
  });

  input.addEventListener("keydown", event => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage(input.value);
    }
  });

  newChatBtn.addEventListener("click", newChat);

  document.querySelectorAll(".prompt").forEach(button => {

    button.addEventListener("click", () => {

      const prompt = button.dataset.prompt;

      sendMessage(prompt);
    });

  });

  aboutBtn.addEventListener("click", () => {
    aboutModal.classList.add("show");
  });

  closeModal.addEventListener("click", () => {
    aboutModal.classList.remove("show");
  });

  aboutModal.addEventListener("click", event => {

    if (event.target === aboutModal) {
      aboutModal.classList.remove("show");
    }

  });

  loadMessages();
  render();
</script>

</body>
</html>
