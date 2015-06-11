module.exports = function (num) {

  var encodeString = '';

  var nextValue, finalValue;

  while (num >= 0x20) {
    nextValue = (0x20 | (num & 0x1f)) + 63;
    encodeString += (String.fromCharCode(nextValue));
    num >>= 5;
  }

  finalValue = num + 63;

  encodeString += (String.fromCharCode(finalValue));

  return encodeString;

};
