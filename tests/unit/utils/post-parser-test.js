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
     content: `# Test Heading\n    ---`
   };
   assert.deepEqual(actualResult, expectedResult, 'it parses the the frontmatter and content');
});
