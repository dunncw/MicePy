# MicePy README

MicePy is a VSCode extension designed to make Python programming more accessible to non-native English speakers. It utilizes machine learning to translate Python error messages and provides descriptive explanations in Spanish. The extension leverages large language models for translation and error explainability, offering a low-cost, plug-and-play approach to language translation.

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

https://marketplace.visualstudio.com/items?itemName=CaydenwilliamDunn.MicePy

## Setup

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

### 1.0.0

Initial release of MicePy.
Introduced the error explainability feature and added support for custom models.

**Enjoy!**
