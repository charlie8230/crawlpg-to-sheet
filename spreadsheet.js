const puppeteer = require('puppeteer');
const { GoogleSpreadsheet } = require('google-spreadsheet');
var cfg = require('./app-cfg.json');
const doc = new GoogleSpreadsheet(cfg.sheet);
var {client_email, private_key} = require('./client-secret.json');

async function runPuppeteer(url, index) {
  console.log('inside', url, index);
  if (!(url && typeof index != 'undefined')) return;
  console.log('Puppeteer');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
      waitUntil: 'load'
  });
  const frame = page.mainFrame();

  function current(el){
    var txt =el.querySelector('h1').textContent; 
    title = txt;
    var txt2 = el.querySelector('.o-ShowLead__a-Description').textContent;
    desc = txt2;

    return {title: title && title.trim()||'', logo:'', dplusurl:'', image:'', premdate: '', desc: (desc && desc.trim())||''};
  }
  let results = await frame.$eval('.showLead', current);

  await page.screenshot({ path: `./screenshots/${index}-pg.png` });
  console.log('Running puppeteer');
  await browser.close();
  return results;
};




async function setupGoogle(data) {
  console.log('Setting Up google');
  await doc.useServiceAccountAuth({
    client_email,
    private_key
  });
}

async function writeToSheet(data) {

  await doc.loadInfo(); // loads document properties and worksheets

  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  if (!data) {
    console.error('no data, is it empty?');
    return;
  }
  await sheet.addRow(data);
  console.log(sheet.title);
};

module.exports = { setupGoogle, runPuppeteer, writeToSheet };