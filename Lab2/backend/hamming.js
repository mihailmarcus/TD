function decode(bits) {
  parity = function (number) {
    return number % 2;
  };
  var z = [];
  var countZ = 0;
  while (Math.pow(2, countZ) < bits.length) {
    countZ++; 
  }
  var skip, start, pozition, notEnd, errorPosition = 0;
  for (var i = 0; i < countZ; i++) {
    notEnd = true; //End of vector flag
    skip = Math.pow(2, i); //How many bits to skip
    start = skip - 1; //Where to start in vector
    z[i] = 0;
    while (notEnd) {
      for (var j = 0; j < skip; j++) {
        pozition = start + j;
        if (pozition < bits.length) {
          z[i] += bits[pozition];
        }
        else {
          notEnd = false;
        }
      }
      start = pozition + skip + 1; //Next time starts after it skips enough bits
    }
    z[i] = parity(z[i]);
    errorPosition += Math.pow(2, i) * z[i];
  }
  /*
  var z8 = parity(bits[7] + bits[8] + bits[9] + bits[10] + bits[11]);
  var z4 = parity(bits[3] + bits[4] + bits[5] + bits[6] + bits[11]);
  var z2 = parity(bits[1] + bits[2] + bits[5] + bits[6] + bits[9] + bits[10]);
  var z1 = parity(bits[0] + bits[2] + bits[4] + bits[6] + bits[8] + bits[10]);
  var errorPosition = z1 * 1 + z2 * 2 + z4 * 4 + z8 * 8;
  */
  var errorDetected = false;

  if (errorPosition != 0) errorDetected = true;
  if (errorDetected) {
    bits[errorPosition - 1] = parity(bits[errorPosition - 1] + 1);
  }

  return {
    errorCorrected: errorDetected,
    errorPosition: errorPosition - 1,
    bits: bits,
  };
}
exports.decode = decode;
