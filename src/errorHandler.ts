import { startPythonProcess } from './pythonRunner';
import * as vscode from 'vscode';

export function handleError(filePath: string) {
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