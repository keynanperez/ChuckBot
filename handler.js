const rp = require('request-promise');
const axios = require('axios');
const cheerio = require('cheerio');
const TELEGRAM_TOKEN = '5540799473:AAE-UxrqATTfBQsLL0OPv6JQjZuNDQXsxcs';


async function sendToUser(chat_id, text) {
  const options = {
    method: 'GET',
    uri: `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
    qs: {
      chat_id,
      text
    }
  };
  return rp(options);
}


async function getJoke(input) {
  const response = await axios('https://parade.com/968666/parade/chuck-norris-jokes/'); 
  const index = parseInt(input)
  const html = response.data
  const $ = cheerio.load(html)
  const arr = []
  let result = undefined; 
  $('.body', html).each(function () { 
    $('.body ol li').each(function (i, elm) {
      arr.push($(elm).text()) 
    });
    result = index + '. ' + arr[index - 1]
  })
  return result;
}


module.exports.chukbot = async event => {
  const body = JSON.parse(event.body);
  const { chat, text } = body.message;
  if (IsNumber(text)) {
    let message = '';
      await sendToUser(chat.id, `You asked for number ${text}`);
      await sendToUser(chat.id, `Please wait...`);
        message = await getJoke(text,chat);
    await sendToUser(chat.id, message);
  } 
  else {
    await sendToUser(chat.id, 'Input must be a number between 1 - 101');
  }
  return { statusCode: 200 };
};

function IsNumber(num){
  try{
    const newNum=parseInt(num)
    if((newNum<=101)&&(newNum>=1)){
      return true
    }
    
  }
  catch{
    return false
  }
}