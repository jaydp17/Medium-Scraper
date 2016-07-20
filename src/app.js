const Crawler = require('./crawler');
const _array = require('lodash/array');

/** Properties */
const URL_TO_START = 'https://medium.com';
const MAX_PAGES_TO_CRAWL = 1;

const crawler = new Crawler(MAX_PAGES_TO_CRAWL);
crawler.crawl(URL_TO_START)
  .then((/* {foundUrls: Array<{link, text}>, crawledUrls} */ result) => {
    const newResult = { crawledUrls: result.crawledUrls };
    newResult.foundUrls = _array.uniqBy(result.foundUrls, 'link');
    return newResult;
  })
  .then(console.log);
