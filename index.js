import puppeteer from "puppeteer";
import fs from "fs/promises"
import ExcelJS from "exceljs";


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


async function getData(totalPages) {
    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 200
    });
    const page = await browser.newPage();

    const baseUrl = 'https://store.playstation.com/en-us/category/70e94b4f-a555-4b31-91fe-1bf4b8050464/';
    const allGamesData = [];

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        await page.goto(`${baseUrl}${currentPage}`);

        const gameLinks = await page.evaluate(() => {
            const links = [];
            const container = document.querySelector('ul.psw-grid-list');
            const gameElements = container.querySelectorAll('a.psw-link');
            gameElements.forEach(gameElement => {
                links.push(gameElement.href);
            });
            return links;
        });

        console.log(`Links to games on page ${currentPage}:`);
        console.log(gameLinks);

        for (const link of gameLinks) {
            await page.goto(link);

            const gamesData = await page.evaluate(async () => {
                await new Promise(resolve => setTimeout(resolve, 700))
                const title = document.querySelector('h1.psw-m-b-5').innerText
                const price = document.querySelector('span.psw-t-title-m').innerText
                const originalPrice = document.querySelector('span[data-qa="mfeCtaMain#offer0#originalPrice"]').innerText
                const image = document.querySelector('img.psw-fade-in').getAttribute('src')
                const plataform = document.querySelector('dd[data-qa="gameInfo#releaseInformation#platform-value"]').innerText
                const release = document.querySelector('dd[data-qa="gameInfo#releaseInformation#releaseDate-value"]').innerText
                const publisher = document.querySelector('dd[data-qa="gameInfo#releaseInformation#publisher-value"]').innerText
                const genres = document.querySelector('dd[data-qa="gameInfo#releaseInformation#genre-value"]').innerText 

                 return {
                    Titulo: title,
                    Precio: price,
                    PrecioOriginal: originalPrice,
                    Imagen: image,
                    Plataforma: plataform,
                    FechaSalida: release,
                    Publisher: publisher,
                    Genero: genres 
                } 

            });
            console.log(gamesData)
            
            allGamesData.push(gamesData)
    
            await fs.writeFile('gamesAct.json', JSON.stringify(allGamesData, null, 2))

            

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Datos');
        
            // Agregar encabezados
            worksheet.addRow(['Título', 'Precio', 'Precio Original', 'Imagen', 'Plataforma']);
        
            // Agregar datos al archivo Excel
            allGamesData.forEach((game) => {
                worksheet.addRow([game.Titulo, game.Precio, game.PrecioOriginal, game.Imagen, game.Plataforma]);
            });
        
            // Guardar el libro de Excel
            const filePath = 'datos_juegos.xlsx';
            await workbook.xlsx.writeFile(filePath);
            console.log(`Juego agregado al archivo: ${filePath}`);

            }
        }
    
    await browser.close();
    
    console.log('DONE!')

}

// Llamada a la función con el número total de páginas
const totalPages = 1;
getData(totalPages);

