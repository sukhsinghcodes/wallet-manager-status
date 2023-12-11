import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('Starting Wallet Manager Status...');

  let output = '';

  try {
    const result = await axios.get('https://wallet-manager-1-a1922d7bed1d.herokuapp.com/health');
    console.log(result.data);

    if (!result.data.networks) {
      throw new Error('Networks not found. Something wrong with /health endpoint');
    }

    output += `Networks: \n`;
    Object.entries(result.data.networks).forEach(([name, network]) => {
      const n = network as { status: string };
      output += `${name}: ${(n.status as string) === 'OK' ? '✅' : '❌'}\n`;
    });
  } catch (error) {
    console.error(error);

    if ('message' in error) {
      output += `\n\n*Error*: ${error.message}\n`;
    } else {
      output += `\n\n*Error*: Unknown error\n`;
    }
  }

  // post output to tg bot
  axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    chat_id: process.env.CHAT_ID,
    text: output,
    parse_mode: 'Markdown',
  });
}

main();
