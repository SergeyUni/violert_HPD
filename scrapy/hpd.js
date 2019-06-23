const puppeteer = require('puppeteer');
var browser;
getApplicationPage = (houseNum, street, boro) => {
    return new Promise(async (resolve, reject) => {
        try {
            browser = await puppeteer.launch({
                headless: false
            });
            const page = await browser.newPage();
            
            await page.goto('https://hpdonline.hpdnyc.org/hpdonline/provide_address.aspx');
           
            await page.type('#txtHouseNo', houseNum);
            await page.type('#txtStreet', street);
           
            await page.select('#ddlboro', boro.toString());
            await Promise.all([
                page.waitForNavigation(),
                page.click('#btnSearch')
            ]);
            resolve({status: true, page: page});
        } catch (error) {            
            resolve({status:false});
        }
    })
}

getOwnerInfo = (page) => {
    return new Promise(async (resolve, reject) => {

        try {
            var owner = await page.$$eval('#dgRegistration tr', trs => {
            return trs.map((tr, index) => {
                if(index != 0) {
                    const dataNodeList = tr.querySelectorAll('td');
                    const dataArray = Array.from(dataNodeList);
                    return {
                        owner: dataArray[0].querySelector('span').textContent.trim(),
                        lastReg: dataArray[1].querySelectorAll('span')[0].textContent.trim(),
                        regExpire: dataArray[1].querySelectorAll('span')[1].textContent.trim(),
                        organization: dataArray[2].textContent.trim(),
                        lastName: dataArray[3].textContent.trim(),
                        firstName: dataArray[4].textContent.trim(),
                        houseNo: dataArray[5].textContent.trim(),
                        streetName: dataArray[6].textContent.trim(),
                        apt: dataArray[7].textContent.trim(),
                        city: dataArray[8].textContent.trim(),
                        status: dataArray[9].textContent.trim(),
                        zip: dataArray[10].textContent.trim()
                    }
                }
                })
            })
            
            resolve({status: true, data: owner});
        } catch (error) {            
            resolve({status:true, data: []})
        }
    })
}

getViolations = (page) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Promise.all([
                page.waitForNavigation(),
                page.click('#lbtnAllOpenViol')
            ]);
        }                
        catch(error) {
            resolve({status: false})
        }
        try {
            var violations = await page.$$eval('#dgViolations tr', trs => {
                return trs.map((tr, index) => {
                    if(index != 0) {
                        const dataNodeList = tr.querySelectorAll('td');
                        const dataArray = Array.from(dataNodeList);
                        return {
                            apt: dataArray[0].querySelectorAll('span')[0].textContent.trim(),
                            story: dataArray[0].querySelectorAll('span')[1].textContent.trim(),                            
                            reportedDate: dataArray[1].querySelectorAll('span')[0].textContent.trim(),
                            novIssuedDate: dataArray[1].querySelectorAll('span')[1].textContent.trim(),
                            hzrdClass: dataArray[2].textContent.trim(),
                            // orderNo: dataArray[3].textContent.trim(),
                            // violationId: dataArray[4].querySelectorAll('span')[0].textContent.trim(),
                            // novId: dataArray[4].querySelectorAll('span')[1].textContent.trim(),
                            // novType: dataArray[4].querySelectorAll('span')[2].textContent.trim(),
                            // violationDescription: dataArray[5].textContent.trim(),
                            // status: dataArray[6].querySelectorAll('span')[0].textContent.trim(),     
                            // statusDate: dataArray[6].querySelectorAll('span')[1].textContent.trim(),                       
                            // certifyByDate: dataArray[5].querySelectorAll('span')[0].textContent.trim(),
                            // actualCertDate: dataArray[5].querySelectorAll('span')[1].textContent.trim(),
                           
                        }
                    }
                })
            })
            resolve({status: true, data: violations})
        } catch (error) {           
            resolve({status: true, data: []})
        }
    })
}

startScraping = (houseNum, street, boro) => {
    return new Promise(async (resolve, reject) => {
        
        const pageContext = await getApplicationPage(houseNum, street, boro)
       
        if(!pageContext.status) {
            reject({status: false})
            browser.close();
        }
        const page1 = pageContext.page;
        const violations = await getViolations(page1);
        if(!violations.status) {
            reject({status: false})
            browser.close();
        }
       
        const owner = await getOwnerInfo(page1);
        browser.close()
        resolve({violations, owner, status: true});    
    })
}


module.exports = startScraping;

// var page2 = getApplicationPage('600', 'Madison Avenue', 1);