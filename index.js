const assistente = require("slackbots");
const { Configuration, OpenAIApi } = require("openai");

//OPENAI
const configuration = new Configuration({
  apiKey: `{Inserir token da api openai}`,
});

const openai = new OpenAIApi(configuration);

//SLACK
const bot = new assistente({
  token: `{Inserir token do slack (https://{seuworkspace}.slack.com/apps/new/A0F7YS25R-bots) }`,
  name: `assistente`
});

bot.on('message', async (data) => {
  if (data.type === 'reaction_added' && data.reaction === 'white_check_mark') {
    bot.postMessageToChannel(
      'assistente',
      'Resposta aprovada.. Em breve será publica no post da Casa do Desenvolvedor',
      {
        reply_broadcast:false,
        thread_ts: data.item.ts
      }
    );
    return;
  }

  if (data.type !== 'message' || data.subtype === 'message_replied' || data.subtype === 'message_deleted' || data.subtype === 'bot_message') {
    return;
  }

  try {
    console.log('Iniciando comunicação com OpenAI...');
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: data.text,
      temperature: 0.5,
      max_tokens: 1000,
    });

    console.log('Enviando resposta no slack...');
    bot.postMessageToChannel(
      'assistente',
      completion.data.choices[0].text,
      {
        reply_broadcast:false,
        thread_ts:data.ts
      }
    );
  } catch (error) {
    console.error(error);
  }
})

bot.on('start', () => {
  console.log('Aguardando interação')
})

bot.on('error', (err) => {
  console.log('error: ', err);
})
