import fetch from 'cross-fetch';

async function translate(text: string): Promise<string> {
  const url = "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-es";
  const apiKey = "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";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: text
    })
  });


  if (!response.ok) {
    throw new Error(`Translation failed with status ${response.status}: ${await response.text()}`);
  }

  console.log(response);

  const { outputs } = await response.json() as { outputs: string };
  console.log(outputs);
  return outputs;
}

export { translate };
