---
chunks_embedded: 15
exported_at: "2026-06-08T15:50:31.834Z"
file_id: "file-6"
file_size_bytes: 11826
file_type: "text/x-markdown"
original_file_name: "[guide dannotation] agent transformateur refugies-info.md"
processing_status: "completed"
previous_target_path: "langage-clair/[guide dannotation] agent transformateur refugies-info.md"
target_path_normalization_reason: "Correction du libellé du chemin cible, source Letta Cloud conservée en provenance"
source_id: "source-0"
source_name: "ressources_langage_clair"
source_path: "ressources_langage_clair/ressources_langage_clair/[guide dannotation] agent transformateur refugies-info.md"
total_chunks: 15
weak_extraction_reasons: []
---

# [Guide d'annotation] agent transformateur refugies-info

> Source Letta Cloud : `ressources_langage_clair/ressources_langage_clair/[guide dannotation] agent transformateur refugies-info.md`

# Guide d’annotation pour l’agent transformateur de dispositifs

> **But du guide**
>
> Définir **quoi détecter** et **comment libeller** chaque transformation entre une *version initiale* et une *version retraitée* (vulgarisée) afin d’entraîner / évaluer l’agent. Le périmètre correspond aux pratiques éditoriales de Réfugiés.info : clarté, accessibilité, exactitude, et orientation usager.

---

## 1) Unité d’annotation et principe général

- **Unité** : la *plus petite transformation utile* sur une phrase ou un segment (morceau de phrase, élément de liste, titre). Un même couple (Avant → Après) peut contenir **plusieurs opérations** annotées.
- **Règle d’or** : **préserver le sens** et l’exactitude. Toute addition ou omission doit être **justifiée** par la lisibilité, l’accessibilité ou la cohérence avec l’information d’origine.
- **Orientation** : langage simple, voix active, *vous*, phrases courtes, listes quand il y a des étapes ou des options.

---

## 2) Taxonomie des transformations

La table ci‑dessous aligne les libellés de votre dataset (colonne *Stratégie*) et une **taxonomie stable**. Utilisez la colonne « **Label à utiliser** » pour l’annotation finale.

| Stratégie (dataset) | Label à utiliser | Définition opérationnelle | Déclencheurs / Quand l’utiliser | Exemples (Avant → Après) |
|---|---|---|---|---|
| **Transcription** | **Trans** | Aucune transformation (copie). | Le texte est déjà clair, correct, utile. | *Progresser en français* → *Progresser en français* |
| **Omission** | **OmiSent** / **OmiComp** / **OmiRhe** | Retrait d’éléments non essentiels, redondants ou rhétoriques. | Informations doublons, slogans, périphrases, détails parasites. | *Accompagner l’insertion sociale et professionnelle* → *Être accompagné dans votre insertion* (**OmiRhe** simplifie une formulation institutionnelle). |
| **Compression** | **Comp** | Réduction de longueur **sans perte de sens**. | Phrase trop longue, enchâssée, virgules multiples. | *Cours de français langue professionnelle…* → *Apprendre le vocabulaire professionnel et comprendre les droits du salarié.* |
| **Syntactic** | **Syn** | Réécriture syntaxique : ordre des mots, scission en phrases, passage en liste, uniformisation ponctuation/impératifs. | Phrases à tiroirs, énumérations noyées dans le texte. | *Comprendre les démarches… répondre à un courrier…* → Liste à puces *Comprendre… / Répondre…* |
| **Explanation** | **ExpWor** / **ExpExpr** / **ExpHidCon** / **ExpHidGra** | Explication de jargon, sigles, concepts implicites, grammaire implicite rendue explicite. | Terme technique, sigle, notion supposée connue. | *Je parle de “marchés publics”* → *Je parle de quand des organisations publiques achètent à des entreprises* (**ExpExpr**). |
| **Complement** | **Compl** | Ajout d’une **information manquante** pour comprendre / agir (sujet, cible, condition, fréquence, lieu, lien logique). | Sujet implicite, manque « qui/quoi/où/quand/comment ». | *Permanence d’inscription* → *Inscription chaque mardi de 16h à 17h15* (ajout de créneau) |
| **SynSemantic** | **SynSem** | Paraphrase à **sens équivalent** (synonymes, tournures). | Alléger sans toucher au contenu factuel. | *Gagner en autonomie* → *Être plus autonome* |
| **Transposition** | **Transp** | Changement de **catégorie grammaticale** (verbe ↔ nom, etc.) pour la clarté. | Titre ou consigne plus nette avec un nom/action. | *Accompagner l’insertion…* → *Accompagnement à votre insertion* |
| **Modulation** | **Mod** | Changement d’**angle** : institution‑centré → usager‑centré ; négation → formulation positive ; softening. | Clarifier qui agit, qui bénéficie ; aligner ton « service ». | *Le dispositif propose…* → *Vous pouvez…* |
| **Examples** | **Ex** | Ajout d’**exemples concrets** pour illustrer une notion. | « Activités » / « démarches » trop vagues. | *Faire des activités…* → *Faire du sport, participer à des sorties culturelles, ateliers de cuisine…* |
| **SynAcronyme** | **ExpAcr** | Déplier un sigle **à la première occurrence**. | CIR, OFII, CAF, etc. | *Vous avez 18–25 ans ?* → *Vous avez 18–25 ans et avez signé le Contrat d’Intégration Républicaine (CIR) ?* |

