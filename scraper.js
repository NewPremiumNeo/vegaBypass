import fetch from 'node-fetch';
import cheerio from 'cheerio';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
};

async function fetchAndProcess(url) {
  try {
    const response = await fetch(url, { headers });
    const html = await response.text();
    const $ = cheerio.load(html);

    const vcloudLinks = $('a[href^="https://vcloud.lol/"]').map((index, link) => $(link).attr('href')).get();
    let finalUrls = []
    for (const [index, vcloudLink] of vcloudLinks.entries()) {
      try {
        const response = await fetch(vcloudLink, { headers });
        const html = await response.text();
        const $ = cheerio.load(html);
        const scriptTags = $('script[type="text/javascript"]');

        if (scriptTags.length > 1) {
          const scriptContent = scriptTags.last().html();
          if (scriptContent) {
            const urlStart = 'https://vcloud.lol/go.php?id=';
            const startIndex = scriptContent.indexOf(urlStart);
            if (startIndex !== -1) {
              const endIndex = scriptContent.indexOf("'", startIndex);
              if (endIndex !== -1) {
                const extractedUrl = scriptContent.substring(startIndex + urlStart.length, endIndex);
                const finalUrl = `${vcloudLink}?token=${extractedUrl}`;
                const data = {
                  name: vcloudLinks.length > 1 ? `Episode ${index + 1}` : `Download Link`,
                  finalUrl: finalUrl
                }
                console.log(`${vcloudLinks.length > 1 ? `Episode ${index + 1}` : `Download Link`}:- ${finalUrl}`);
                finalUrls.push(data)
              } else {
                console.log("End of URL not found.");
              }
            } else {
              console.log("URL not found in script content.");
            }
          } else {
            console.log("No script content found in the second script tag.");
          }
        } else {
          console.log("Second script tag not found.");
        }
      } catch (error) {
        console.error('Error fetching inner page:', error.message);
      }
    }
    return finalUrls;
  } catch (error) {
    console.error('Error fetching main page:', error.message);
  }
}

export { fetchAndProcess };
