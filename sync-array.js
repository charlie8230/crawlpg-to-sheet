const fetch = require('node-fetch');

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



(async ()=> {
    try {
        for await (const it of getAllPages()) {
            console.log('awaited', it && it.status);
        }
    } catch (err) {
        console.log(err);
    }
})();