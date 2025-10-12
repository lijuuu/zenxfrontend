export interface CodeAnalysis {
  complexity: {
    timeComplexity: string;
    spaceComplexity: string;
    overallComplexity: 'Low' | 'Medium' | 'High';
    explanation: string;
  };
  issues: {
    type: 'error' | 'warning' | 'suggestion';
    message: string;
    line?: number;
    suggestion?: string;
  }[];
  improvements: {
    description: string;
    code?: string;
    impact: 'Low' | 'Medium' | 'High';
  }[];
  summary: string;
}


export interface ChatResponse {
  message: string;
  analysis?: CodeAnalysis;
  hasCodeBlocks: boolean;
  shouldReplaceCode?: boolean;
}

class GeminiService {
  private apiKey = 'AIzaSyCNn8STgpbY2yyxKzH76vZXevxBaXnml6Y';
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  async analyzeCode(code: string, language: string, output?: string[], error?: string): Promise<CodeAnalysis> {
    const prompt = `As a senior software engineer, analyze this ${language} code and provide a comprehensive analysis in the following JSON format. Focus only on the current coding problem and implementation.

IMPORTANT: Only provide analysis related to the current coding problem. Do not discuss topics outside of programming, debugging, or code optimization.

\`\`\`${language}
${code}
\`\`\`

${output && output.length > 0 ? `Complete execution output (raw):
${output.join('\n')}` : ''}

${error ? `Additional error context: ${error}` : ''}

Please provide your analysis in this exact JSON structure:
{
  "complexity": {
    "timeComplexity": "O(n) or similar notation",
    "spaceComplexity": "O(n) or similar notation", 
    "overallComplexity": "Low|Medium|High",
    "explanation": "Brief explanation of complexity analysis"
  },
  "issues": [
    {
      "type": "error|warning|suggestion",
      "message": "Description of the issue",
      "line": 5,
      "suggestion": "How to fix it"
    }
  ],
  "improvements": [
    {
      "description": "What can be improved",
      "code": "Optional improved code snippet",
      "impact": "Low|Medium|High"
    }
  ],
  "summary": "Overall assessment and recommendations"
}

Focus on:
1. Time and space complexity analysis
2. Code quality issues and bugs
3. Performance optimizations
4. Logic errors and runtime issues
5. Specific fixes for any errors

Avoid suggesting:
- JSDoc comments or documentation improvements
- Code style formatting changes
- Variable naming suggestions
- General code organization

Return only valid JSON, no additional text.`;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': this.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4000,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('No response from Gemini API');
      }

      //extract json from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const analysis = JSON.parse(jsonMatch[0]);
      return analysis;
    } catch (error) {
      console.error('Error analyzing code:', error);
      throw error;
    }
  }

  async chatWithAI(message: string, context?: { code?: string; language?: string; output?: string[]; conversationHistory?: string[]; executionResult?: any }): Promise<ChatResponse> {
    let prompt = `As a coding assistant, help the user with their programming question. Be concise, helpful, and provide practical solutions.

IMPORTANT: Only respond to questions that are directly related to the current coding problem, code implementation, debugging, or programming concepts. Do NOT answer questions about:
- General knowledge outside programming
- Personal questions
- Other topics unrelated to coding
- Questions about other problems or projects

If the user asks something outside the coding context, politely redirect them back to the current problem.

User message: ${message}`;

    //add conversation history if available
    if (context?.conversationHistory && context.conversationHistory.length > 0) {
      prompt += `\n\nPrevious conversation context:
${context.conversationHistory.join('\n')}`;
    }

    if (context?.code && context?.language) {
      prompt += `\n\nCurrent ${context.language} code:
\`\`\`${context.language}
${context.code}
\`\`\``;

      if (context.output && context.output.length > 0) {
        prompt += `\n\nComplete execution output (raw):
${context.output.join('\n')}`;
      }

      //add execution result information if available
      if (context.executionResult) {
        prompt += `\n\nExecution Result Summary:
- Overall Pass: ${context.executionResult.overallPass ? 'Yes' : 'No'}
- Total Test Cases: ${context.executionResult.totalTestCases}
- Passed Test Cases: ${context.executionResult.passedTestCases}
- Failed Test Cases: ${context.executionResult.failedTestCases}`;

        if (context.executionResult.failedTestCase) {
          const failed = context.executionResult.failedTestCase;
          prompt += `\n\nFailed Test Case Details:
- Test Case Index: ${failed.testCaseIndex}
- Input: ${failed.input}
- Expected: ${failed.expected}
- Received: ${failed.received}
- Error: ${failed.error}`;
        }
      }
    }

    prompt += `\n\nProvide a helpful response based on the user's latest message and the context provided. If you include code, use proper markdown formatting with language tags.

IMPORTANT: Only suggest code replacement if:
1. The current code has errors or fails test cases
2. The user explicitly asks for code fixes or improvements
3. The code has significant issues that prevent it from working correctly

Do NOT suggest code replacement if:
1. The code is working correctly and passes all test cases
2. The user is just asking questions about the code
3. The code only has minor style issues or optimizations that don't affect functionality

CRITICAL: When providing code replacement, ALWAYS provide the COMPLETE code solution, not partial code snippets or fragments. Include the entire working solution from start to finish.

At the end of your response, add a line with: "SHOULD_REPLACE_CODE: true" or "SHOULD_REPLACE_CODE: false" based on whether code replacement is needed.`;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': this.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('No response from Gemini API');
      }

      //parse shouldReplaceCode from response
      const shouldReplaceMatch = text.match(/SHOULD_REPLACE_CODE:\s*(true|false)/i);
      const shouldReplaceCode = shouldReplaceMatch ? shouldReplaceMatch[1].toLowerCase() === 'true' : false;

      //remove the shouldReplaceCode line from the message
      const cleanMessage = text.replace(/\nSHOULD_REPLACE_CODE:\s*(true|false)/i, '').trim();

      return {
        message: cleanMessage,
        hasCodeBlocks: cleanMessage.includes('```'),
        shouldReplaceCode,
      };
    } catch (error) {
      console.error('Error chatting with AI:', error);
      throw error;
    }
  }

  async getPredefinedAnalysis(code: string, language: string, output: string[]): Promise<ChatResponse> {
    const hasError = output.some(line => line.startsWith('[Error]'));
    const errorContext = output.filter(line => line.startsWith('[Error]')).join('\n');

    const prompt = `As a coding assistant, analyze this ${language} code execution and provide insights. Focus only on the current problem and code implementation.

IMPORTANT: Only provide analysis related to the current coding problem. Do not discuss topics outside of programming, debugging, or code optimization.

Analyze this ${language} code execution and provide insights:

\`\`\`${language}
${code}
\`\`\`

Execution Output:
${output.join('\n')}

${hasError ? `Error Details: ${errorContext}` : ''}

Please provide:
1. **Error Analysis** (if any errors): What went wrong and why
2. **Performance Analysis**: Time/space complexity and efficiency
3. **Code Quality**: Best practices, readability, maintainability
4. **Suggestions**: Specific improvements and optimizations
5. **Alternative Approaches**: Different ways to solve the problem

Format your response with clear sections and use markdown for code blocks.`;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': this.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 3000,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('No response from Gemini API');
      }

      return {
        message: text,
        hasCodeBlocks: text.includes('```'),
      };
    } catch (error) {
      console.error('Error getting predefined analysis:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
