/* global moment */
import Ember from 'ember';
import postParserService from 'ember-cli-press/utils/post-parser';

const postParser = postParserService.create();

export default Ember.Object.extend({
  /**
   * PostParser instance
   *
   * @param postParser
   * @type {PostParser}
   */
  postParser,

  /**
   * Parses given list of markdown files using given parser and then
   * creates an array of posts. Posts are sorted by date ASC.
   *
   * @param {Object} markdownFiles list of files
   * @param {Object} parser a post parser instance
   * @returns {Object[]} array of parsed posts
   * @private
   */
  parseFeed(markdownFiles) {
    if (!markdownFiles) { return {}; }

    let types = {};
    Object.keys(markdownFiles).forEach((type) => {
      types[type] = this._sortItems(
        this._extractItems(markdownFiles[type], this.get('postParser'))
      );
    });
    return types;
  },

  /**
   * Extracts items for given category (post/pages/etc.)
   *
   * @param {Object} markdownFiles POJO where keys represent files for given type
   * @param {Object} parser a post parser instance
   * @returns {Object[]} parsed posts for given category
   * @private
   */
  _extractItems(filesOfType, parser) {
    return Object.keys(filesOfType).map((fileName) => {
      let content = filesOfType[fileName];
      return Ember.Object.create(parser.parse(content));
    });
  },

  /**
   * Sort items
   *
   */
  _sortItems(items) {
    return items.sort((itemA, itemB) => {
      let dateA = moment(itemA.get('date'));
      let dateB = moment(itemB.get('date'));

      if (dateA.isAfter(dateB)) { return -1; }
      if (dateA.isBefore(dateB)) { return 1; }
      return 0;
    });
  }
});
