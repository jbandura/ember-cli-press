import Ember from 'ember';
import markdownFiles from 'ember-cli-press/markdownFiles';
import postParserService from 'ember-cli-press/utils/post-parser';
import moment from 'moment';

let postParser = postParserService.create();

export default Ember.Object.extend({
  markdownFiles,
  postParser,
  feed: null,

  findBy(key, value) {
    if (!Ember.A(['category', 'categories']).contains(key)) {
      return this.get('feed').filterBy(key, value);
    }
    // we have a category search
    return this.get('feed').filter((post) => {
      return post.get('categories').contains(value);
    });
  },

  _getAllRaw() {
    return this.get('markdownFiles');
  },

  _parseFeed() {
    let processedData = this.get('markdownFiles').map((post) => {
      let [fileName] = Object.keys(post);
      let content = post[fileName];
      return Ember.Object.create(
        this._parsePost(this.get('postParser').parse(content))
      );
    });

    let sortedData = processedData.sort((itemA, itemB) => {
      let dateA = moment(itemA.get('date'));
      let dateB = moment(itemB.get('date'));

      if (dateA.isAfter(dateB)) { return -1; }
      if (dateA.isBefore(dateB)) { return 1; }

      return 0;
    });

    this.set('feed', Ember.A(sortedData));
  },

  _parsePost(post) {
    return post;
  }
});
