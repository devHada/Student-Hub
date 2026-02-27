const GROQ_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile"; // or "mixtral-8x7b-32768", "gemma2-9b-it"

export async function askProfessor(systemPrompt, messages, fileData = null) {
  const formattedMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map(function (msg) {
      // If this is the last user message and a file is attached, embed it
      return {
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      };
    }),
  ];

  // Groq supports vision on specific models — if file is attached, inject it into last user message
  if (fileData) {
    const lastUserIdx = [...formattedMessages]
      .map((m) => m.role)
      .lastIndexOf("user");

    if (lastUserIdx !== -1) {
      formattedMessages[lastUserIdx] = {
        role: "user",
        content: [
          { type: "text", text: formattedMessages[lastUserIdx].content },
          {
            type: "image_url",
            image_url: {
              url: `data:${fileData.mimeType};base64,${fileData.base64}`,
            },
          },
        ],
      };
    }
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: formattedMessages,
      temperature: 0.9,
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Groq API error");
  return data.choices[0].message.content;
}

// This stays exactly the same — no changes needed
export async function fileToBase64(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onload = function () {
      resolve({ base64: reader.result.split(",")[1], mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
