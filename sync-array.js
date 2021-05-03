const fetch = require('node-fetch');
const { setupGoogle, runPuppeteer, writeToSheet } = require('./spreadsheet');
async function* getAllPages(){
    let arr = [0, 'https://google.com/','https://www.hgtv.com/'];
    console.log('Start');
    for (let r=0; r<arr.length; r++) {
        let url = arr[r];
        console.log('Inside the iterator', url);
        
        try {
            let getUrl = fetch(url);
            yield getUrl;
        } catch (err) {
            console.log(err);
            yield err;
        }
    }
}

setupGoogle();


(async ()=> {
    let {url, title, logo, desc, dplusurl, image, premdate} = await runPuppeteer();

    await writeToSheet([url, title, logo, desc, dplusurl, image, premdate])
    try {
        for await (const it of getAllPages()) {
            console.log('awaited', it && it.status);
        }
    } catch (err) {
        console.log(err);
    }
})();