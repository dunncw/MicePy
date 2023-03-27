import { spawn } from 'child_process';
import { translate } from './translator';
import * as vscode from 'vscode';
import { getErrorExplanation } from './gptErrorExplain';

export async function startPythonProcess(filePath: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const pythonProcess = spawn('python', [filePath]);
    const useGPTForErrorExplanation = vscode.workspace.getConfiguration('micepy').get('useGPTForErrorExplanation');
    const code = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));

    pythonProcess.stderr.on('data', async (data) => {
      console.error(`Python error: ${data}`);
      let error = data.toString().split('\n');
      let errorLine = error[error.length - 2];

      if (useGPTForErrorExplanation) {
        const gptAPIKey = vscode.workspace.getConfiguration('micepy').get('gptAPIKey');
        const gptModelName = vscode.workspace.getConfiguration('micepy').get<string>('gptModelName');

        if (gptAPIKey && gptModelName) {
          const explanation = await getErrorExplanation(gptModelName, errorLine, code.toString());
          const translatedError = await translate(errorLine);
          const translatedExplanation = explanation ? await translate(explanation) : null;

          if (translatedExplanation) {
            resolve(`${translatedError}\n\nExplanation: ${translatedExplanation}`);
          } else {
            resolve(translatedError);
          }
        } else {
          const translatedError = await translate(errorLine);
          resolve(translatedError);
        }
      } else {
        const translatedError = await translate(errorLine);
        resolve(translatedError);
      }
    });

    pythonProcess.on('exit', (code) => {
      console.log(`Python process exited with code ${code}`);
      pythonProcess.kill();
    });
  });
}