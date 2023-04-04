/**
 * Creates a stream of characters, with the following functions:
 * * next: move the stream pointer to the next character and retrieves it.
 * * peek: retrieves the current character in the stream, without removing it.
 * * eof: returns true if there's no more characters to read in this stream.
 * * croak: throws an Error message.
 * @param {string} input The string to be streamed.
 */
module.exports.InputStream = (input) => {
    let position = 0, line = 1, column = 0;
    return {
        next,
        peek,
        eof,
        croak,
    };
    function next() {
        const string = input.charAt(position++);
        if (string == "\n") line++, column = 0; else column++;
        return string;
    }
    function peek() {
        return input.charAt(position);
    }
    function eof() {
        return peek() == "";
    }
    function croak(message) {
        throw new Error(message + " (" + line + ":" + column + ")");
    }
};