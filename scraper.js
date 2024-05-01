import fetch from 'node-fetch';
import cheerio from 'cheerio';

const headers1 = {
  "Host": "unilinks.lol",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  "Alt-Used": "unilinks.lol",
  "Connection": "keep-alive",
  "Cookie": "cf_clearance=BWxtDng0VE602ro0FVWXRkfvURN3x.n1fbPHp8B5QI4-1714493209-1.0.1.1-FXwj7C2Dmv3CmV.WSEieC8fAdR6AN3mzuaZq6R2D.bWXg5LEDgNS_U0tT_C0t4bElercQQI.5HAU1a3czY_mCA",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Via": "1.1 8.201.15.178",
  "X-Forwarded-For": "8.201.15.178",
  "TE": "trailers"
};

const headers2 = {
  "Host": "vcloud.lol",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Via": "1.1 8.201.15.178",
  "X-Forwarded-For": "8.201.15.178",
  "Connection": "keep-alive",
  "Alt-Used": "vcloud.lol",
  "Cookie": "cf_clearance=pG5tRNHzQmz074jdJXO664wcv7beDvECljnN.5EhN_A-1714493735-1.0.1.1-PiXml3RDWkkVECXKAvo12kuvNI67ilTYg80tpqVSOtrowzf6FvZ0tv9EN5gltjj8SgD1YIeJcJJh_KVyHmQl0w"
};

async function fetchAndProcess(url) {
  try {
    console.log("Scraper ", url);
    const response = await fetch(url, { headers1, redirect: 'follow' });
    const html = await response.text();
    console.log("HTML ", html);

    const $ = cheerio.load(html);

    const vcloudLinks = $('a[href^="https://vcloud.lol/"]').map((index, link) => $(link).attr('href')).get();
    console.log("vcloudLinks ", vcloudLinks);

    let finalUrls = [];

    for (const [index, vcloudLink] of vcloudLinks.entries()) {
      try {
        const innerResponse = await fetch(vcloudLink, { headers2 });
        const innerHtml = await innerResponse.text();
        const $ = cheerio.load(innerHtml);
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
                };
                console.log(`${vcloudLinks.length > 1 ? `Episode ${index + 1}` : `Download Link`}:- ${finalUrl}`);
                finalUrls.push(data);
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
