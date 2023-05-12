# BicePy README

BicePy is a VSCode extension designed to make Python programming more accessible to non-native English speakers. It utilizes machine learning to translate Python error messages and provides descriptive explanations in Spanish. The extension leverages large language models for translation and error explainability, offering a low-cost, plug-and-play approach to language translation.

## Features

BicePy offers several unique features:

1. **Error Explainability with Large Language Models (LLMs):** BicePy integrates an LLM to provide detailed explanations for Python errors and suggest potential fixes.

2. **Pre-trained Hugging Face Model with Neural Machine Translation (NMT):** BicePy uses a pre-trained Hugging Face model based on NMT to translate Python error messages into Spanish. 

3. **Future-proofing with Custom Models:** BicePy allows users to integrate their custom models for error translation and explainability. This feature enables users to adapt to future improvements in natural language processing and machine learning.

4. **Different Ways to Run BicePy:** Users can run BicePy using the command palette or by enabling settings that check Python files whenever they are opened or saved in the editor.

5. **Local Dictionary for Offline Usage:** BicePy offers an optional local dictionary for translating errors without an internet connection.

## Requirements

BicePy requires an active internet connection for accessing the Hugging Face API and LLMs. However, offline usage is possible with the local dictionary feature.

## Installation

BicePy can be installed from the VS Code Marketplace. Alternatively, you can download the extension from our GitHub repository and install it manually.

https://marketplace.visualstudio.com/items?itemName=CaydenwilliamDunn.BicePy

## Extension Settings

After installation, BicePy adds the following settings to your VS Code environment:

1. `bicepy.runOnFileOpen`: Enable/disable running BicePy when a Python file is opened.
2. `bicepy.runOnFileSave`: Enable/disable running BicePy when a Python file is saved.
3. `bicepy.useLocalDictionary`: Enable/disable using the local dictionary for offline translations.
4. `bicepy.customTranslationModel`: Specify a custom translation model.
5. `bicepy.customExplainabilityModel`: Specify a custom explainability model.

## Known Issues

Please refer to the 'Issues' tab in our GitHub repository for known issues and ongoing developments.

## Release Notes

### 1.0.0

Initial release of BicePy.
Introduced the error explainability feature and added support for custom models.

**Enjoy!**