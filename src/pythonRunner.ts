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
      // console.log(`Python error: ${data}`);
      let error = data.toString()
      let chopup = data.toString().split('\n');
      console.log(error);

      // create a string and concat all the lines of error
      let errorLine = '';
      for (let i = 0; i < chopup.length - 1; i++) {
        // if the error line is empty, skip it
        if (chopup[i] === '') {
          continue;
        }
        // if the error line starts with 'Traceback', skip it
        if (chopup[i].startsWith('Traceback')) {
          continue;
        }
        // if the error line starts with 'File', skip it
        if (chopup[i].startsWith('  File')) {
          continue;
        }
        // if the error line is all special characters, skip it
        if (/^[^a-zA-Z0-9]+$/.test(chopup[i])) {
          continue;
        }
        // put a space between each line and concat it to errorLine. also remove leading and trailing spaces
        errorLine += ` ${chopup[i].trim()}`;
      }
      // let errorLine = error[error.length - 2];
      // console.log(`Error line: ${errorLine}`);

      // if errorLine starst with 'Traceback' dont run it

      //log useGPTForErrorExplanation with nice formatting
      // console.log(`useGPTForErrorExplanation: ${useGPTForErrorExplanation}`);
  
      if (error.includes('Traceback (most recent call last):')) {
        // if using gpt for error explanation
        console.log(`Error line: ${errorLine}`);
        if (useGPTForErrorExplanation) {
          vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Processing Error Explanation",
            cancellable: true
          }, async (progress, token) => {
            token.onCancellationRequested(() => {
              console.log("User cancelled the long running operation")
            });

            progress.report({ increment: 0, message: "Explaining Error" });

            const explanation = await getErrorExplanation(errorLine, code.toString());
            progress.report({ increment: 25, message: "Translating Error" });

            const translatedError = await translate(errorLine);
            progress.report({ increment: 50, message: "Translating Explanation" });
            const translatedExplanation = explanation ? await translate(explanation) : null;
            progress.report({ increment: 100, message: "Done" });

            if (translatedExplanation) {
              resolve(`${translatedError}\n\n${translatedExplanation}`);
            } else {
              resolve(translatedError);
            }
          });
        } 
        // if not using gpt for error explanation
        else {
          vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Processing Error Translation",
            cancellable: true
          }, async (progress, token) => {
            token.onCancellationRequested(() => {
              console.log("User cancelled the long running operation")
            });

            progress.report({ increment: 5 , message: "Translating Error"});

            const translatedError = await translate(errorLine);
            progress.report({ increment: 100 });

            resolve(translatedError);
          });
        }
      }
    });
    pythonProcess.on('exit', (code) => {
      console.log(`Python process exited with code ${code}`);
      pythonProcess.kill();
    });
  });
}