import Ember from 'ember';

const { String: { dasherize }} = Ember;

export default Ember.Object.extend({

  /**
   * Generates frontmatter and extracts content from give markdown file content
   * @param {String} source: markdown file content
   * @returns {Object} parsed data in form of an object
   */
  parse(source) {
    let postData = this._parseFrontMatter(source);
    postData.content = this._extractContent(source);
    return postData;
  },

  /**
   * Removes front matter from markdown file content.
   *
   * @param {String} source: mardown file content
   * @returns {String} content without front matter
   * @private
   */
  _extractContent(source) {
    let sourceParts = source.split('---');
    delete sourceParts[1];
    return sourceParts.join("");
  },

  /**
   * @param {String} source
   * @returns {Object} parsed front matter
   * @private
   */
  _parseFrontMatter(source) {
    let dataObject = {};

    this._extractFrontMatter(source).forEach((item) => {
      let [key, value] = item.split(':');
      dataObject[key.trim()] = this._extractValue(key.trim(), value);
    });

    return this._appendUrlAttribute(dataObject);
  },

  /**
   * Converts front matter in form of string to an array of strings in form of
   * `key:value` that can be then individually parsed
   *
   * @param {String} source
   * @returns {String[]} array of key value pairs in form of strings to be
   *                     parsed as yaml
   * @private
   */
  _extractFrontMatter(source) {
    let [, yamlData, ] = source.split('---');
    return yamlData
      .split("\n")
      .map((item) => {
        return item.trim();
      })
      //get rid of empty items
      .filter((item) => {
        return item;
      }
    );
  },

  /**
   * Parses values. Normally not much processing is required apart from trimming,
   * but if we have a category key we have to always return an array.
   * @param {String} keyName
   * @param {String} string
   * @returns {String | String[]}
   * @private
   */
  _extractValue(keyName, string) {
    if (string.indexOf(',') === -1) {
      if (keyName === 'category' || keyName === 'categories') {
        return [string.trim()];
      }
      return string.trim();
    }
    // we have an array
    return string.split(',').map((item) => { return item.trim(); });
  },

  /**
   * Adds url attribute to the data hash.
   * It uses the url attribute when provided, otherwise it transforms title
   * @param {Object} data
   * @returns {Object}
   * @private
   */
  _appendUrlAttribute(data) {
    if (data.url || !data.title) { return data; }

    data.url = dasherize(data.title);
    return data;
  }
});
