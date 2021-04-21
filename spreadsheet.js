const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.discovery.stl-00.sni.hgtv.com/shows/francesco', {
      waitUntil: 'load'
  });
  const frame = page.mainFrame();

  function current(el){
    var txt =el.querySelector('h1').textContent; 
    searchValue = txt;
    var txt2 = el.querySelector('.o-ShowLead__a-Description').textContent;
    descValue = txt2;
    // var pos = el.getBoundingClientRect();
    return {searchValue, descValue}
  }
  let {pos, searchValue, descValue} = await frame.$eval('.showLead', current);
  console.log(descValue, pos);
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();



const { GoogleSpreadsheet } = require('google-spreadsheet');
var cfg = require('./app-cfg.json');
const doc = new GoogleSpreadsheet(cfg.sheet);
var {client_email, private_key} = require('./client-secret.json');
(async function() {
await doc.useServiceAccountAuth({
    client_email,
    private_key
  });

// console.log(cfg, client_email);


await doc.loadInfo(); // loads document properties and worksheets
console.log(doc.title);
await doc.updateProperties({ title: 'renamed doc' });

const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
console.log(sheet.title);
}());