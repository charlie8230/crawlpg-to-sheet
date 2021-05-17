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
  await page.setViewport({
    width: 1366,
    height: 768,
    deviceScaleFactor: 1,
  });
  await page.goto(url, {
      waitUntil: 'load'
  });
  const frame = page.mainFrame();



  function current(el){
    function getBGS(str = ''){
      var regex = /(?<=\(\')(.*?)(?=\'\))/;
      var search = regex.exec(str);
  
      return search && search.length>0 && search[0];
    }
  
    function $get(el, selector){
      return el.querySelector(selector)
    }
    var txt = $get(el, 'h1'); 
    title = txt && txt.textContent;
    // description
    var $desc =  $get(el, '.o-EntertainmentLead__a-Description');
    var txt2 = $desc && $desc.textContent;
    desc = txt2 || '';
    // Season
    var $season=  $get(el, '.o-EntertainmentLead__a-SeasonLabel');
    var seasonTxt = $season.textContent;
    // $d plus url
    var $dplusurl = $get(el, '.o-EntertainmentLead__m-WatchWrap a');
    var dplusURL = $dplusurl && $dplusurl.getAttribute('href');
    // bg image
    var $imgBg = $get(el, '.o-EntertainmentLead__m-Body--imageBackground');
    var bgStyles = $imgBg && $imgBg.getAttribute('style');
    var bgParse = bgStyles && getBGS(bgStyles);
    // logo
    var $logoImg = $get(el, '.o-EntertainmentLead__a-Logo');
    var logoUrl = $logoImg && $logoImg.getAttribute('src');

    return {title: title && title.trim()||'', logo:logoUrl, dplusurl:dplusURL, image:bgParse, premdate: '', seasons: seasonTxt, desc: (desc && desc.trim())||''};
  }
  let results = await frame.$eval('.showLead', current);
  results.index = index;
  results.url = url;
  
  await page.screenshot({ path: `./screenshots/${index}-pg.png` });
  results.screenshot = `screenshots/${index}-page.png`
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