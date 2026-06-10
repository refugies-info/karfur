# Corpus documentaire agent-knowledge

## Objectif

Ce dossier contient le corpus documentaire versionné qui servira de source à l'indexation `qmd` pour le nouvel agent IA Réfugiés.info.

Il doit permettre de transformer les connaissances aujourd'hui présentes dans Letta Cloud en ressources lisibles, relues et maintenables dans le dépôt.

## Relation avec l'inventaire Letta Cloud

La structure initiale du corpus reprend les groupes identifiés dans l'[inventaire Letta Cloud de l'agent Agathe](../letta-cloud-inventory.md).

Les contenus exportés depuis Letta Cloud sont ajoutés progressivement via le script d'export décrit ci-dessous. Les ressources générées restent traçables par rapport aux chemins logiques Letta Cloud d'origine.

## Structure

> Le dossier `metadatas/` conserve le nom utilisé dans les ressources exportées depuis Letta Cloud, malgré l’anglicisme, afin de préserver la traçabilité avec la source.

| Dossier                  | Usage                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| `langage-clair/`         | Références de langage clair, chartes, lexiques et guides de transformation rédactionnelle. |
| `exemples-redaction/`    | Exemples de fiches initiales et finales utilisés pour guider les transformations.          |
| `metadatas/`             | Mapping, schémas et références de métadonnées Réfugiés.info.                               |
| `conformite-editoriale/` | Règles, jurisprudence et référentiels de conformité éditoriale.                            |
| `memory-blocks/`         | Blocs de mémoire vive critiques d'Agathe, après extraction et revue.                       |
| `archival/`              | Mémoire archivée utile après tri : décisions, jurisprudence et historique produit.         |

## Convention de nommage

Les chemins source exportés depuis Letta Cloud sont conservés à l'identique dans les métadonnées de provenance :

- frontmatter `original_file_name` et `source_path` ;
- manifeste `_export-manifest.json` (`fileName`, `logicalPath`, `originalFileName`).

Les chemins cible versionnés dans le dépôt peuvent corriger une coquille évidente quand le nom propre sera utilisé par les skills, `qmd` ou la documentation de migration. Dans ce cas, la ressource doit documenter :

- `previous_target_path` ;
- `target_path_normalization_reason` ;
- la correspondance dans `_export-manifest.json`.

Normalisations appliquées :

| Ancien chemin cible                                                       | Chemin cible versionné                                                     | Raison                                                          |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `langage-clair/[Charte éditorial] Réfugiés.info.md`                       | `langage-clair/[Charte éditoriale] Réfugiés.info.md`                       | Correction de la coquille « éditorial » → « éditoriale ».       |
| `langage-clair/[Lexique] administatif maison de la sagesse.md`            | `langage-clair/[Lexique] administratif maison de la sagesse.md`            | Correction de la coquille « administatif » → « administratif ». |
| `langage-clair/[guide dannotation] agent transformateur refugies-info.md` | `langage-clair/[Guide d'annotation] agent transformateur refugies-info.md` | Correction du libellé « dannotation » → « d'annotation ».       |

## Indexation qmd

Les documents de ce dossier ont vocation à être indexés par `qmd` afin d'être utilisés par l'agent Letta Code SDK. `qmd` est un moteur local de recherche documentaire Markdown : l'index est construit sur le poste de développement et n'est pas commité.

### Installation locale

Installer `qmd` sur le poste de développement :

```bash
npm install -g @tobilu/qmd
qmd status
```

Le dépôt cible Node `24.14.0` via Volta. En cas d'erreur native `better-sqlite3` ou `node-llama-cpp`, vérifier que la version Node active correspond bien à celle du dépôt, puis réinstaller `qmd`.

### Construire l'index

```bash
pnpm agent-knowledge:qmd:index
```

Par défaut, le script configure :

- index qmd : `refugies-info-agent-knowledge` ;
- collection qmd : `agent-knowledge` ;
- corpus source : `documentation/agent-migration/agent-knowledge` ;
- masque qmd : `**/*.{md,json,csv}` afin d'inclure les ressources Markdown, JSON et CSV du corpus.

Variables de surcharge :

```bash
QMD_BIN=/chemin/vers/qmd \
QMD_INDEX=refugies-info-agent-knowledge \
QMD_COLLECTION=agent-knowledge \
QMD_MASK='**/*.{md,json,csv}' \
AGENT_KNOWLEDGE_CORPUS_DIR=documentation/agent-migration/agent-knowledge \
pnpm agent-knowledge:qmd:index
```

### Smoke test de recherche

```bash
pnpm agent-knowledge:qmd:smoke
```

Le smoke test reconstruit/met à jour l'index, exécute une recherche lexicale ciblant les champs de session du schéma de métadonnées, puis vérifie que le fichier `memory-blocks/schema-metadata-ri.md` ressort dans les résultats.

Variables utiles pour tester une autre requête :

```bash
QMD_SMOKE_QUERY="conformité éditoriale" \
QMD_SMOKE_EXPECTED_RESULT="memory-blocks/audit-conformite-editoriale-di.md" \
pnpm agent-knowledge:qmd:smoke
```

### Contrat de test skills/corpus/qmd

Avant d'ajouter ou de modifier un skill, lancer le contrat local complet :

```bash
pnpm agent-knowledge:test
```

