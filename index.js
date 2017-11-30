var fs = require('fs');

var data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
var rules = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
var result = transformData(data, rules);

fs.writeFile('result.json', JSON.stringify(result), 'utf8', () => console.log('transform complete!'));

function transformData(data, rules) {
  return data.map(obj => {
      var transformedItem = {}
      var existingKeys = Object.keys(rules).reduce((acc, curr) => {

        if (curr.includes('@')) {
          var separated = curr.split('@');

          if (obj.hasOwnProperty(separated[0]) && obj.hasOwnProperty(separated[1])) {
            acc = [...acc, separated[0], separated[1]]
          }
        } else {

          if (obj.hasOwnProperty(curr)) {
            acc = [...acc, curr];
          }
        }

        return acc;

      }, []);

      Object.keys(rules)
        .filter(item => item.includes('@'))
        .map(item => {
          var separated = item.split('@');

          if (existingKeys.includes(separated[0]) && existingKeys.includes(separated[1])) {
            transformedItem = { [rules[item]]: `${obj[separated[0]]} ${obj[separated[1]]}` };
          }
        });

      return existingKeys.reduce((acc, curr) => {

        if (rules.hasOwnProperty(curr)) {
          acc = { ...acc, [rules[curr]]: obj[curr] };
        }

        return acc;
      }, transformedItem);
    }
  )
}

