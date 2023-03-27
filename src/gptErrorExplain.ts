import { Configuration, OpenAIApi } from 'openai';
import * as vscode from 'vscode';

export async function getErrorExplanation(modelName: string, error: string, code: string): Promise<string | null> {
  const apiKey = vscode.workspace.getConfiguration('micepy').get<string>('gptAPIKey');
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  const prompt = `Error encountered in the following code:\n\n${code}\n\nError message:\n${error}\n\nPlease explain the error and provide a possible solution.`;

  try {
    const response = await openai.createCompletion({
      model: modelName,
      prompt,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    return response.data.choices[0].text ?? null;
  } catch (error) {
    console.error('Failed to get error explanation:', error);
    return null;
  }
}