Cette commande exécute d'abord `pnpm agent-knowledge:validate`, puis un smoke test `qmd` dans un index et une collection de test isolés :

- index qmd de test : `refugies-info-agent-knowledge-test` ;
- collection qmd de test : `agent-knowledge-test`.

Le validateur statique vérifie :

- que les fichiers listés dans `_export-manifest.json` existent dans le corpus ;
- que chaque `resources.targetPath` du manifeste est listé dans `generatedFiles` ;
- que les chemins cible du manifeste sont normalisés en Unicode NFC ;
- que `previousTargetPath` reste différent du chemin cible normalisé ;
- que les références corpus présentes dans les fichiers `skills/*/SKILL.md` pointent vers des fichiers existants.

Le smoke test `qmd` reconstruit ensuite l'index de test et vérifie qu'une recherche lexicale retrouve une ressource attendue. Les variables restent surchargeables pour les cas de test ciblés :

```bash
QMD_BIN=/chemin/vers/qmd \
QMD_INDEX=refugies-info-agent-knowledge-test \
QMD_COLLECTION=agent-knowledge-test \
QMD_SMOKE_QUERY="conformité éditoriale" \
QMD_SMOKE_EXPECTED_RESULT="memory-blocks/audit-conformite-editoriale-di.md" \
pnpm agent-knowledge:test
```

Pour les futures PRs de conversion des skills, les fixtures doivent rester déterministes et locales :

- ajouter les cas d'entrée minimaux près du code de test qui les consomme ;
- référencer les fichiers du corpus par chemin cible versionné, jamais par chemin source Letta Cloud ;
- éviter les embeddings et les modèles distants dans la suite locale par défaut ;
- étendre `agent-knowledge:validate` ou le smoke test `qmd` quand une nouvelle catégorie de référence devient obligatoire.

### Artefacts générés

Les artefacts `qmd` ne doivent pas être commités :

- l'index global qmd est stocké dans le cache utilisateur (`~/.cache/qmd/index.sqlite` sur macOS/Linux) ;
- un éventuel index local `.qmd/` est ignoré par `.gitignore` ;
- les embeddings générés par `qmd embed` restent locaux.

Cette PR configure l'indexation lexicale et le smoke test local. La génération d'embeddings (`qmd embed`) reste volontairement manuelle, car elle dépend des modèles et des dépendances natives disponibles sur le poste.

Pour un déploiement futur de l'agent Letta Code sur GCP, l'index `qmd` devra être traité comme un artefact applicatif : soit construit à l'image/deploy time, soit restauré depuis un volume ou cache persistant compatible avec la version du corpus. Il ne faut pas supposer qu'un conteneur éphémère conservera l'index entre deux déploiements.

## Export Letta Cloud

Le script `agent-knowledge:export` récupère l'export complet de l'agent via l'endpoint fiable `GET /v1/agents/{agent_id}/export`, équivalent SDK de `client.agents.exportFile(agentId)`. Il n'utilise pas les anciennes APIs Letta files/folders, désormais dépréciées.

```bash
PLAYGROUND_LETTA_API_KEY=... PLAYGROUND_AGENT_ID=... pnpm agent-knowledge:export
```

Variables attendues :

- `PLAYGROUND_LETTA_API_KEY` : clé API Playground utilisée uniquement pour l'export.
- `PLAYGROUND_AGENT_ID` : identifiant de l'agent Agathe à exporter.
- `PLAYGROUND_LETTA_BASE_URL` : optionnel, vaut `https://api.letta.com` par défaut.

Ces variables peuvent être passées à la commande ou renseignées dans le `.env` local non versionné.

Le script refuse volontairement de lire `LETTA_API_KEY` ou `LETTA_PROJECT_ID`, afin d'éviter toute confusion avec les environnements applicatifs.

Options utiles :

```bash
pnpm agent-knowledge:export --dry-run
pnpm agent-knowledge:export --from-file /tmp/agathe-export.json
pnpm agent-knowledge:export --output-dir /tmp/agent-knowledge
```

Normalisations appliquées :

- les chemins logiques Letta Cloud sont conservés dans les métadonnées `source_path` et dans le manifeste `_export-manifest.json` ;
- les préfixes Letta Cloud sont rangés dans les dossiers versionnés du corpus (`ressources_langage_clair/*` → `langage-clair/*`, etc.) ;
- la source `ressources_exemples_redaction` est exclue du corpus cible après revue qualité ;
- les PDF sont convertis en Markdown à partir du texte extrait par Letta Cloud ;
- les contenus Markdown restent en Markdown avec frontmatter de traçabilité ;
- les contenus JSON et CSV restent dans leur format textuel natif ;
- le script affiche les compteurs fichiers/chunks, les fichiers exclus et les alertes d'extraction faible, notamment les PDF indexés avec un seul chunk.

## Règles de contribution

- Ne pas commiter de secrets, tokens, clés API ou valeurs d'environnement sensibles.
- Conserver la traçabilité avec les chemins exportés depuis Letta Cloud quand un contenu provient de l'ancien agent.
- Privilégier les formats textuels versionnables (`.md`, `.json`, `.csv`) quand c'est possible.
- Documenter toute normalisation de nom, de format ou de contenu.
- Séparer les connaissances métier stables des instructions techniques propres à Letta Cloud.
