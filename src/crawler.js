const _array = require('lodash/array');
const async = require('async');
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
   * Callback for getting the result of crawler
   *
   * @callback crawlerResultCallback
   * @param {Error} err - Error object
   * @param {{foundUrls: Array<{link, text}>, crawledUrls}} result - Actual result
   */

  /**
   * Starts crawling a particular site
   * @param url The site to crawl
   * @param callback Callback for the crawler to return result
   */
  crawl(/* string */ url, /* crawlerResultCallback */ callback) {
    async.waterfall([
      cb => this._crawl(url, cb),
      cb => this._crawlChunkWise(cb),
    ], err => {
      if (err) return callback(err);
      return callback(null, { foundUrls: this.foundUrls, crawledUrls: this.crawledUrls });
    });
  }

  /**
   * Crawls a given url and adds all the found urls in <tt>this.foundUrls</tt>
   * @param url url The url to crawl
   * @param callback Callback
   * @private
   */
  _crawl(/* string */ url, /* function */ callback) {
    const isMediumLink = url.startsWith('https://medium.com');
    if (this.crawledUrls[url] || this.crawledSize >= this.maxPages || !isMediumLink) {
      return callback();
    }

    debug(`start crawling : ${url}`);

    const _this = this;
    async.waterfall([
      cb => Scraper.findAllLinks(url, cb),
      (urlObjects, cb) => {
        _this.crawledUrls[url] = true;
        _this.crawledSize++;
        _this.foundUrls = _this.foundUrls.concat(urlObjects);
        debug(`finished crawling : ${url}`);
        cb();
      },
    ], err => callback(err));
    return undefined;
  }

  /**
   * Divides the found urls into chunks and crawls them accordingly
   * @param cb Callback
   * @private
   */
  _crawlChunkWise(/* function */ cb) {
    const chunks = _array.chunk(this.foundUrls, this.requestThrottle);
    if (this.chunkIndex >= chunks.length) return cb(null, undefined);

    async.map(
      chunks[this.chunkIndex++],
      (item, callback) => this._crawl(item.link, callback),
      err => {
        if (err) return cb(err);
        return this._crawlChunkWise(cb);
      }
    );
    return undefined;
  }

}

module.exports = Crawler;
