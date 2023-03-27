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
        vscode.window.showInformationMessage('New Hugging Face model URL loaded successfully.');
      } catch (error) {
        const typedError = error as Error;
        vscode.window.showErrorMessage(`Failed to preload new model: ${typedError.message}`);
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

  let disposable = vscode.commands.registerCommand('micepy.helloWorld', () => {
    const message = 'Hello World from MicePy!';
    vscode.window.showInformationMessage(message);
  });
  context.subscriptions.push(disposable);

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