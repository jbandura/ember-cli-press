import Ember from 'ember';

export default Ember.Object.extend({

  parse(source) {
    let postData = this._parseFrontMatter(source);
    postData.content = this._extractContent(source);
    return postData;
  },

  _parseFrontMatter(source) {
    let dataObject = {};

    this._extractFrontMatter(source).forEach((item) => {
      let [key, value] = item.split(':');
      dataObject[key.trim()] = this._extractValue(key.trim(), value);
    });

    return dataObject;
  },

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

  _extractContent(string) {
    return string.replace(/---(.[^-]|\s)*---/, '').trim();
  }
});
