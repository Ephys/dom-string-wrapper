# dom-text-finder

Utilitary functions to manipulate a DOM Node's textContent without damaging (reseting) its existing child nodes.

## Installation

`npm install --save dom-string-wrapper`

## Usage

The package provides 2 functions: `wrapText` and `wrapTextAll`, the first one returns a [`Range`](https://developer.mozilla.org/en/docs/Web/API/Range), the second one returns an array of `Range`s. They allow you to create a range that will wrap a part of a node's textContent.

```
/* For instance, let's take the following node */
var pNode = document.createElement('p');
var pNode.innerHTML = '<span>Well, <strong>Hello</strong> world :)</span>';

/* and add an event listener to the span child. */
pNode.querySelector('strong').addEventListener('hover', doSomethingImportant);

/* let's now say that we wish to wrap Hello World in a Anchor node, we could do the following: */
var pNode.innerHTML = '<span>Well, <a href="..."><strong>Hello</strong> world</a> :)</span>';

/* But that would reset the whole content and we would lose the event listener we added on <strong>.
 * That's where this module comes in. You can achieve the same goal without resetting anything. */
var wrapText = require('dom-string-wrapper').wrapText;

// returns a range wrapping '<strong>Hello</strong> world'
var range = wrapText(pNode, 'Hello world');

/* You can then use the native range methods to manipulate the content. In this case, we need surroundContents. */
var aNode = document.createElement('a');
aNode.href = '...';
range.surroundContents(aNode);
```
