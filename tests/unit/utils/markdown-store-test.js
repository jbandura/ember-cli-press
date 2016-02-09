import markdownStore from 'ember-cli-press/utils/markdown-store';
import { module, test } from 'qunit';
import Ember from 'ember';

module('Unit | Utility | markdown-store');

let subject = markdownStore.create();
let postsStubs = [
  {
    title: 'Foo post',
    url: 'foo-post',
    author: 'Gene Hackman',
    categories: ['foo', 'bar'],
    date: '2016-01-30'
  },
  {
    title: 'Bar post',
    categories: ['baz', 'bar'],
    date: '2016-01-28'
  }
];
let feedStub = {
  posts: Ember.A(postsStubs)
};
subject.set('_feed', feedStub);

test("it finds items by type", function(assert) {
  let actual = subject.findAll('post');
  let expected = postsStubs;

  assert.deepEqual(actual, expected);
});

test("it finds single item by type and id", function(assert) {
  let actual = subject.find('post', 'foo-post');

  assert.deepEqual(actual, postsStubs[0]);
});

test("it finds records for a query", function(assert) {
  let actual1 = subject.query('post', {
    author: 'Gene Hackman'
  });

  let actual2 = subject.query('post', {
    category: 'bar'
  });

  let actual3 = subject.query('post', {
    title: 'Bar post'
  });

  assert.deepEqual(actual1, [postsStubs[0]]);
  assert.deepEqual(actual2, postsStubs);
  assert.deepEqual(actual3, [postsStubs[1]]);
});
