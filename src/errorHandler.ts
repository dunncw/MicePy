import { startPythonProcess } from './pythonRunner';
import { getErrorExplanation } from './gptErrorExplain';
import * as vscode from 'vscode';

export async function handleError(filePath: string) {
  const useGPTForErrorExplanation = vscode.workspace.getConfiguration('micepy').get('useGPTForErrorExplanation');
  const gptModelName = vscode.workspace.getConfiguration('micepy').get<string>('gptModelName') || 'code-davinci-002';

  startPythonProcess(filePath)
    .then(async (translatedError) => {
      // If useGPTForErrorExplanation is true, then request the error explanation from GPT
      if (useGPTForErrorExplanation && gptModelName) {
        try {
          const document = await vscode.workspace.openTextDocument(filePath);
          const errorExplanation = await getErrorExplanation(gptModelName, translatedError, document.getText());

          if (errorExplanation) {
            translatedError += '\n\n' + errorExplanation;
          }
        } catch (error) {
          console.error('Failed to get error explanation:', error);
        }
      }

      // Create a pop-up window with the translated error
      vscode.window.showErrorMessage(translatedError);
      console.log(translatedError);
    })
    .catch((error) => {
      console.error(error);
    });
}