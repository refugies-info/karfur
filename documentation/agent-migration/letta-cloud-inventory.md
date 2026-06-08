# Inventaire Letta Cloud de l'agent Agathe

Ce document décrit l'état actuel de l'agent Letta Cloud **Agathe** avant sa migration vers Letta Code SDK, `qmd` et le worker GCP.

Il sert de référence pour la PR 01 du projet Linear « Migration agent IA — Letta Code SDK et qmd » (`RI-1258`).

## Résumé

| Élément | Valeur |
| --- | --- |
| Agent | Agathe |
| Type | `letta_v1_agent` |
| Modèle | `anthropic/claude-sonnet-4-6` |
| Embeddings | `openai/text-embedding-3-small` |
| Project ID Letta | `97c52a94-4e58-4226-9ac3-b000d1dcba78` |
| Sleeptime | Désactivé |
| Fichiers indexés | 19 |
| Blocs de mémoire vive | 21 |
| Passages de mémoire archivés | 6 |
| Outils custom critiques | 2 |
| Règles d'outils | 16 |

L'inventaire des fichiers doit être considéré comme la base de départ du futur corpus `qmd`. Les blocs mémoire et les outils custom doivent être migrés en configuration et en étapes déterministes côté worker lorsque c'est possible.

## Source de vérité pour l'inventaire

Les APIs historiques de fichiers et dossiers Letta ne sont plus utilisables :

- `client.agents.folders.list(...)`
- `client.agents.files.list(...)`
- `client.folders.list(...)`

Elles retournent :

```text
400 This API route is deprecated and no longer supported on the Letta API.
```

Pour récupérer l'inventaire réel des ressources indexées, il faut utiliser l'export de l'agent :

```ts
client.agents.exportFile(agentId)
```

Conséquence pour la migration : ne pas baser les scripts d'export ou de synchronisation sur les anciennes APIs files/folders. L'export d'agent est aujourd'hui le mécanisme fiable pour retrouver les fichiers attachés, leur source et leur état d'indexation.

## Fichiers indexés

Les 19 fichiers sont répartis dans 4 groupes de sources.

| Source | Groupe apparent | Rôle dans la migration |
| --- | --- | --- |
| `source-0` | `ressources_langage_clair/*` | Règles et références de langage clair |
| `source-1` | `ressources_exemples_redaction/*` | Exemples de fiches initiales et finales |
| `source-2` | `ressources_metadatas/*` | Mapping et base de connaissance métadonnées |
| `source-3` | `ressources_conformité_éditoriale/*` | Jurisprudence éditoriale et taxonomie |

### `ressources_langage_clair`

| Fichier | Type | Taille | Chunks indexés | Notes |
| --- | --- | ---: | ---: | --- |
| `ressources_langage_clair/[PROCESS] Cas éditoriaux et jurisprudence.pdf` | PDF | 1 259 475 | 48/48 | Politique éditoriale et jurisprudence |
| `ressources_langage_clair/[guide dannotation] agent transformateur refugies-info.md` | Markdown | 11 826 | 15/15 | Guide de rédaction et d'annotation |
| `ressources_langage_clair/DITP-Lexique-Administratif.pdf` | PDF | 2 174 667 | 970/970 | Lexique administratif principal, très volumineux |
| `ressources_langage_clair/[Charte éditorial] Réfugiés.info.pdf` | PDF | 294 682 | 12/12 | Charte éditoriale Réfugiés.info |
| `ressources_langage_clair/[Lexique] administatif maison de la sagesse.pdf` | PDF | 1 175 719 | 114/114 | Lexique administratif |
| `ressources_langage_clair/[personas] bpi.pdf` | PDF | 3 445 556 | 7/7 | Proto-personas |
| `ressources_langage_clair/[Schéma] Fiche dispositif RI data.json` | JSON | 27 073 | 48/48 | Schéma et données de fiche dispositif RI |

### `ressources_exemples_redaction`

| Fichier | Type | Taille | Chunks indexés | Notes |
| --- | --- | ---: | ---: | --- |
| `ressources_exemples_redaction/Version initiale ADFIC - Formation primo arrivants - refugies.info - juin 24.pdf` | PDF | 1 251 187 | 3/3 | Exemple de version initiale |
| `ressources_exemples_redaction/Version finale - Solenciel - Réfugiés.info - février 2025.pdf` | PDF | 901 564 | 1/1 | Exemple de version finale ; extraction probablement faible |
| `ressources_exemples_redaction/Version finale - Alliance française Aix MArseille - Réfugiés.info - sept 2025.pdf` | PDF | 815 158 | 1/1 | Exemple de version finale ; extraction probablement faible |
| `ressources_exemples_redaction/Version finale - ADFIC Formation de français - Réfugiés.info - juin 2024.pdf` | PDF | 783 958 | 1/1 | Exemple de version finale ; extraction probablement faible |
| `ressources_exemples_redaction/Version initiale - Solenciel - Réfugiés.info - février 2025.pdf` | PDF | 1 174 412 | 1/1 | Exemple de version initiale ; extraction probablement faible |
| `ressources_exemples_redaction/Version initiale - Alliance française Aix Marseille BOp 104 -Réfugiés.info - sept 2025.pdf` | PDF | 1 011 786 | 1/1 | Exemple de version initiale ; extraction probablement faible |

