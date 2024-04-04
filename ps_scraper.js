import puppeteer from "puppeteer";
import fs from "fs/promises"
import ExcelJS from "exceljs";

async function getData(totalPages) {
    const browser = await puppeteer.launch({
        headless: true, //Browser on / off
        slowMo: 0
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
                await new Promise(resolve => setTimeout(resolve, 700)) // Milliseconds
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

            //Save to a new json file
    
            await fs.writeFile('gamesAct.json', JSON.stringify(allGamesData, null, 2))

            //Save to a new excel file.

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Games');
        
            // Headers
            worksheet.addRow(['Título', 'Precio', 'Precio Original', 'Imagen', 'Plataforma']);
        
            // Data
            allGamesData.forEach((game) => {
                worksheet.addRow([game.Titulo, game.Precio, game.PrecioOriginal, game.Imagen, game.Plataforma]);
            });
        
            // Save book
            const filePath = 'GamesData.xlsx';
            await workbook.xlsx.writeFile(filePath);
            console.log(`Game saved to: ${filePath}`);

            }
        }
    
    await browser.close();
    
    console.log('DONE!')

}

// Pages
const totalPages = 12;
getData(totalPages);

