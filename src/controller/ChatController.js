
import axios from 'axios';
export class ChatController {
  static async getResponse(prompt) {
     try {
      const response = await  axios.post(
        'https://api.openai.com/v1/chat/completions',

        // '{\n    "model": "gpt-3.5-turbo",\n    "messages": [{"role": "user", "content": "Hello!"}]\n  }',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `${prompt}`
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env['REACT_APP_OPENAI_API_KEY']
          }
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(error);
      return error;
    }
    
  }
}



