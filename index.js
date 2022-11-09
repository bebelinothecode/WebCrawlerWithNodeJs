const axios = require('axios');
const cheerio = require('cheerio');
const reader = require('xlsx');

async function getPriceFeed() {
    try {
        const url = "https://coinmarketcap.com/";
        const data = await axios.get(url);
        const $ = cheerio.load(data.data);
        const keys = [
                        "rank",
                        "name",
                        "price",
                        "1hr",
                        "24hrs",
                        "7d",
                        "marketCap",
                        "volume",
                        "circulatingSupply",
                    ];
        const coinArray = [];
        const elemSelector = '#__next > div > div.main-content > div.sc-1a736df3-0.PimrZ.cmc-body-wrapper > div > div:nth-child(1) > div.sc-853bfcae-1.eibzVK > table > tbody > tr';
        $(elemSelector).each((parentIndex, parentElement)=>{
            let keyIndex = 0;
            const cionObj = {};
            if(parentIndex <= 9) {
                $(parentElement).children().each((childIndex, childElement)=>{
                    let tdValue = $(childElement).text();

                    if(keyIndex === 1 || keyIndex === 6) {
                        tdValue = $('p:first-child',$(childElement).html()).text();
                    }



                    if(tdValue) {
                        cionObj[keys[keyIndex]] = tdValue;
                        keyIndex++;
                    }
                });
                // console.log(cionObj);
                coinArray.push(cionObj);
            }
        });
        const ws = reader.utils.json_to_sheet(coinArray);

        const wb = reader.utils.book_new();

        reader.utils.book_append_sheet(wb,ws,"Bebelino");

        reader.writeFile(wb,'test.xlsx');

        if(reader.writeFile(file,'./test.xlsx')) {
            console.log('done!!!!!');
        }

    //     console.log(coinArray);
    // //     var options = {
    // //         delimiter:',',
    // //         wrap:false,
    // //         arrayDenote:' '
    // //     }
    // //    console.log(csvjson.toCSV(coinArray,options));
    } catch (error) {
        console.error(error.message);
        
    }
}

getPriceFeed();


