const natural = require("natural");
// categorises and tokenizes the sentences into array of strings
const naturalTokenizer = new natural.WordTokenizer();
// phonetic algorithm used to compare the phonetics of strings
const metaphone = natural.Metaphone;

// reusable function to search any variable(key value) in the given data
module.exports = (query, data, variableName) => {
  const queryTokens = naturalTokenizer.tokenize(query);
  const results = [];

  data.forEach((item) => {
    const variableTokens = naturalTokenizer.tokenize(item[variableName]);
    let matchedTokens = 0;

    for (const queryToken of queryTokens) {
      for (const variableToken of variableTokens) {
        // measure of differnce in strings
        const distance = natural.LevenshteinDistance(queryToken, variableToken);
        // measure of difference in phonetics
        const phoneticQuery = metaphone.process(queryToken);
        const phoneticvariable = metaphone.process(variableToken);
        const phoneticDistance = natural.LevenshteinDistance(
          phoneticQuery,
          phoneticvariable
        );
        // checking the minimal distance, minimal phoonetic distance and if there any substring match
        if (
          distance <= 1 ||
          phoneticDistance <= 1 ||
          variableToken.toLowerCase().includes(queryToken.toLowerCase())
        ) {
          matchedTokens++;
          break;
        }
      }
    }
    // adding the results to the array whose matching percentahge is more than 80%
    if (matchedTokens >= queryTokens.length * 0.8) {
      results.push(item);
    }
  });

  return results;
};
