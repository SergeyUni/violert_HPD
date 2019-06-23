const puppeteer = require('puppeteer');

getApplicationPage = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
                headless: false
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
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = getApplicationPage;