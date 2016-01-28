import postFeed from 'ember-cli-press/utils/post-feed';
import { module, test } from 'qunit';
import Ember from 'ember';

module('Unit | Utility | post-feed');

let mdFilesStub = {
  "2015-04-22-test-post": 'File1',
  "2015-06-22-test-post-2": 'File2'
};
let parsedPostStub1 = {
  title: 'Test title',
  date: '2015-04-22',
  categories: Ember.A(['foo']),
  content: '# Hi world'
};

let parsedPostStub2 = {
  title: 'Test title 2',
  date: '2015-06-22',
  categories: Ember.A(['bar']),
  content: '# Hi world 2'
};

let parsedPostStubs = {
  'File1': parsedPostStub1,
  'File2': parsedPostStub2,
};

let subject = postFeed.create({
  markdownFiles: mdFilesStub,
  postParser: Ember.Object.create({
    parse(content) { return parsedPostStubs[content]; }
  })
});

test('it stores a processed array of md-files', function(assert) {

  let actualResult = subject.get('feed');
  let expectedResult = Ember.A([
    Ember.Object.create(parsedPostStub2),
    Ember.Object.create(parsedPostStub1)
  ]);

  assert.deepEqual(actualResult, expectedResult, 'it creates a store of posts ordered by date ASC');
});

test('it finds posts by category', function(assert) {
  let actualResult = subject.findBy('category', 'foo');
  let expectedResult = [Ember.Object.create(parsedPostStub1)];

  assert.deepEqual(actualResult, expectedResult, 'it returns correct post');
});

test('it finds posts by other keys', function(assert) {
  let actualResult = subject.findBy('title', 'Test title');
  let expectedResult = [Ember.Object.create(parsedPostStub1)];

  assert.deepEqual(actualResult, expectedResult, 'it returns correct post');
});
