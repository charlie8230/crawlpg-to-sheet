const fetch = require('node-fetch');
const { setupGoogle, runPuppeteer, writeToSheet } = require('./spreadsheet');
async function* getAllPages(){
    let arr = ['https://www.discovery.stl-08.sni.hgtv.com/shows/street-outlaws', 'https://www.discovery.stl-08.sni.hgtv.com/shows/gold-rush','https://www.discovery.stl-08.sni.hgtv.com/shows/expedition-unknown'];
    
    for (let r=0; r<arr.length; r++) {
        let url = arr[r];
        console.log('Inside the iterator', url);
        try {
            console.log('Gonna run now', url, r)
            let info = await runPuppeteer(url, r);
            console.log('info::', info);
            yield info;
        } catch (err) {
            console.log(err);
            yield err;
        }
    }
}

setupGoogle();


(async ()=> {
    

    
    try {
        for await (const it of getAllPages()) {
            let {index, url, title, logo, desc, dplusurl, image, seasons, premdate, screenshot} = it;
            await writeToSheet([index, url, title, logo, desc, seasons, dplusurl, image, premdate, screenshot])
            console.log('awaited', it);
        }
    } catch (err) {
        console.log(err);
    }
})();