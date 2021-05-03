const puppeteer = require('puppeteer');
const { GoogleSpreadsheet } = require('google-spreadsheet');
var cfg = require('./app-cfg.json');
const doc = new GoogleSpreadsheet(cfg.sheet);
var {client_email, private_key} = require('./client-secret.json');

async function runPuppeteer(url, index) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.discovery.core-qa.sni.hgtv.com/shows/francesco', {
      waitUntil: 'load'
  });
  const frame = page.mainFrame();

  function current(el){
    var txt =el.querySelector('h1').textContent; 
    title = txt;
    var txt2 = el.querySelector('.o-ShowLead__a-Description').textContent;
    desc = txt2;
    // var pos = el.getBoundingClientRect();
    return {title: title && title.trim()||'', logo:'', dplusurl:'', image:'', premdate: '', desc: (desc && desc.trim())||''};
  }
  let {title, desc} = await frame.$eval('.showLead', current);

  await page.screenshot({ path: `./screenshots/${index}-pg.png` });

  await browser.close();
  return {url, title, logo, desc, dplusurl, image, premdate};
};




async function setupGoogle(data) {
  console.log('Setting Up google');
  await doc.useServiceAccountAuth({
    client_email,
    private_key
  });
}

async function writeToSheet(data) {
// console.log(cfg, client_email);


await doc.loadInfo(); // loads document properties and worksheets
// console.log(doc.title);
// await doc.updateProperties({ title: 'renamed doc' });

  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  if (!data) {
    console.error('no data, is it empty?');
    return;
  }
  await sheet.addRow(data);
  console.log(sheet.title);
};

module.exports = { setupGoogle, runPuppeteer, writeToSheet };