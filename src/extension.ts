import * as vscode from 'vscode';
import { translate, preloadModel } from './translator';
import { startPythonProcess } from './pythonRunner';
import { handleError } from './errorHandler';

export function activate(context: vscode.ExtensionContext) {
  preloadModel();

  vscode.workspace.onDidChangeConfiguration(async (event) => {
    if (event.affectsConfiguration('micepy.huggingFaceModelUrl')) {
      try {
        await preloadModel();
        vscode.window.showInformationMessage('New Hugging Face model URL loaded successfully.\nLoaded URL: ' + vscode.workspace.getConfiguration('micepy').get<string>('huggingFaceModelUrl'));
      } catch (error) {
        const typedError = error as Error;
        vscode.window.showErrorMessage(`Failed to preload new model: ${typedError.message}`);
      }
    }
  });

  //create the same onDidChangeConfiguration as above but for when the gptModelName is changed
  vscode.workspace.onDidChangeConfiguration(async (event) => {
    if (event.affectsConfiguration('micepy.gptModelName')) {
      try {
        // print to the console the text that was input into the gptModelName
        console.log(vscode.workspace.getConfiguration('micepy').get<string>('gptModelName'));
        // check the inputted text to see if it is a valid model name the valid model names are 'gpt-3.5-turbo' which is the default model and 'gpt-4'
        if (vscode.workspace.getConfiguration('micepy').get<string>('gptModelName') !== 'gpt-3.5-turbo' && vscode.workspace.getConfiguration('micepy').get<string>('gptModelName') !== 'gpt-4' && vscode.workspace.getConfiguration('micepy').get<string>('gptModelName') !== '') {
          // if the inputted text is not a valid model name then show an error message
          vscode.window.showErrorMessage('Invalid GPT model name!\nPlease enter a valid model name.\n Valid model names are: "gpt-3.5-turbo"(defualt) and "gpt-4"');
        } else {
          // if the inputted text is a valid model name then preload the model. print out the model name in the popup message
          vscode.window.showInformationMessage(`New GPT model name loaded successfully: ${vscode.workspace.getConfiguration('micepy').get<string>('gptModelName')}`);
        }
      } catch (error) {
        const typedError = error as Error;
        vscode.window.showErrorMessage(`Failed to preload GPT model: ${typedError.message}`);
      }
    }
  });


  vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
    if (document.languageId === 'python') {
      const checkOnOpen = vscode.workspace.getConfiguration('micepy').get('checkOnOpen');
      if (checkOnOpen) {
        handleError(document.fileName);
      }
    }
  });

  vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
    if (document.languageId === 'python') {
      const checkOnSave = vscode.workspace.getConfiguration('micepy').get('checkOnSave');
      if (checkOnSave) {
        handleError(document.fileName);
      }
    }
  });

  let runPythonFile = vscode.commands.registerCommand('micepy.runPythonFile', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found!');
      return;
    }

    if (editor.document.languageId !== 'python') {
      vscode.window.showErrorMessage('The current file is not a Python file!');
      return;
    }

    const filePath = editor.document.fileName;
    startPythonProcess(filePath)
      .then((translatedError) => {
        vscode.window.showErrorMessage(translatedError);
        console.log(translatedError);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  context.subscriptions.push(runPythonFile);

  // let disposable = vscode.commands.registerCommand('micepy.helloWorld', () => {
  //   const message = 'Hello World from MicePy!';
  //   vscode.window.showInformationMessage(message);
  // });
  // context.subscriptions.push(disposable);

  let disposable_two = vscode.commands.registerCommand('micepy.translate', async () => {
    const input = await vscode.window.showInputBox({
      prompt: 'Enter text to translate'
    });
    if (input) {
      try {
        const output = await translate(input);
        const message = `Translation: ${output}`;
        vscode.window.showInformationMessage(message);
      } catch (error: unknown) {
        console.error(error);
        vscode.window.showErrorMessage(`Translation failed: ${error!}`);
      }
    }
  });
  context.subscriptions.push(disposable_two);
}

export function deactivate() {}