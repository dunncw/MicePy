import { spawn } from 'child_process';
import { translate } from './translator';
import * as vscode from 'vscode';
import { getErrorExplanation } from './gptErrorExplain';

export async function startPythonProcess(filePath: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const pythonProcess = spawn('python', [filePath]);
    const code = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
    const useGPTForErrorExplanation = vscode.workspace.getConfiguration('micepy').get('useGPTForErrorExplanation');

    let errorBuffer = "";

    pythonProcess.stderr.on('data', (data) => {
      errorBuffer += data.toString();
    });

    pythonProcess.on('exit', async (code) => {
      console.log(`Python process exited with code ${code}`);

      if (errorBuffer) {
        let chopup = errorBuffer.split('\n');
        console.log(errorBuffer);

        // create a string and concat all the lines of error
        let errorLine = '';
        for (let i = 0; i < chopup.length - 1; i++) {
          // Various conditions to skip lines
          if (chopup[i] === '' || 
              chopup[i].startsWith('Traceback') || 
              chopup[i].startsWith('  File') || 
              /^[^a-zA-Z0-9]+$/.test(chopup[i])) {
            continue;
          }
          // concatenate the error lines
          errorLine += ` ${chopup[i].trim()}`;
        }

        if (errorBuffer.includes('Traceback (most recent call last):')) {
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

              const explanation = await getErrorExplanation(errorLine, code?.toString() ?? '');

              if (!explanation) {
                  resolve("Failed to get error explanation from OpenAI. Please check your API key.");
                  return;
              }

              progress.report({ increment: 25, message: "Translating Error" });

              const translatedError = await translate(errorLine);
              progress.report({ increment: 50, message: "Translating Explanation" });

              const translatedExplanation = await translate(explanation);
              progress.report({ increment: 100, message: "Done" });

              resolve(`${translatedError}\n\n${translatedExplanation}`);
            });
          } else {
            vscode.window.withProgress({
              location: vscode.ProgressLocation.Notification,
              title: "Processing Error Translation",
              cancellable: true
            }, async (progress, token) => {
              token.onCancellationRequested(() => {
                console.log("User cancelled the long running operation")
              });

              progress.report({ increment: 5 , message: "Translating Error" });

              const translatedError = await translate(errorLine);
              progress.report({ increment: 100 });

              resolve(translatedError);
            });
          }
        }
      }

      pythonProcess.kill();
    });
  });
}


// import { spawn } from 'child_process';
// import { translate } from './translator';
// import * as vscode from 'vscode';
// import { getErrorExplanation } from './gptErrorExplain';

// export async function startPythonProcess(filePath: string): Promise<string> {
//   return new Promise(async (resolve, reject) => {
//     const pythonProcess = spawn('python', [filePath]);
//     const code = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
//     const useGPTForErrorExplanation = vscode.workspace.getConfiguration('micepy').get('useGPTForErrorExplanation');

//     let errorBuffer = "";

//     pythonProcess.stderr.on('data', (data) => {
//       errorBuffer += data.toString();
//     });

//     pythonProcess.on('exit', async (code) => {
//       console.log(`Python process exited with code ${code}`);

//       if (errorBuffer) {
//         let chopup = errorBuffer.split('\n');
//         console.log(errorBuffer);

//         // create a string and concat all the lines of error
//         let errorLine = '';
//         for (let i = 0; i < chopup.length - 1; i++) {
//           // Various conditions to skip lines
//           if (chopup[i] === '' || 
//               chopup[i].startsWith('Traceback') || 
//               chopup[i].startsWith('  File') || 
//               /^[^a-zA-Z0-9]+$/.test(chopup[i])) {
//             continue;
//           }
//           // concatenate the error lines
//           errorLine += ` ${chopup[i].trim()}`;
//         }

//         if (errorBuffer.includes('Traceback (most recent call last):')) {
//           console.log(`Error line: ${errorLine}`);

//           if (useGPTForErrorExplanation) {
//             // Process the error with GPT
//             vscode.window.withProgress({
//               location: vscode.ProgressLocation.Notification,
//               title: "Processing Error Explanation",
//               cancellable: true
//             }, async (progress, token) => {
//               token.onCancellationRequested(() => {
//                 console.log("User cancelled the long running operation")
//               });
  
//               progress.report({ increment: 0, message: "Explaining Error" });
  
//               const explanation = await getErrorExplanation(errorLine, code?.toString() ?? '');
//               progress.report({ increment: 25, message: "Translating Error" });
  
//               const translatedError = await translate(errorLine);
//               progress.report({ increment: 50, message: "Translating Explanation" });
//               const translatedExplanation = explanation ? await translate(explanation) : null;
//               progress.report({ increment: 100, message: "Done" });
  
//               if (translatedExplanation) {
//                 resolve(`${translatedError}\n\n${translatedExplanation}`);
//               } else {
//                 resolve(translatedError);
//               }
//             });
//           } else {
//             // Logic for when GPT isn't used
//             vscode.window.withProgress({
//               location: vscode.ProgressLocation.Notification,
//               title: "Processing Error Translation",
//               cancellable: true
//             }, async (progress, token) => {
//               token.onCancellationRequested(() => {
//                 console.log("User cancelled the long running operation")
//               });
  
//               progress.report({ increment: 5 , message: "Translating Error"});
  
//               const translatedError = await translate(errorLine);
//               progress.report({ increment: 100 });
  
//               resolve(translatedError);
//             });
//           }
//         }
//       }

//       pythonProcess.kill();
//     });
//   });
// }
