import Ember from 'ember';

const { Controller, inject, computed } = Ember;

export default Controller.extend({
  markdownStore: inject.service(),
  postFeed: computed(function() {
    return this.get('markdownStore').findAll('post');
  })
});
