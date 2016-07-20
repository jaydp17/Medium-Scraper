# Medium-Scraper
Scraps popular blogging website [Medium](https://medium.com) and finds all possible hyperlinks present within [Medium](https://medium.com) and generate a CSV output

This scraper has two version
- Using Promises ([bluebird](http://bluebirdjs.com/docs/getting-started.html))
- Using [Async lib](http://caolan.github.io/async/)

The current branch (i.e. master) uses the Promise version of it. 

If you want to checkout the async lib version, go to the [async branch](https://github.com/jaydeep17/Medium-Scraper/tree/async).

## How to run the scraper?
```sh
$ npm start
```
You could see the results in a file called `output.csv` in the current directory

## How to change the config?
If you want to change a few configurations like
- `URL_TO_START`: url to start crawling
- `MAX_PAGES_TO_CRAWL`: maximum number of pages to crawl
- `MAX_REQUEST_THROTTLE`: maximum number of active requests to the site
- `OUTPUT_CSV_FILE`: the location of the output CSV file

Open `src/app.js`, it contains all the configurations.
