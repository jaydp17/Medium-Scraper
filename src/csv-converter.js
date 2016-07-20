const fs = require('fs');

/**
 * A CSV converter that is responsible to writing the csv to a given file
 */
class CsvConverter {

  /**
   * Writes the data containing {link, text} to csv file
   * @param fileName Name of the file to write in
   * @param data The data to write
   */
  static writeToFile(/* string */ fileName, /* Array<{link, text}> */ data) {
    const stream = fs.createWriteStream(fileName);
    stream.once('open', () => {
      stream.write('Link, Text\n');
      data.forEach(row => stream.write(`${row.link}, ${row.text}\n`));
      stream.end();
    });
  }

}

module.exports = CsvConverter;
