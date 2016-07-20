const _array = require('lodash/array');

const Crawler = require('./crawler');
const CsvConverter = require('./csv-converter');

/** Properties */
const URL_TO_START = 'https://medium.com';
const MAX_PAGES_TO_CRAWL = 3;
const OUTPUT_CSV_FILE = '../result.csv';

const crawler = new Crawler(MAX_PAGES_TO_CRAWL);
crawler.crawl(URL_TO_START)
  .then((/* {foundUrls: Array<{link, text}>, crawledUrls} */ result) => {
    const newResult = { crawledUrls: result.crawledUrls };
    newResult.foundUrls = _array.uniqBy(result.foundUrls, 'link');
    return newResult;
  })
  .then(result => CsvConverter.writeToFile(OUTPUT_CSV_FILE, result.foundUrls));
