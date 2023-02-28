// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {translate} from './translator';
import { startPythonProcess } from './pythonRunner';
import { spawn } from 'child_process';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "micepy" is now active!');
	  // Register a new event handler for when a text document is opened
    vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
        // Check if the document is a Python file
        if (document.languageId === 'python') {
          const filePath = document.fileName;
          console.log('Python file opened:', document.fileName);
          startPythonProcess(filePath)
            .then((translatedError) => {
              //create a pop up window with the translated error
              vscode.window.showErrorMessage(translatedError);
              console.log(translatedError);
            })
            .catch((error) => {
              console.error(error);
            });
        }
    });

    // Register a new event handler for when a text document is saved
    vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
        // Check if the document is a Python file
        if (document.languageId === 'python') {
          const filePath = document.fileName;
          console.log('Python file opened:', document.fileName);
          startPythonProcess(filePath)
            .then((translatedError) => {
              //create a pop up window with the translated error
              vscode.window.showErrorMessage(translatedError);
              console.log(translatedError);
            })
            .catch((error) => {
              console.error(error);
            });
        }
    });

		// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('micepy.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
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

// This method is called when your extension is deactivated
export function deactivate() {}
