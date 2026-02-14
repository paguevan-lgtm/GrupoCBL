import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Função que chama sua API Route
async function gerarTexto(prompt: string) {
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Erro ao chamar API Route:", err);
    return { error: "Erro ao chamar API" };
  }
}

// Componente simples para testar
function GeminiApp() {
  const [prompt, setPrompt] = useState("");
  const [resultado, setResultado] = useState("");

  const handleClick = async () => {
    const data = await gerarTexto(prompt);
    // Gemini retorna o texto em data.candidates[0].output (text-bison-001)
    if (data?.candidates && data.candidates[0]?.output) {
      setResultado(data.candidates[0].output);
    } else {
      setResultado(JSON.stringify(data));
    }
  };

  return (
    <div className="p-6 text-white bg-[#1A1A1A] min-h-screen">
      <h1 className="text-3xl mb-4">Teste Gemini API</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Digite o prompt"
        className="p-2 rounded text-black w-full mb-4"
      />
      <button
        onClick={handleClick}
        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
      >
        Gerar Texto
      </button>
      <div className="mt-6 whitespace-pre-wrap">{resultado}</div>
    </div>
  );
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GeminiApp />
  </React.StrictMode>
);
