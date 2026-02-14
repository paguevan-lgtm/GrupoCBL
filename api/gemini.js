import fetch from "node-fetch"; // se usar Next.js 13+ pode usar fetch nativo

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Somente POST permitido" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "O prompt é obrigatório" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro Gemini API:", error);
    res.status(500).json({ error: "Erro ao chamar a Gemini API" });
  }
}
