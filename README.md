# MicePy README

MicePy is a VSCode extension designed to make Python programming more accessible to non-native English speakers. It utilizes machine learning to translate Python error messages and provides descriptive explanations in most languages. The extension leverages large language models for translation and error explainability, offering a low-cost, plug-and-play approach to language translation.

## Setup !!IMPORTANT!!

If you plan to use MicePy in online mode you will need to set up environment variables for each api you intend to use. If you do not know how to set up and environment variable see tutorials below. 

Environment variables you will need:
- To use hugging face models user will need to have a environment variable named 'HF_API_KEY' that contains hugging face API key
- To use Openai GPT models user will need to have a environment variable name 'GPT_API_KEY' that contians OpenAI API key

How to set up env environment: 
Mac - https://apple.stackexchange.com/questions/106778/how-do-i-set-environment-variables-on-os-x
Windows - https://docs.oracle.com/en/database/oracle/machine-learning/oml4r/1.5.1/oread/creating-and-modifying-environment-variables-on-windows.html#GUID-DD6F9982-60D5-48F6-8270-A27EC53807D0
Lunix - https://www3.ntu.edu.sg/home/ehchua/programming/howto/Environment_Variables.html#:~:text=You%20can%20set%20an%20environment,.%20)%20is%20hidden%20by%20default.

## Features

MicePy offers several unique features:

1. **Error Explainability with Large Language Models (LLMs):** MicePy integrates an LLM to provide detailed explanations for Python errors and suggest potential fixes.

2. **Pre-trained Hugging Face Model with Neural Machine Translation (NMT):** MicePy uses a pre-trained Hugging Face model based on NMT to translate Python error messages into Spanish. 

3. **Future-proofing with Custom Models:** MicePy allows users to integrate their custom models for error translation and explainability. This feature enables users to adapt to future improvements in natural language processing and machine learning.

4. **Different Ways to Run MicePy:** Users can run MicePy using the command palette or by enabling settings that check Python files whenever they are opened or saved in the editor.

5. **Local Dictionary for Offline Usage:** MicePy offers an optional local dictionary for translating errors without an internet connection.

## Requirements

MicePy requires an active internet connection for accessing the Hugging Face API and LLMs. However, offline usage is possible with the local dictionary feature.

## Installation

MicePy can be installed from the VS Code Marketplace. Alternatively, you can download the extension from our GitHub repository and install it manually.

## Extension Settings

After installation, MicePy adds the following settings to your VS Code environment:

1. `Micepy.runOnFileOpen`: Enable/disable running MicePy when a Python file is opened.
2. `Micepy.runOnFileSave`: Enable/disable running MicePy when a Python file is saved.
3. `Micepy.useLocalDictionary`: Enable/disable using the local dictionary for offline translations.
4. `Micepy.customTranslationModel`: Specify a custom translation model.
5. `Micepy.customExplainabilityModel`: Specify a custom explainability model.

## Known Issues

Please refer to the 'Issues' tab in our GitHub repository for known issues and ongoing developments.

## Release Notes

### 0.1.2

Initial release of MicePy.
Introduced the error explainability feature and added support for custom models.

### 0.1.6
# Updates to MicePy's Error Handling and API Key Configuration:
1. Enhanced VSCode Settings:
Added the capability for users to input OpenAI and Hugging Face API keys directly within the VSCode extension settings.
While this offers ease of use, it is less secure than environment variables. Users have been advised of this potential risk.
2. Improved API Key Retrieval:
The system first checks if the API keys are available in the VSCode settings.
If not provided within the settings, it falls back to retrieving from environment variables.
If the keys aren't found in either location, relevant error messages are displayed to guide users.
3. Better OpenAI Error Handling:
In cases where the OpenAI API fails to provide an explanation (possible reasons might be a malformed API key, connection issues, etc.), the error is now gracefully caught and managed.
The user is presented with an informative error message suggesting that there was an issue with fetching explanations from OpenAI and advising them to check their API key.
4. Efficient Error Processing in Python Execution:
When running a Python process, errors from stderr are now effectively captured, processed, and subsequently either explained using OpenAI's GPT or simply translated using Hugging Face, based on the user's settings.
If OpenAI's GPT fails to provide an explanation, the error is communicated back to the user instead of only presenting the translated error from Hugging Face.

**Enjoy!**
