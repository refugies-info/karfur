---
chunks_embedded: 11
exported_at: "2026-06-08T15:50:31.834Z"
file_id: "file-7"
file_size_bytes: 7431
file_type: "text/x-markdown"
original_file_name: "mapping-data.md"
processing_status: "completed"
source_id: "source-2"
source_name: "ressources_metadatas"
source_path: "ressources_metadatas/ressources_metadatas/mapping-data.md"
total_chunks: 11
weak_extraction_reasons: []
---

# mapping-data

> Source Letta Cloud : `ressources_metadatas/ressources_metadatas/mapping-data.md`

# Mapping data

| RI | Data RCO | *Exemple* | type |
| --- | --- | --- | --- |
| `mainSponsor` | `nom-organisme` | Centre RCO Julie |  |
| `needs` | À partir de l’ensemble du fichier XML, interprète et applique une ou plusieurs valeurs correspondant au tableau `needs` du document “base-connaissance.md” | “Apprendre à cuisiner des tartes” |  |
| `secondaryThemes` | À partir de l’ensemble du fichier XML, interprète et applique une valeur correspondant au tableau `theme` du document “base-connaissance.md” | “Apprendre à cuir des tartes” |  |
| `theme` | À partir de l’ensemble du fichier XML, interprète et applique une valeur correspondant au tableau `theme` du document “base-connaissance.md” | “La cuisine pour les nuls” |  |
| `map` | [Table map](https://www.notion.so/Mapping-data-2bdf23980b9c81beae9befd7e70203a8?pvs=21) | [Table map](https://www.notion.so/Mapping-data-2bdf23980b9c81beae9befd7e70203a8?pvs=21) |  |
| `titreInformatif` | `intitule-formation` | *Apprendre le français (niveau B1)* | string |
| `titreMarque` | `nom-organisme` | *Formation B1 OFII* | string |
| `abstract` | `contenu-formation` interprète et formule une phrase qui n’excède pas 50 caractères | *Une formation gratuite d'une durée de 100 heures financée par l'OFII qui vous permet d'atteindre le niveau B1.* | string |
| `location` | `departement` | *0 :”21 - Côte-d'Or”
1 : “71 - Saône-et-Loire”* | string |
| `frenchLevel` | `contenu-formation` | *0 : “B1”
1 : “A2”* | array |
| `age` | [Table âge](https://www.notion.so/Mapping-data-2bdf23980b9c81beae9befd7e70203a8?pvs=21) | [Table âge](https://www.notion.so/Mapping-data-2bdf23980b9c81beae9befd7e70203a8?pvs=21) |  |
| `price` | [Table price](https://www.notion.so/Mapping-data-2bdf23980b9c81beae9befd7e70203a8?pvs=21)
- Si conventionnement = 1 et que le code financeur fait partie du tableau `code-financeur` du document “base-connaissance.md”, alors appliquer la valeur “gratuit”
- Sinon, appliquer la valeur “payant”. 

N’applique pas le chiffre 1 ou 0 dans l’objet `values` (ça n’a rien à voir).  | [Table price](https://www.notion.so/Mapping-data-2bdf23980b9c81beae9befd7e70203a8?pvs=21) |  |
| `publicStatus` | `code-public-vise`
Selon le code que tu récupères, applique la valeur correspondante du document “base-connaissance.md”  | *0 : patate
1 : tomate
2 : pamplemousse 
3 : banane* | array |
| `public` | À l’aide des données du fichier XML, interprète et applique une ou plusieurs valeurs correspondant au tableau `public` du document “base-connaissance.md” | *0 : patate
1 : tomate
2 : pamplemousse 
3 : banane* | array |
| `conditions` | `modalite-inscription
niveau-entree-obligatoire`
`conditions-specifiques`

À l’aide des données de ces deux champs, interprète et applique une ou plusieurs valeurs correspondant au tableau `conditions` du document “base-connaissance.md” | *0 : acte de naissance
1 : titre sejour 
2 : bank account* | array |
| `commitment` | [Table commitment](https://www.notion.so/Mapping-data-2bdf23980b9c81beae9befd7e70203a8?pvs=21) | [Table commitment](https://www.notion.so/Mapping-data-2bdf23980b9c81beae9befd7e70203a8?pvs=21) |  |
| `frequency` | [Table frequency](https://www.notion.so/Mapping-data-2bdf23980b9c81beae9befd7e70203a8?pvs=21) | [Table frequency](https://www.notion.so/Mapping-data-2bdf23980b9c81beae9befd7e70203a8?pvs=21) |  |
| `timeSlots` (jours) | À l’aide des données du fichier XML, interprète et applique une ou plusieurs valeurs correspondant au tableau `timeSlots` du document “base-connaissance.md” | *0 : lundi
1 : jeudi
2 : dimanche* | array |
| `periode` | dans `<session>`
`periode
debut
fin`
et/ou
`duree-indicative` | *2024-01-01T00:00:00.000Z
2026-12-18T23:59:59.999Z*
 | date |

| RI - map | Data RCO | *Exemple* | type |
| --- | --- | --- | --- |
| `title` | dans `<lieu-de-formation tag="principal">`
`denomination` | `*Graines de solidarité*` | string |
| `address` | dans `<lieu-de-formation tag="principal">`
`ligne`
`codepostal` | `*48 Rue Kléber, 33800 Bordeaux, Franc*` | string |
| `city` | dans `<lieu-de-formation tag="principal">`
`ville` | `*Bordeaux*` | string |
| `lat` | dans `<lieu-de-formation tag="principal">
latitude` | `*44.8283511*` | double |
| `lng` | dans `<lieu-de-formation tag="principal">
longitude` | `*-0.5700301*` | double |
| `description` |  | `*Accueil des nouveaux bénévoles les mercredis de 18h à 20h*` | string |
| `email` | dans `<contact-session`
`courriel` | [`*contact@example.org](mailto:contact@example.org)*`  | string |
| `phone` | dans `<contact-session`
`numtel` | `*06 XX XX XX XX*` | string |

| RI - âge | Data RCO | *Exemple* | type |
| --- | --- | --- | --- |
| `type` | À l’aide des données du fichier XML, interprète et applique une ou plusieurs valeurs correspondant au tableau `type` du document “base-connaissance.md” | `*Between*` | string |
| `ages` (array) | `conditions-specifiques`

À l’aide des données de ces champs, interprète et applique une valeur en chiffres | `*0 : 16
(et)
1 : 77*` | array |

| RI - Frequency | Data RCO | *Exemple* | type |
| --- | --- | --- | --- |
| `amountDetails` | À l’aide des données du fichier XML, interprète et applique une ou plusieurs valeurs correspondant au tableau `amountDetails` du document “base-connaissance.md” | `*Minimum*` | string |
| `hours` | `nombre-heures-total`
et/ou
`rythme-formation`

À l’aide des données de ces champs, interprète et applique une valeur en chiffres | `*1*` | array |
| `timeUnit` | À l’aide des données du fichier XML, interprète et applique une ou plusieurs valeurs correspondant au tableau `timeUnit` du document “base-connaissance.md” | `*sessions*` | string |
| `frequencyUnit` | `nombre-heures-total`
et/ou
`rythme-formation`

À l’aide des données de ces champs, interprète et applique une ou plusieurs valeurs correspondant au tableau `frequencyUnit` du document “base-connaissance.md” | `*(par) mois*` | string |

| RI - commitment | Data RCO | *Exemple* | type |
| --- | --- | --- | --- |
| `amountDetails`  | À l’aide des données du fichier XML, interprète et applique une ou plusieurs valeurs correspondant au tableau `amountDetails` du document “base-connaissance.md” | `*maximum*` | string |
| `hours`  | `nombre-heures-total`
et/ou
`rythme-formation` | `*1*` | array |
| `timeUnit`  | À l’aide des données du fichier XML, interprète et applique une ou plusieurs valeurs correspondant au tableau `timeUnit` du document “base-connaissance.md” | `*an*` | string |

| RI - price | Data RCO | *Exemple* | type |
| --- | --- | --- | --- |
| `values` | `conventionnement
 code-financeur`
`frais-restants`
`prise-en-charge-frais-possible`

À l’aide des données de ces champs, interprète et applique une ou plusieurs valeur en chiffres. 
 | `*0 : 10
1 : 20*` | array |
| `details` | À l’aide des données du fichier XML, interprète et applique une ou plusieurs valeurs correspondant au tableau `details` du document “base-connaissance.md” | `*week*` | string |

| RI - periode | Data RCO | *Exemple* | type |
| --- | --- | --- | --- |
| `debut` | dans `<session>`
`periode
debut`

et/ou
`duree-indicative` | *2024-01-01T00:00:00.000Z*

 | date |
| `fin` | dans `<session>`
`periode
fin`

et/ou
`duree-indicative` | *2026-12-18T23:59:59.999Z* | date |
