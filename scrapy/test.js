const puppeteer = require('puppeteer');
var browser;
getApplicationPage = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();

            await page.goto('https://scrapethissite.com/pages/forms/');
            await page.type('#q', query);
          
            await page.click('input[type=submit]');
            await page.waitForSelector('.pagination');

            const teams = await page.$$eval('table tr.team', trs => {
                return trs.map(tr => {
                    const dataNodeList = tr.querySelectorAll('td');
                    const dataArray = Array.from(dataNodeList);
                   
                    const [name, year, wins, losses, otLosses, winPCT, gf, ga, diff] = dataArray.map(td => td.textContent.trim());
                    

                    return {
                        name, year, wins, losses, otLosses, winPCT, gf, ga, diff
                    }
                })
            })
            resolve(teams);
            browser.close()
        } catch (error) {
            reject(error);
        }
        
    })
}

module.exports = getApplicationPage;