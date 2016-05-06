'use strict';

/**
 * Returns a list of range where each range wraps a part of the node's textContent that matches str.
 *
 * @param {!Node} node The node containing the text to wrap.
 * @param {!String} str The string to wrap.
 * @param {!number} [startAt = 0] The position in {node.textContent} at which the search for {str} will start.
 * @return {!Range[]} The list of range, starting from the end to the start as it causes less problems when handling then that way.
 */
module.exports.wrapTextAll = function (node, str, startAt) {
  var ranges = [];

  var textContent = node.textContent;

  var startIndex;
  while ((startIndex = textContent.indexOf(str, startAt)) !== -1) {
    var endIndex = startIndex + str.length;

    ranges.push(module.exports.wrapTextIndex(node, startIndex, endIndex));

    startAt = endIndex;
  }

  return ranges.reverse();
};

/**
 * Creates a range that wraps the part of the node matching str, ignoring tags.
 *
 * @param {!Node} node The node containing the text to wrap.
 * @param {!String} str The string to wrap.
 * @param {!number} [startAt = 0] The position in {node.textContent} at which the search for {str} will start.
 * @return {Range} The range or null if the text is not part of the node.
 */
module.exports.wrapText = function (node, str, startAt) {

  var startIndex = node.textContent.indexOf(str, startAt);

  if (startIndex === -1) {
    return null;
  }

  return module.exports.wrapTextIndex(node, startIndex, startIndex + str.length);
};

module.exports.wrapTextIndex = function (node, startIndex, endIndex) {
  node.normalize();

  var length = endIndex - startIndex;

  // Get the text node that contains the start of [str]
  var startPos = { pos: startIndex };
  var startNode = _findPos(node, startPos); // pos is in an object so it can be modified.
  if (!startNode) {
    return null;
  }

  // Get the text node that contains the end of [str]
  var endPos = { pos: endIndex };
  var endNode = _findPos(node, endPos);
  if (!endNode) {
    return null;
  }

  var range = document.createRange();

  // edge case, for <div>matched text</div>, the range should start before <div>, not before "matched text"
  if (startNode !== endNode && startNode.parentNode.childNodes.length === 1 && startNode.length <= length) {
    range.setStartBefore(startNode.parentNode);
  } else {
    range.setStart(startNode, startPos.pos);
  }

  // edge case, for <div>matched text</div>, the range should end after </div>, not after "matched text"
  if (startNode !== endNode && endNode.parentNode.childNodes.length === 1 && endNode.length === endPos.pos) {
    range.setEndAfter(endNode.parentNode);
  } else {
    range.setEnd(endNode, endPos.pos);
  }

  return range;
};

/**
 * Returns the text node which is part of {node} and contains the character with index {args.pos} if {node.textContent}.
 * Returns Null if {node.textContent.length < args.pos}.
 * Note: args.pos will be set to the offset of the start of the string inside the text node.
 */
function _findPos(node, args) {

  var pos = args.pos;
  if (pos < 0) {
    return null;
  }

  // Text node
  if (node.nodeType === 3) {
    if (node.length >= args.pos) {
      return node;
    } else {
      args.pos -= node.length;
    }
  }

  // character order in .textContent is generated In-Order, so are we: Children first, starting from left.
  if (node.firstChild) {
    var result = _findPos(node.firstChild, args);

    if (result) {
      return result;
    }
  }

  if (node.nextSibling) {
    const result = _findPos(node.nextSibling, args);

    if (result) {
      return result;
    }
  }

  return null;
}