> 🔎 **Notes de tri entre familles proches**
>
> - *Omission* vs *Compression* : si l’on **retire** une info non essentielle → *Omission*. Si l’on **réécrit plus court** à sens égal → *Compression*.
> - *Complement* vs *Explanation* : si l’ajout **définit ou vulgarise** un terme → *Explanation*. S’il **apporte un détail contextuel/actionnable** (fréquence, créneau, lieu, cible…) → *Complement*.
> - *Syntactic* est « structurel » (scinder, lister, ordonner). *SynSemantic* est « lexical/phrastique » (synonymes, tournures). On peut cumuler.

---

## 3) Règles rédactionnelles (à rappeler à l’agent)

1. **Voix usager** : privilégier *vous* et des verbes d’action (ex. *Vous pouvez prendre rendez‑vous*).
2. **Phrases courtes** : ≤ 20 mots quand possible ; une idée par phrase.
3. **Listes** : utiliser des listes à puces pour étapes/options ; chaque puce commence par une **majuscule**, pas de point final sauf phrase complète.
4. **Sigles** : déplier à la **première** occurrence par page/fiche (**ExpAcr**), puis conserver le sigle.
5. **Chiffres / horaires** : formats cohérents (*lun. et jeu. 10h–12h* ; *mardi 16h–17h15*).
6. **Ne pas inventer** : pas d’ajout de données non sourcées ; pas d’interprétation qui change le sens.
7. **Accessibilité** : éviter le jargon ; si inévitable, **ExpWor/ExpExpr**.

---

## 4) Schéma d’annotation (JSONL recommandé)

Chaque couple *Avant/Après* peut produire **n opérations**. Une ligne JSON par opération :

```json
{
  "pair_id": "RI-2025-000123",
  "avant": "Cours de français langue professionnelle permettant…",
  "apres": "Apprendre le vocabulaire professionnel et comprendre les droits du salarié.",
  "span_avant": [0, 68],
  "span_apres": [0, 92],
  "label": "Comp",
  "rationale": "Réduction de longueur sans perte de sens (énumérations condensées).",
  "priority": "obligatoire",  
  "notes": "Pas de perte d’information ; prochaine étape: lister en puces."
}
```

- **pair_id** : identifiant stable du couple.
- **span_*** : index caractères (UTF‑8) du segment concerné (optionnel si annotation au niveau de la phrase entière).
- **label** : un des labels de la section 2.
- **priority** : `obligatoire` (bloquant) ou `suggestion`.
- **rationale / notes** : brève justification pour l’IA.

> Variante compacte (annotation au niveau *phrase entière*) : omettre `span_*`.

---

## 5) Heuristiques « si… alors… » (détection automatique)

- **Si** la phrase contient un **sigle inconnu** → **ExpAcr** et, si besoin, **ExpWor** pour le terme.
- **Si** la phrase > 25–30 mots **ou** comporte plusieurs subordonnées → **Comp** et/ou **Syn** (scission + liste).
- **Si** le **sujet** (qui fait quoi) n’est pas explicite → **Compl** + **Mod** (centrer sur l’usager).
- **Si** des éléments **redondants/slogans** → **OmiRhe**.
- **Si** les items d’une énumération sont noyés → **Syn** (liste) + éventuellement **Ex** (2–3 exemples concrets).
- **Si** un **jargon** apparaît (ex. *marchés publics*) → **ExpExpr**.
- **Si** une tournure institutionnelle (*le dispositif propose*) est dominante → **Mod** (vous + action claire).

---

## 6) Exemples tirés du dataset (anonymisés)

> **Compl (ajout de contexte)**  
> *Avant* : *Permanence d’inscription*  
> *Après* : *Inscription chaque mardi de 16h à 17h15*  
> **Pourquoi** : ajouter **quand** (créneau) pour rendre l’info actionnable.

