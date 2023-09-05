import { spawn } from 'child_process';
import { translate } from './translator';
import * as vscode from 'vscode';
import { getErrorExplanation } from './gptErrorExplain';

export async function startPythonProcess(filePath: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const pythonProcess = spawn('python', [filePath]);
    const code = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
    const useGPTForErrorExplanation = vscode.workspace.getConfiguration('micepy').get('useGPTForErrorExplanation');

    pythonProcess.stderr.on('data', async (data) => {
      console.error(`Python error: ${data}`);
      let error = data.toString().split('\n');
      let errorLine = error[error.length - 2];

      //log useGPTForErrorExplanation with nice formatting
      console.log(`useGPTForErrorExplanation: ${useGPTForErrorExplanation}`);
  
      // Check if the error string contains 'Traceback (most recent call last):'
      if (error[0].includes('Traceback (most recent call last):')) {
        // if using gpt for error explanation
        if (useGPTForErrorExplanation) {
          const explanation = await getErrorExplanation(errorLine, code.toString());
          const translatedError = await translate(errorLine);
          const translatedExplanation = explanation ? await translate(explanation) : null;
          if (translatedExplanation) {
            resolve(`${translatedError}\n\n${translatedExplanation}`);
          } else {
            resolve(translatedError);
          }
        } 
        // if not using gpt for error explanation
        else {
          const translatedError = await translate(errorLine);
          resolve(translatedError);
        }
      }
    });
    pythonProcess.on('exit', (code) => {
      console.log(`Python process exited with code ${code}`);
      pythonProcess.kill();
    });
  });
}
