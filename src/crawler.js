const Promise = require('bluebird');
const _array = require('lodash/array');
const debug = require('debug')('crawler');
const Scraper = require('./scraper');

/**
 * A crawler that crawls the given site with the given number of pages
 */
class Crawler {

  /**
   *
   * @param maxPages The number of pages the crawler should crawl
   * @param requestThrottle The max number of active requests
   */
  constructor(/* number */ maxPages, /* number */ requestThrottle) {
    this.foundUrls = [];
    this.crawledUrls = {};
    this.crawledSize = 0;
    this.chunkIndex = 0;
    this.maxPages = maxPages;
    this.requestThrottle = requestThrottle;
  }

  /**
   * Starts crawling a particular site
   * @param url The site to crawl
   * @return {Promise<{foundUrls: Array<{link, text}>, crawledUrls}>}
   */
  crawl(/* string */ url) {
    return this._crawl(url)
      .then(() => this._crawlChunkWise())
      .then(() => ({ foundUrls: this.foundUrls, crawledUrls: this.crawledUrls }));
  }

  /**
   * Crawls a given url and adds all the found urls in <tt>this.foundUrls</tt>
   * @param url The url to crawl
   * @return {Promise}
   * @private
   */
  _crawl(url) {
    const isMediumLink = url.startsWith('https://medium.com');
    if (this.crawledUrls[url] || this.crawledSize >= this.maxPages || !isMediumLink) {
      return Promise.resolve([]);
    }

    debug(`start crawling : ${url}`);

    return Scraper.findAllLinks(url)
      .tap(() => this.crawledUrls[url] = true)
      .tap(() => this.crawledSize++)
      .then(urlObjects => this.foundUrls = this.foundUrls.concat(urlObjects))
      .then(() => debug(`finished crawling : ${url}`));
  }

  /**
   * Divides the found urls into chunks and crawls them accordingly
   * @return {Promise}
   * @private
   */
  _crawlChunkWise() {
    const chunks = _array.chunk(this.foundUrls, this.requestThrottle);
    if (this.chunkIndex >= chunks.length) return Promise.resolve();
    return Promise.map(chunks[this.chunkIndex++], item => this._crawl(item.link))
      .then(() => this._crawlChunkWise());
  }

}

module.exports = Crawler;