> **ExpAcr (sigle)**  
> *Avant* : *Vous avez entre 18 et 25 ans ?*  
> *Après* : *Vous avez entre 18 et 25 ans et vous avez signé le Contrat d’intégration républicaine (CIR) ?*  
> **Pourquoi** : première occurrence du sigle.

> **Syn (structuration en liste)**  
> *Avant* : *Comprendre les démarches administratives, répondre à un courrier, savoir solliciter le bon interlocuteur*  
> *Après* :  
> – *Comprendre les démarches administratives du quotidien*  
> – *Répondre à un courrier*  
> – *Savoir quel service contacter*  
> **Pourquoi** : lisibilité (une action par puce).

> **Comp (raccourcir sans perte)**  
> *Avant* : *Cours de français langue professionnelle permettant d’apprendre… et de comprendre le monde du travail en France et les droits et devoirs du salarié*  
> *Après* : *Apprendre le vocabulaire professionnel et comprendre les droits du salarié.*

> **Mod (usager‑centré)**  
> *Avant* : *Le dispositif propose des ateliers…*  
> *Après* : *Vous pouvez participer à des ateliers…*

> **OmiRhe (retirer rhétorique)**  
> *Avant* : *Accompagner l’insertion sociale et professionnelle*  
> *Après* : *Être accompagné dans votre insertion*

---

## 7) Barème qualité & validation

- **Seuil de conformité automatique** : ≥ **85 %** des paires doivent respecter les règles (formats, labels valides, pas d’invention d’info, lisibilité OK).  
- **Contrôles** :
  - *Contrôle structure* : labels présents et dans la liste autorisée ; priorité définie.
  - *Contrôle style* : *vous*, phrases ≤ 20–25 mots, listes correctement formées.
  - *Contrôle exactitude* : pas d’ajout inventé ; sigles dépliés à 1ère occurrence seulement.
- **Désaccord annotateurs** : en cas de multi‑labels possibles, choisir **le label principal** (celui qui explique le mieux l’intention), les autres en `notes`.

---

## 8) Liste des labels autorisés (valeurs)

```
Trans
OmiSent  OmiComp  OmiRhe
Comp
Syn
ExpWor  ExpExpr  ExpHidCon  ExpHidGra  ExpAcr
Compl
SynSem
Transp
Mod
Ex
```

---

## 9) Bonnes pratiques et cas limites

- **N’inventez pas** d’exemples chiffrés, d’adresses, d’horaires : utilisez seulement ceux fournis ; sinon, rester générique (*ex. ateliers, formations…*).
- **ExpAcr** : déplier le sigle **une seule fois** par fiche ; ensuite, garder le sigle.
- **Ex** : limiter à 2–3 exemples pertinents ; éviter les listes à rallonge.
- **Transp** : utile pour titres/menus (*S’informer* → *Informations*), mais ne pas changer la **nature** de l’action quand elle est essentielle.
- **Mod** ne doit **pas** modifier les obligations légales (ex. droits/devoirs). Si besoin d’assouplir le ton, conserver la précision juridique.

---

## 10) Sortie attendue de l’agent

Pour chaque phrase (ou segment), l’agent doit :

1) **Proposer** une version retraitée (si utile),  
2) **Lister** les opérations détectées avec les labels de ce guide,  
3) **Justifier** en une ligne (rationale),  
4) **Signaler** le niveau (obligatoire/suggestion).

Ex. réponse modèle :

```json
{
  "pair_id": "RI-2025-000987",
  "proposition": "Vous pouvez prendre rendez-vous en ligne ou sur place le mardi 16h–17h15.",
  "ops": [
    {"label": "Syn", "rationale": "Scission + liste implicite → phrase claire"},
    {"label": "Compl", "rationale": "Ajout du créneau horaire pour actionner"},
    {"label": "Mod", "rationale": "Formulation usager‑centrée"}
  ]
}
```

---

### Foire aux questions (FAQ rapide)
- **Plusieurs labels sur une même phrase ?** Oui, annoter **chaque** opération utile.
- **Je ne change que la ponctuation ?** → **Syn**.
- **Je développe un sigle et explique le concept** ? → **ExpAcr** + **ExpWor/ExpExpr**.
- **Je retire un bout redondant et raccourcis le reste** ? → **OmiRhe** + **Comp** (2 opérations).

---

*Fin du guide. Version 1.0 – à compléter selon retours d’annotation et erreurs fréquentes observées.*

