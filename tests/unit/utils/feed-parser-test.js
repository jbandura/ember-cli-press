import feedParser from 'ember-cli-press/utils/feed-parser';
import { module, test } from 'qunit';
import Ember from 'ember';

module('Unit | Utility | feed-parser');

let mdFilesStub = {
  posts: {
    "2015-04-22-test-post": 'File1',
    "2015-06-22-test-post-2": 'File2'
  }
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

let parsedPostsStubNoDate = {
  title: 'Hi',
  content: 'Hi what is up?'
};

let parsedPostStubs = {
  'posts': {
    'File1': parsedPostStub1,
    'File2': parsedPostStub2,
  },
  'pages': {
    'noDate': parsedPostsStubNoDate
  }
};

function generateParserMock(callback) {
  return Ember.Object.create({
    parse: callback
  });
}

let subject = feedParser.create();

test('it stores a processed array of md-files', function(assert) {
  subject.set(
    'postParser',
    generateParserMock((content) => {
      return parsedPostStubs.posts[content];
    })
  );

  let actualResult = subject.parseFeed(mdFilesStub);
  let expectedResult = {
    posts: Ember.A([
      Ember.Object.create(parsedPostStub2),
      Ember.Object.create(parsedPostStub1)
    ])
  };

  assert.deepEqual(
    actualResult,
    expectedResult,
    'it creates a store of posts ordered by date ASC'
  );
});

test("it works when no md files present", function(assert) {
  let actual = subject.parseFeed(undefined);
  let expected = {};

  assert.deepEqual(actual, expected);
});

test("it works when files don't have date attribute", function(assert) {
  let mdFilesStub = { pages: {
      "noDate": "noDate"
  }};
  subject.set(
    'postParser',
    generateParserMock((content) => {
      return parsedPostStubs.pages[content];
    })
  );
  let actual = subject.parseFeed(mdFilesStub);
  let expected = {
    pages: Ember.A([
      Ember.Object.create(parsedPostsStubNoDate)
    ])
  };

  assert.deepEqual(actual, expected, '');
});

