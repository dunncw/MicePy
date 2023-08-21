import fetch from 'cross-fetch';
import * as vscode from 'vscode';
// read in the local data file
import localData from './py_exceptions_translated.json';

async function translate(text: string): Promise<string> {
  // Read the setting
  const useLocalData = vscode.workspace.getConfiguration('micepy').get('useLocalData');
  console.log(`useLocalData: ${useLocalData}`);
  
    // If useLocalData is true and the translation exists in the local data file, return the local translation
  if (useLocalData) {
    console.log('using local data');
    // take the text string and split it on ':'
    const splitText = text.split(':');
    const errorType = splitText[0].trim();

    // Search for the error in localData
    const errorData = localData.find(entry => entry['error type'] === errorType);

    if (errorData) {
      return `${errorData['translated error type']}: ${errorData['translated error description']}`;
    } else {
      vscode.window.showErrorMessage(`Error ${errorType} type not found in local data base. Try switching to the online model in extension settings for a more precise translation of your error. You can get to the settings by typing 'settings' in the command palette and then search for 'micepy' in the settings.`);
      throw new Error(`Error ${errorType} type not found in local data`);
    }
  }
  else {
    // Read the Hugging Face model URL from the extension settings
    const url = vscode.workspace.getConfiguration('micepy').get<string>('huggingFaceModelUrl') || 'https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-es'; // Default to the Spanish model
    const apiKey = "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";
    // console.log(`new url: '${url}'`);
    // testing to see what is being fed to translation model
    console.log(text)

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
    // console.log(response.url);

    // console.log(response);
    if (!response.ok) {
      vscode.window.showErrorMessage(`Translation failed with status ${response.status}: ${await response.text()}`);
      throw new Error(`Translation failed with status ${response.status}: ${await response.text()}`);
    }

    const outputs = await response.json();
    // print out the structure of the outputs with nice formatting
    //console.log(JSON.stringify(outputs, null, 2));

    const translated_text = outputs[0].translation_text;
    //console.log(translated_text);
    return translated_text;
    }
}

async function preloadModel(): Promise<void> {
  // console.log('start model preloading');
  try {
    // Read the Hugging Face model URL from the extension settings
    const url = vscode.workspace.getConfiguration('micepy').get<string>('huggingFaceModelUrl') || 'https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-es'; // Default to the Spanish model
    const apiKey = "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";
    // console.log(`new url: '${url}'`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({inputs: 'preload model'})
    });

    // print out the structure of the response
    // console.log(response.body);

    if (!response.ok) {
      console.error('Failed to preload model:', await response.text());
      return;
    }

    // Clone the response to consume the body more than once if necessary
    const clonedResponse = response.clone();

    const result = await clonedResponse.json();
    console.log('Model preloaded successfully:', result);
  } catch (error) {
    console.error('Failed to preload model:', error);
  }
}

export { translate, preloadModel };