### `ressources_metadatas`

| Fichier | Type | Taille | Chunks indexés | Notes |
| --- | --- | ---: | ---: | --- |
| `ressources_metadatas/mapping-data.md` | Markdown | 7 431 | 11/11 | Mapping RCO → métadonnées RI |
| `ressources_metadatas/dispositif-letta.json` | JSON | 1 051 | 1/1 | Exemple ou donnée de métadonnées |
| `ressources_metadatas/base-connaissance.md` | Markdown | 12 239 | 20/20 | Base de connaissance RI |
| `ressources_metadatas/mapping-data-di.md` | Markdown | 7 426 | 10/10 | Mapping Data Inclusion → métadonnées RI |

### `ressources_conformité_éditoriale`

| Fichier | Type | Taille | Chunks indexés | Notes |
| --- | --- | ---: | ---: | --- |
| `ressources_conformité_éditoriale/jurisprudence.md` | Markdown | 7 743 | 10/10 | Jurisprudence de conformité éditoriale |
| `ressources_conformité_éditoriale/Formacode.csv` | CSV | 89 445 | 142/142 | Taxonomie Formacode |

## Blocs de mémoire vive

Agathe contient 21 blocs de mémoire vive. Les blocs suivants sont les plus critiques pour la migration, car ils portent la logique métier et les formats de sortie :

| Bloc | Taille | Rôle |
| --- | ---: | --- |
| `compétence_routeur` | 4 384 | Routeur de commandes et de tâches |
| `compétence_conformité_éditoriale_di` | 5 284 | Cadre d'analyse de conformité éditoriale DI |
| `compétence_détection_doublons` | 3 784 | Cadre de détection des doublons |
| `compétence_métadonnées_di` | 9 368 | Cadre de mapping Data Inclusion → Réfugiés.info |
| `metadata_schema` | 4 760 | Schéma de sortie `metadata_ri` attendu |
| `format_sortie_global` | 1 384 | Format de sortie d'audit global |
| `format_sortie_metadonnées` | 2 603 | Format de sortie des métadonnées |
| `format_sortie_transformation` | 4 956 | Format de sortie de transformation rédactionnelle |
| `compétence_transformation_langage_clair` | 3 905 | Cadre de transformation en langage clair |
| `règles_rédaction_langage_clair` | 6 062 | Règles de rédaction en langage clair |
| `mémoire_vive_lexique` | 2 289 | Lexique administratif simplifié fréquemment utilisé |

Les autres blocs sont à conserver ou à revoir selon leur utilité dans la nouvelle architecture :

| Bloc | Taille | Rôle |
| --- | ---: | --- |
| `human` | 402 | Contexte d'interaction avec Luis et l'équipe |
| `project-overview` | 778 | Vue d'ensemble du Playground |
| `project-conventions` | 1 055 | Conventions de projet |
| `persona` | 793 | Persona d'Agathe |
| `contexte_équipe` | 1 469 | Contexte équipe RI |
| `skills` | 3 040 | Ancien listing de skills |
| `traduction` | 204 | Notes de l'agent de traduction |
| `project-commands` | 751 | Liste de commandes projet |
| `tarjama_agent` | 197 | Notes de l'agent de traduction arabe |
| `loaded_skills` | 17 | Placeholder vide |

Recommandation : extraire les blocs critiques en fichiers Markdown versionnés, relus par l'équipe métier, puis les indexer dans le corpus `qmd` ou les convertir en configuration explicite du worker. Les formats de sortie et validations doivent être testables hors conversation LLM.

## Mémoire archivée

L'inventaire a identifié 6 passages archivés :

1. Renommage de l'agent Edwige → Agathe le 2026-01-07.
2. Résumé du rôle d'Agathe comme agent stateful de traitement RI/RCO.
3. Ancienne compétence de conformité éditoriale RCO.
4. Ancienne compétence de mapping métadonnées RCO → RI.
5. Jurisprudence OEPRE : une fiche OEPRE refusée pendant une analyse de conformité.
6. Note métadonnées OEPRE : OEPRE explicitement refusé car non priorisé.

Ces passages ne doivent pas être ignorés : ils contiennent de la jurisprudence et de l'historique produit. En revanche, ils ne doivent pas être migrés tels quels sans tri, car une partie concerne l'ancien périmètre RCO.

