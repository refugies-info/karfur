## How to convert json files to csv for translation ?

- in your terminal go to `refugies-info-app/src/translations/scripts`
- run node convertJsonToCsv.js

It generates 6 csv files in the folder csvBeforeTrad

## How to convert csv files to json for translation ?

- in your terminal go to `refugies-info-app/src/translations/scripts`
- put csv files in the folder csvAfterTrad
- go to convertCsvToJson.js, in main choose the language(s)
- run node convertCsvToJson.js

It replaces json file of the language selected

## How to extract french words in a csv ?

- in your terminal go to `refugies-info-app/src/translations/scripts`
- run node convertJsonToCsvFr.js

It generates a csv file fr.csv in csvBeforeTrad

## How to convert french csv file to json ?

- in your terminal go to `refugies-info-app/src/translations/scripts`
- download csv file : make sure columns contains title, key and nouvelle version du texte
- put csv file fr.csv in the folder csvAfterTrad
- run node convertCsvToJsonFr.js

It replaces fr.json file
