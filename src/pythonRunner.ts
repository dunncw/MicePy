import { spawn } from 'child_process';
import {translate} from './translator';

export function startPythonProcess(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [filePath]);

    // Listen for errors from the Python process
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python error: ${data}`);
      //grab the last line of the error
      let error = data.toString().split('\n');
      // index to the second to last line of the array error
      let errorLine = error[error.length - 2];
    //   console.log(errorLine);
      const translatedError = translate(errorLine);
    //   console.log(translatedError);
      resolve(translatedError);
    });

    // Listen for the Python process to exit
    pythonProcess.on('exit', (code) => {
      console.log(`Python process exited with code ${code}`);
      pythonProcess.kill();
    });
  });
}