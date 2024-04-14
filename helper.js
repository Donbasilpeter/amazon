
import puppeteer from 'puppeteer';
import playSound from 'play-sound';
import fs from 'fs';

async function refreshBrowser(userDataDir,targetUrl,searchText) {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        userDataDir
      });
  
      const page = await browser.newPage();
      const outputStream = fs.createWriteStream('output.txt', { flags: 'a' });
      await page.goto(targetUrl);
  
      while (1) {

        let reloadedPage = await reloadPage(page)
        let jobs = await jobFound(reloadedPage,searchText)
        if (jobs) {
  
          const outputString = `Job Found: ${new Date().toLocaleString()}\n`;
          console.log(outputString);
          outputStream.write(outputString);
          playSound().play('./alert.mp3');
          refreshBrowser(userDataDir,targetUrl,searchText)
          break;
        }
        else {
          const outputString = `No job found ${new Date().toLocaleString()}\n`;
          console.log(outputString);
          outputStream.write(outputString);
        }
  
      }
  
      process.on('SIGINT', () => {
        outputStream.end();
        process.exit();
      });
  
    } catch (error) {
      console.error('Error:', error);
      refreshBrowser(userDataDir,targetUrl,searchText)
    }
  }


  let reloadPage = async (page) => {
    await page.reload();
  
    // expand the search accordion
    await page.evaluate(() => {
      let search = document.getElementsByClassName('accordion-toggle collapsed');
      search[0].click();
    });
  
    // set target values
    await page.evaluate(() => {
      let country = document.getElementById('j_id0:portId:j_id67:Country');
      let state = document.getElementById('j_id0:portId:j_id67:State');
      country.value = 'CA';
      state.value = 'ON';
    });
  
    // submit
    await page.evaluate(() => {
      let submit = document.getElementById('j_id0:portId:j_id67:filter-jobs');
      submit.click();
    });
  
    // wait for redirection
    await page.waitForNavigation();
    return page
  
  }

  let jobFound = async (page, searchText) => {
    return await page.evaluate((searchText) => {
        // Loop through each search text in the array
        for (const eachText of searchText) {
            // Find all elements that contain the current search text
            const elements = Array.from(document.querySelectorAll('*')).filter(element => element.textContent.includes(eachText));

            // If any element is found with the current search text, return true
            if (elements.length > 0) return true;
        }
        // If none of the search texts are found, return false
        return false;
    }, searchText);
}



  export default refreshBrowser