/**
 * @TODO (future) Use contants
 * Creates a stream of recognisable GMUD tokens, with the following functions:
 * - next: moves the stream pointer to the next token and retrieves it.
 * - peek: retrieves the current token, without removing it.
 * - eof: returns true if there's no more tokens to read in this stream.
 * - croak: throws an Error message.
 * @param {InputStream} input The InputStream.
 */
module.exports.TokenStream = (input) => {
  let current = null;
  return {
    next,
    peek,
    eof,
    croak: input.croak,
  };
  function isBoolean(x) {
    return ['true', 'false'].includes(x);
  }
  function isIdentifier(ch) {
    return /[\w\-]/.test(ch);
  }
  function isInteger(string) {
    return /^-?[\d][\d]*$/.test(string);
  }
  function isAttribution(ch) {
    return "=:->".indexOf(ch) >= 0;
  }
  function isObjectSeparator(ch) {
    return ",".indexOf(ch) >= 0;
  }
  function isPropertySeparator(ch) {
    return " \n".indexOf(ch) >= 0;
  }
  function isFunctionStart(ch) {
    return ch == '(';
  }
  function isFunctionEnd(ch) {
    return ch == ')';
  }
  function isListNumbersStart(ch) {
    return ch == '[';
  }
  function isListNumbersEnd(ch) {
    return ch == ']';
  }
  function isListObjectsStart(ch) {
    return ch == '{';
  }
  function isListObjectsEnd(ch) {
    return ch == '}';
  }
  function isWhitespace(ch) {
    return " \t\n\r".indexOf(ch) >= 0;
  }
  function readWhile(predicate) {
    let str = "";
    while (!input.eof() && predicate(input.peek()))
      str += input.next();
    return str;
  }
  function readAttribution() {
    const symbol = readWhile((ch) => isAttribution(ch));
    return {
      type: "ATTRIBUTION_SYMBOL",
      value: symbol,
    };
  }
  function readIdentifier() {
    const id = readWhile(isIdentifier);
    return {
      type: "VARIABLE",
      value: id,
    };
  }
  function readPropertySeparator() {
    const value = readWhile(isPropertySeparator);
    return {
      type: "PROPERTY_SEPARATOR",
      value: value,
    };
  }
  function readEscaped(end) {
    let escaped = false, str = "";
    input.next();
    while (!input.eof()) {
      const ch = input.next();
      if (escaped) {
        if (ch == 'n') {
          str += `\n`;
        } else {
          str += ch;
        }
        escaped = false;
      } else if (ch == "\\") {
        escaped = true;
      } else if (ch == end) {
        break;
      } else {
        str += ch;
      }
    }
    return str;
  }
  function readString() {
    return {
      type: "STRING",
      value: readEscaped('"'),
    };
  }
  function skipComment() {
    readWhile(function (ch) { return ch != "\n"; });
    input.next();
  }
  function readNext() {
    readWhile(isWhitespace);
    if (input.eof()) return null;
    let ch = input.peek();
    if (ch == "#") {
      skipComment();
      return readNext();
    }
    if (ch == '"') return readString();
    if (isIdentifier(ch)) {
      const identifier = readIdentifier();
      if (isInteger(identifier.value)) {
        return {
          type: "INTEGER",
          value: parseInt(identifier.value),
        };
      }
      if (isBoolean(identifier.value)) return {
        type: "BOOLEAN",
        value: identifier.value.toLowerCase() == 'true',
      };
      if (!isAttribution(identifier.value)) {
        return identifier;
      }
    }
    if (isObjectSeparator(ch)) return {
      type: "OBJECT_SEPARATOR_SYMBOL",
      value: input.next(),
    };
    if (isFunctionStart(ch)) return {
      type: 'FUNCTION_START',
      value: input.next(),
    };
    if (isFunctionEnd(ch)) return {
      type: 'FUNCTION_END',
      value: input.next(),
    };
    if (isListNumbersStart(ch)) return {
      type: 'LIST_NUMBERS_START',
      value: input.next(),
    };
    if (isListNumbersEnd(ch)) return {
      type: 'LIST_NUMBERS_END',
      value: input.next(),
    };
    if (isListObjectsStart(ch)) return {
      type: 'LIST_OBJECTS_START',
      value: input.next(),
    };
    if (isListObjectsEnd(ch)) return {
      type: 'LIST_OBJECTS_END',
      value: input.next(),
    };
    if (isAttribution(ch)) return readAttribution();
    input.croak(`Can't handle character "${ch}"`);
  }
  function peek() {
    return current || (current = readNext());
  }
  function next() {
    let token = current;
    current = null;
    return token || readNext();
  }
  function eof() {
    return peek() == null;
  }
};