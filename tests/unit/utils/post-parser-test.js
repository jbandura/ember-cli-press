import postParser from 'ember-cli-press/utils/post-parser';
import { module, test } from 'qunit';

module('Unit | Utility | post-parser');

let subject = postParser.create();

test('it parses the frontmatter', function(assert) {
  let source = `
    ---
    layout: test
    categories: asd
    ---
    asd
  `;
   let actualResult = subject._parseFrontMatter(source);
   let expectedResult = {
     layout: 'test',
     categories: ['asd'],
   };
   assert.deepEqual(actualResult.layout, expectedResult.layout);
   assert.deepEqual(actualResult.categories, expectedResult.categories);
});

test('it parses frontmatter when values are an array', function(assert) {
  let source = `
    ---
    layout: test
    categories: asd, dfg
    ---
    asd

    ---
  `;

   let actualResult = subject._parseFrontMatter(source);
   let expectedResult = {
     layout: 'test',
     categories: ['asd', 'dfg'],
   };
   assert.deepEqual(actualResult, expectedResult, 'it parses the source including arrays');
});

test('it gets the content of the file along with the frontmatter', function(assert) {
  let source = `
    ---
    layout: test
    categories: company
    ---
    # Test Heading
    ---
  `;

  let actualResult = subject.parse(source);
  let expectedResult = {
    layout: 'test',
    categories: ['company'],
    content: `\n    \n    # Test Heading\n    \n  `
  };
  assert.deepEqual(
    actualResult,
    expectedResult,
    'it parses the the frontmatter and content'
  );
});

test("it gets the url or parses title when url not provided", function(assert) {
  let source = `
    ---
    title: Test post
    layout: test
    categories: company
    ---
    # Test Heading
    ---
  `;

  let actual = subject.parse(source).url;
  let expected = 'test-post';

  assert.equal(actual, expected, 'it can get url from title');
});

test("it allows url override", function(assert) {
  let source = `
    ---
    title: Test post
    layout: test
    categories: company
    url: foo-bar
    ---
    # Test Heading
    ---
  `;

  let actual = subject.parse(source).url;
  let expected = 'foo-bar';

  assert.equal(actual, expected, 'it can get url from title with override');
});
