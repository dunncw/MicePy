import OpenAI from 'openai';
import * as vscode from 'vscode';

export async function getErrorExplanation(error: string, code: string): Promise<string | null> {
    let gptAPIKey = vscode.workspace.getConfiguration('micepy').get<string>('openaiApiKey') || "";

    if (!gptAPIKey.trim()) {
        gptAPIKey = process.env.GPT_API_KEY || "";
    }

    if (!gptAPIKey.trim()) {
        vscode.window.showErrorMessage('OpenAI API Key is not set in either VSCode settings or environment variables.');
        return null;
    }

    const gptModelName = vscode.workspace.getConfiguration('micepy').get<string>('gptModelName') || 'gpt-3.5-turbo'; // Default to the GPT-3.5 turbo model

    if (!gptAPIKey) {
        vscode.window.showErrorMessage('GPT_API_KEY environment variable not set!\nPlease set it in your environment variables refer to the README for more information.');
        return null;
    }

    const openai = new OpenAI({
        apiKey: gptAPIKey,
    });

    const prompt = `Error encountered in the following code:\n\n${code}\n\nError message:\n${error}\n\nPlease explain the error and provide a one possible solution in the most concise manner possible.`;

    try {
        const response = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful coding assistant that explains complier errors in a clear concise manner." },
                { role: "user", content: prompt }
            ],
            model: gptModelName,
        });

        // for testing purposes, print the response text to the console
        console.log(response.choices[0].message?.content);

        return response.choices[0].message?.content ?? null;

    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            console.error('API Error:', error.message);
        } else {
            console.error('Failed to get error explanation:', error);
        }
        return null;
    }
}
