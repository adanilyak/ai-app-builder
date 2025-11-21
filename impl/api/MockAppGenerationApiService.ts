import uuid from 'react-native-uuid';
import { AppGenerationApiServiceInterface } from './AppGenerationApiService';
import { AppGenerationApiResponse } from './AppGenerationApiTypes';

export class MockAppGenerationApiService implements AppGenerationApiServiceInterface {
    async createConversation(): Promise<string> {
        return String(uuid.v4());
    }

    async generateApp(conversationId: string, description: string): Promise<AppGenerationApiResponse> {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Generated App</title>
    <style>
      body {
        margin: 0;
        padding: 20px;
        font-family: system-ui, -apple-system, sans-serif;
        background: #fafafa;
        color: #222;
      }

      .container {
        max-width: 500px;
        margin: 0 auto;
      }

      h1 {
        font-size: 22px;
        margin-bottom: 12px;
      }

      p {
        font-size: 15px;
        line-height: 1.4;
      }

      .file-box {
        background: #fff;
        padding: 14px;
        border-radius: 10px;
        border: 1px solid #ddd;
        margin-top: 16px;
        word-break: break-all;
        font-family: ui-monospace, Menlo, monospace;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Generated App Preview</h1>

      <p>
        This is a static mock HTML file. Below is the idea description of the file you have
        generated:
      </p>

      <div class="file-box">
        ${description}
      </div>
    </div>
  </body>
</html>
  `
        return [
            {
                kind: 'html',
                content: html
            },
            {
                kind: 'css',
                content: ""
            },
            {
                kind: 'js',
                content: ""
            }
        ];
    }
}