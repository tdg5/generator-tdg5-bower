function <%= validVariableName %>() {}

var root = typeof(exports) === 'undefined' ? window : exports;
root.<%= validVariableName %> = <%= validVariableName %>;