## Outils custom critiques

### `validate_metadata_ri`

| Élément | Valeur |
| --- | --- |
| Tool ID | `tool-d8094e8a-19fd-4c2a-8922-637ddecbd0c9` |
| Type | Custom Python |
| Tags | `playground`, `metadata`, `validation` |
| Return char limit | 50 000 |
| Variable d'environnement | `VALIDATE_METADATA_RI_URL` |

Rôle : valider le JSON `metadata_ri` contre le schéma Réfugiés.info. Agathe est censée appeler cet outil après avoir produit des métadonnées, puis corriger les erreurs avant de répondre.

Payload envoyé :

```json
{
  "metadata_ri": "..."
}
```

Implication pour la migration : cette validation doit idéalement sortir de la boucle volontaire de l'agent. Elle devrait devenir une étape déterministe côté worker, ou un outil HTTP contrôlé exposé à Letta Code SDK avec gestion explicite des erreurs.

### `search_ri_duplicate_dispositifs`

| Élément | Valeur |
| --- | --- |
| Tool ID | `tool-fb8775dd-d286-4bd8-b7e1-3c08371154aa` |
| Type | Custom JSON / source Python-like |
| Tags | `playground`, `duplicates`, `refugies-info` |
| Return char limit | 50 000 |
| Endpoint | `POST https://refugies.info/api/agent/dispositifs/duplicates` |
| Header d'authentification | `webhook-secret` |
| Variables d'environnement | `RI_DUPLICATE_SEARCH_URL`, `RI_WEBHOOK_SECRET` |

Rôle : chercher les dispositifs Réfugiés.info existants qui pourraient être des doublons d'une fiche Data Inclusion.

Instruction importante : cet outil doit être utilisé pour la détection de doublons à la place d'une recherche dans `ressources_doublons/dispositifs.yaml`.

Implication pour la migration : la détection de doublons doit rester appuyée sur l'API applicative, pas uniquement sur la recherche sémantique `qmd`. Si l'API est indisponible techniquement, l'agent doit retourner un état du type `duplicate: indeterminate` plutôt que conclure à l'absence de doublon.

## Autres outils et règles d'outils

Agathe dispose aussi d'outils standards Letta :

| Outil | Type | Rôle |
| --- | --- | --- |
| `semantic_search_files` | `letta_files_core` | Recherche sémantique dans les fichiers indexés |
| `grep_files` | `letta_files_core` | Recherche texte dans les fichiers indexés |
| `open_files` | `letta_files_core` | Ouverture de fichiers attachés |
| `conversation_search` | `letta_core` | Recherche dans l'historique de conversation |
| `archival_memory_search` | `letta_builtin` / core | Recherche dans la mémoire archivée |
| `archival_memory_insert` | `letta_builtin` / core | Ajout dans la mémoire archivée |
| `memory`, `memory_insert`, `memory_replace` | memory tools | Modification de la mémoire vive |
| `web_search`, `fetch_webpage` | builtin | Recherche web externe |

Les outils mémoire et recherche continuent la boucle d'exécution :

```text
memory
conversation_search
archival_memory_search
archival_memory_insert
memory_replace
memory_insert
```

Les outils de fichiers et d'édition nécessitent une approbation :

```text
RunShellCommand
ReadFileGemini
ListDirectory
GlobGemini
SearchFileContent
Replace
WriteFileGemini
WriteTodos
ReadManyFiles
Skill
```

## Patterns de conversations

Les conversations récentes suivent notamment les conventions de nommage :

```text
compliance-<workflow_id>
metadata-<workflow_id>
```

Exemples :

```text
compliance-5fbae8e9-c96a-4a67-9f0e-d34995cc73c7
metadata-5fbae8e9-c96a-4a67-9f0e-d34995cc73c7
```

La migration doit préserver des identifiants de conversation stables par workflow afin de garder une traçabilité entre exécutions. Les flux de traduction mentionnent également le pattern :

```text
translation-<editorialRecordId>-<language>
```

## Points d'attention pour les PR suivantes

- Transformer les fichiers indexés en corpus `qmd` reproductible et versionné.
- Revalider la qualité d'extraction des PDFs d'exemples rédactionnels : plusieurs fichiers n'ont qu'un seul chunk, ce qui peut indiquer une extraction faible.
- Séparer les connaissances métier stables des instructions opérationnelles propres à Letta Cloud.
- Remplacer la validation métadonnées volontaire par une étape worker testable.
- Conserver l'appel API pour les doublons afin d'éviter des faux négatifs basés uniquement sur le corpus documentaire.
- Ne pas dépendre des APIs Letta files/folders dépréciées pour les scripts de migration.
