## How to convert json files to csv ?

- in your terminal go to `refugies-info-app/src/translations/scripts`
- run node convertJsonToCsv.js

It generates 6 csv files in the folder csvBeforeTrad

## How to convert csv files to json ?

- in your terminal go to `refugies-info-app/src/translations/scripts`
- put csv files in the folder csvAfterTrad
- go to convertCsvToJson.js, in main choose the language(s)
- run node convertCsvToJson.js

It replaces json file of the language selected
