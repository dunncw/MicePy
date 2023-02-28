import fetch from 'cross-fetch';

async function translate(text: string): Promise<string> {
  const url = "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-es";
  const apiKey = "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";

  // create the body data for the request
  // it should grab the text from the input box and put it in the body wrapped in quotes

  // make the request
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({inputs: text})
  });

  // print out the structure of the response
  console.log(response);


  if (!response.ok) {
    throw new Error(`Translation failed with status ${response.status}: ${await response.text()}`);
  }

  const outputs = await response.json();
  console.log(outputs);

  const translated_text = outputs[0].translation_text;
  console.log(translated_text);
  return translated_text;
}

export { translate };
