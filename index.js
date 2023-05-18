require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const tableId = process.env.TABLE_ID;
const TableKey = process.env.TABLE_KEY;
const TableEmail = process.env.TABLE_EMAIL;
const tgToken = process.env.KEY_API;

const tt = [
  'Redfield A',
  'Саша',
  'Vi2@liT',
  'Kostya Kondratiuk',
  'Даня Онищенко',
];

const team = [
  process.env.s1.toLowerCase(),
  process.env.s2.toLowerCase(),
  process.env.s3.toLowerCase(),
  process.env.s4.toLowerCase(),
  process.env.s5.toLowerCase(),
];
const tteam = [
  process.env.s1,
  process.env.s2,
  process.env.s3,
  process.env.s4,
  process.env.s5,
];

const GAMER = 'sandbox_may_festival\n↓ Геймер';
const NICK = 'sandbox\n↓ nickname';

const bot = new TelegramBot(tgToken, { polling: true });
const doc = new GoogleSpreadsheet(tableId);

(async () => {
  await doc.useServiceAccountAuth({
    client_email: TableEmail,
    private_key: TableKey.replace(/\\n/g, '\n'),
  });

  bot.on('message', async msg => {
    const username = msg.from.username;

    if (!team.includes(username.toLowerCase())) {
      return;
    }

    console.log(username);

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const raws = await sheet.getRows();

    const users = raws.reduce((acc, el) => {
      const gamer = el[GAMER];
      // _rawData[7]
      if (team.includes(gamer)) {
        const curScore = el._rawData[7] === 200 + '' ? 1 : 0;

        return { ...acc, [gamer]: (acc[gamer] || 0) + curScore };
      } else {
        return { ...acc };
      }
    }, {});
    // -1001595776037
    // const m = team.map((el, idx) => `${tt[idx]} : ${users[el]}\n`);
    const m = team.map((el, idx) => `${tteam[idx]} : ${users[el]}\n`);
    await bot.sendMessage(
      '527306644',
      ` @${m[0]} \n @${m[1]} \n @${m[2]} \n @${m[3]} \n @${
        m[4]
      } \n TOTAL: ${team.reduce((acc, el) => acc + users[el], 0)}`
    );
  });
})();
