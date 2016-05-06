'use strict';

var wrapText = require('../src/main').wrapText;
var wrapTextAll = require('../src/main').wrapTextAll;

describe('Wrapper', function () {
  describe('Single', function () {
    [
      ['<p><strong>Hello</strong> <em>World</em></p>', 'Hello World',
       '<p><section><strong>Hello</strong> <em>World</em></section></p>'],
      ['Hello<br> <em>World</em>', 'Hello World', '<section>Hello<br> <em>World</em></section>'],
      ['<p> Hello World </p>', 'Hello World', '<p> <section>Hello World</section> </p>'],
      ['<p>Hello World</p>', 'Hello World', '<p><section>Hello World</section></p>'],
      ['<p>Hello <span>World !</span></p>', 'Hello World']
    ].forEach(function (test) {
      var html = test[0];
      var needle = test[1];
      var result = test[2];

      it((result ? 'works' : 'throws') + ' with "' + html + '" and "' + needle + '"', function () {
        try {
          var container = document.createElement('div');
          container.innerHTML = html;

          var range = wrapText(container, needle);
          var wrapper = document.createElement('section');
          range.surroundContents(wrapper);

          if (result == null) {
            fail('Should have thrown');
          } else {
            expect(container.innerHTML).toBe(result);
          }
        } catch (e) {
          if (result != null) {
            fail(e);
          }
        }
      });
    });
  });

  describe('Multiple', function () {
    [
      ['<p>abbabba</p>', 'abba', '<p><section>abba</section>bba</p>'],
      ['<p>abbaabbaabba</p>', 'abba', '<p><section>abba</section><section>abba</section><section>abba</section></p>'],
      ['<p>abba abba</p>', 'abba', '<p><section>abba</section> <section>abba</section></p>']
    ].forEach(function (test) {
      var html = test[0];
      var needle = test[1];
      var result = test[2];

      it((result ? 'works' : 'throws') + ' with "' + html + '" and "' + needle + '"', function () {
        try {
          var container = document.createElement('div');
          container.innerHTML = html;

          var ranges = wrapTextAll(container, needle);
          ranges.forEach(function (range) {
            console.dir(range);
            var wrapper = document.createElement('section');
            range.surroundContents(wrapper);
          });

          if (result == null) {
            fail('Should have thrown');
          } else {
            expect(container.innerHTML).toBe(result);
          }
        } catch (e) {
          if (result != null) {
            fail(e);
          }
        }
      });
    });
  });
});
