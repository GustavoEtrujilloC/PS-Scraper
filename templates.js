
async function openWebPage () {

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 500
    });
    const page = await browser.newPage();

    await page.goto('https://store.playstation.com/en-us/category/70e94b4f-a555-4b31-91fe-1bf4b8050464/1')

    await browser.close();

}

// openWebPage();

async function captureScreenshot () {

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 500
    });
    const page = await browser.newPage();

    await page.goto('https://store.playstation.com/en-us/category/70e94b4f-a555-4b31-91fe-1bf4b8050464/1')
    await page.screenshot({path: 'deals.png'})
    await browser.close();

}

// captureScreenshot () 

async function navigate () {

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 200
    });
    const page = await browser.newPage();

    await page.goto('https://store.playstation.com/en-us/category/70e94b4f-a555-4b31-91fe-1bf4b8050464/1')
    await page.click('button[aria-label="Page 2"]')

    await browser.close();

}

 // navigate()

 async function getData2 () {

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 200
    });
    const page = await browser.newPage();

    await page.goto('https://store.playstation.com/en-us/category/70e94b4f-a555-4b31-91fe-1bf4b8050464/1')
    const result = await page.evaluate(() => {
        const titleScrap = document.querySelectorAll('.psw-t-body psw-c-t-1 psw-t-truncate-2 psw-m-b-2');
        return titleScrap
        
        
        
    })
     console.log(result)
    

    await browser.close();
    
}
 

async function getData1 () {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 200
    });
    const page = await browser.newPage();

    await page.goto('https://store.playstation.com/en-us/category/70e94b4f-a555-4b31-91fe-1bf4b8050464/1');
   

    const result = await page.evaluate(() => {
        const titleElements = document.querySelectorAll('.psw-t-body');
        const titles = [];
        titleElements.forEach(titleElement => {
            titles.push(titleElement.innerText.trim());
        });
        return titles;
    });

    console.log(result);

    await browser.close();
}

//getData();

