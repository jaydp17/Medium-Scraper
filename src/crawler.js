const Promise = require('bluebird');
const Scraper = require('./scraper');

/**
 * A crawler that crawls the given site with the given number of pages
 */
class Crawler {

  /**
   *
   * @param maxPages the number of pages the crawler should crawl
   */
  constructor(/* number */ maxPages) {
    this.foundUrls = [];
    this.crawledUrls = {};
    this.crawlIndex = 0;
    this.crawledSize = 0;
    this.maxPages = maxPages;
  }

  /**
   * Starts crawling a particular site
   * @param url The site to crawl
   * @return {Promise<{foundUrls: Array<{link, text}>, crawledUrls}>}
   */
  crawl(/* string */ url) {
    if (this.crawledUrls[url] || this.crawledSize >= this.maxPages) {
      return Promise.resolve([]);
    }

    return Scraper.findAllLinks(url)
      .tap(() => this.crawledUrls[url] = true)
      .then(urlObjects => this.foundUrls = this.foundUrls.concat(urlObjects))
      .then(() => this.crawl(this.getNextUrl()))
      .then(() => ({ foundUrls: this.foundUrls, crawledUrls: this.crawledUrls }));
  }

  /**
   * Figures out the next url to crawl, makes sure no url is crawled twice
   * @return {string}
   */
  getNextUrl() {
    // noinspection StatementWithEmptyBodyJS
    while (this.crawledUrls[this.foundUrls[this.crawlIndex++].link]);
    this.crawledSize++;
    return this.foundUrls[this.crawlIndex].link;
  }

}

module.exports = Crawler;
