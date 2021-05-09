const fetch = require('node-fetch');
const { setupGoogle, runPuppeteer, writeToSheet } = require('./spreadsheet');
async function* getAllPages(){
    let arr = ['https://www.discovery.com/shows/street-outlaws', 'https://www.discovery.com/shows/gold-rush','https://www.discovery.com/shows/expedition-unknown'];
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
    let {index, url, title, logo, desc, dplusurl, image, premdate} = await runPuppeteer();

    await writeToSheet([index, url, title, logo, desc, dplusurl, image, premdate])
    try {
        for await (const it of getAllPages()) {
            console.log('awaited', it && it.status);
        }
    } catch (err) {
        console.log(err);
    }
})();