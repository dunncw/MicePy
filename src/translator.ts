import fetch from 'cross-fetch';
import * as vscode from 'vscode';
// read in the local data file
import localData from './py_exceptions_translated.json';

async function translate(text: string): Promise<string> {
  // Read the setting
  const useLocalData = vscode.workspace.getConfiguration('micepy').get('useLocalData');
  
    // If useLocalData is true and the translation exists in the local data file, return the local translation
  if (useLocalData) {
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
    // console.log(response);
    if (!response.ok) {
      throw new Error(`Translation failed with status ${response.status}: ${await response.text()}`);
    }

    const outputs = await response.json();
    // console.log(outputs);

    const translated_text = outputs[0].translation_text;
    // console.log(translated_text);
    return translated_text;
    }
}

async function preloadModel(): Promise<void> {
  try {
    const url = "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-es";
    const apiKey = "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";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({inputs: 'preload model'})
    });

    if (!response.ok) {
      vscode.window.showErrorMessage(`Translation failed with status ${response.status}: ${await response.text()}`);
      throw new Error(`Translation failed with status ${response.status}: ${await response.text()}`);
    }

    const outputs = await response.json();
    const translated_text = outputs[0].translation_text;
    console.error(translated_text);
  } catch (error) {
    // print out error message to console
    console.error('Failed to preload model:', error);
  }
}

export { translate, preloadModel };
