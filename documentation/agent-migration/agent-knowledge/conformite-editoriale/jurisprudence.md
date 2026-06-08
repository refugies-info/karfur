---
chunks_embedded: 10
exported_at: "2026-06-08T15:50:31.834Z"
file_id: "file-14"
file_size_bytes: 7743
file_type: "text/x-markdown"
original_file_name: "jurisprudence.md"
processing_status: "completed"
source_id: "source-3"
source_name: "ressources_conformité_éditoriale"
source_path: "ressources_conformité_éditoriale/ressources_conformité_éditoriale/jurisprudence.md"
total_chunks: 10
weak_extraction_reasons: []
---

# jurisprudence

> Source Letta Cloud : `ressources_conformité_éditoriale/ressources_conformité_éditoriale/jurisprudence.md`

# Périmètre éditorial RI

## 1. Conventionnement

**Est-ce que le dispositif est conventionné ?**

Dans le fichier json, dans le champ extra, consulter la valeur clé de `"conventionnement"`

| **Clé** | **Valeur** | Décision |
| --- | --- | --- |
| `0` | non | refusé |
| `1` | oui | **Accepté** |

## 2. Périmètre Financeur

**Est-ce que le financeur est dans le périmètre fixé par RI ?**

Dans le fichier json, dans le champ extra, consulter la valeur clé de `"code-financeur"`

| **Clé** | **Valeur** | Décision |
| --- | --- | --- |
| `0` | Autre | refusé |
| `1` | Code(s) obsolète(s) | refusé |
| `2` | Collectivité territoriale - Conseil régional | **Accepté**  |
| `3` | Fonds européens - FSE | **Accepté**  |
| `4` | Pôle emploi | refusé |
| `5` | Entreprise | refusé |
| `6` | ACSÉ (anciennement FASILD) | refusé |
| `7` | AGEFIPH | refusé |
| `8` | Collectivité territoriale - Conseil général | **Accepté**  |
| `9` | Collectivité territoriale - Commune | **Accepté**  |
| `10` | Bénéficiaire de l’action | refusé |
| `11` | Etat - Ministère chargé de l’emploi | **Accepté**  |
| `12` | Etat - Ministère de l’éducation nationale | **Accepté**  |
| `13` | Etat - Autre | **Accepté**  |
| `14` | Fonds européens - Autre | refusé |
| `15` | Collectivité territoriale - Autre | **Accepté**  |
| `16` | OPCO | refusé |
| `17` | Transition Pro | refusé |
| `18` | LADOM | refusé |
| `19` | État - Ministère de l’intérieur | **Accepté**  |
| `20` | OFII - Office français de l’immigration et de l’intégration | refusé |

## 3. Périmètre public

**Est-ce que le type de dispositif correspond au public visé par RI ?**

Dans le fichier json, dans le champ extra, consulter la ou les valeur(s) clé(s) de `"code-public-vise"`

| Clé | Texte | Décision |
| --- | --- | --- |
| `82055` | Agent de la fonction publique | Refusé |
| `82020` | Apprenti | Refusé |
| `82004` | Artisan | Refusé |
| `81099` | Autre public | Refusé |
| `81069` | Bénévole | Refusé |
| `82045` | Cadre | Refusé |
| `82012` | Chef d'entreprise | Refusé |
| `82009` | Commerçant | Refusé |
| `81060` | Conjoint collaborateur d'artisan | Refusé |
| `81062` | Conjoint collaborateur d'exploitant agricole | Refusé |
| `82068` | Conseiller salarié | Refusé |
| `82010` | Créateur entreprise | Refusé |
| `82069` | Délégué syndical | Refusé |
| `81014` | Élu | Refusé |
| `82064` | Élu local | Refusé |
| `82047` | Employé | Refusé |
| `82015` | Enseignant | Refusé |
| `81030` | Etudiant | Refusé |
| `82049` | Expatrié | Refusé |
| `82017` | Exploitant agricole, salarié agricole | Refusé |
| `81018` | Femme | Refusé |
| `82016` | Formateur | Refusé |
| `81020` | Handicapé | Refusé |
| `82048` | Ingénieur | Refusé |
| `81032` | Jeune | Refusé |
| `82018` | Maître d'apprentissage | Refusé |
| `82066` | Membre élu du CSE | Refusé |
| `81050` | Particulier, individuel | Refusé |
| `82038` | Profession libérale | Refusé |
| `81021` | Public analphabète | **Accepté**  |
| `81061` | Public de la formation initiale | Refusé |
| `82058` | Public en emploi | Refusé |
| `81043` | Public en situation d'illectronisme | **Accepté**  |
| `81019` | Public en situation d'illettrisme | **Accepté**  |
| `81022` | Public immigré | **Accepté**  |
| `81031` | Public plan investissement compétences | Refusé |
| `81042` | Public réfugié | **Accepté**  |
| `80001` | Public sans emploi | Refusé |
| `81013` | Public sous main de justice | Refusé |
| `82057` | Repreneur entreprise | Refusé |
| `82067` | Représentant section syndicale | Refusé |
| `82044` | Salarié | Refusé |
| `82046` | Salarié de l'artisanat | Refusé |
| `81058` | Sportif haut niveau | Refusé |
| `81059` | Stagiaire formation professionnelle | Refusé |
| `83056` | Tout public | Refusé |
| `82060` | Travailleur étranger | **Accepté**  |
| `82061` | Travailleur handicapé | Refusé |
| `82062` | Travailleur intermittent | Refusé |
| `82063` | Travailleur saisonnier | Refusé |
| `82080` | Travailleur social | Refusé |
| `82019` | Tuteur | Refusé |
| `81023` | Primo-arrivant | **Accepté** |

## 4. Périmètre dispositif

**Est-ce que le type de dispositif rentre dans le périmètre RI ?**

| Type de dispositif | Subtilités, commentaires, précisions | Décision |
| --- | --- | --- |
| Dispositifs à but lucratif (payant) | Exception possible si subventionné (ex. BOP 104) et gratuit pour les utilisateurs | Refusé |
| Dispositifs éphémères | Pas de publication si action unique. Accepté si pérennisation ou récurrence | Cas par cas |
| Dispositifs sur orientation | Modalités d’accès à préciser clairement pour orienter le bon public | **Accepté** |
| Dispositifs pour publics hors périmètre | Ex. MNA → hors public cible [Réfugiés.info](http://xn--rfugis-bvae.info/) | Refusé |
| MFS et conseillers numériques France Services | Présentation possible dans une fiche démarche | Refusé |
| Actions de plaidoyer | Objectif non aligné avec [Réfugiés.info](http://xn--rfugis-bvae.info/) (informer sur démarches/actions utiles) | Refusé |
| Dispositifs uniquement destinés aux professionnels | Ne concerne pas directement les bénéficiaires | Refusé |
| Formations très spécialisées | Si public très large ou forte utilité → Accepté | Cas par cas |
| Appels à bénévolat | Si intégrés dans une fiche organisation + valeur ajoutée | **Accepté** |
| Appels aux dons | Si seuls. Accepté si accompagnent un dispositif pertinent | Refusé |
| Présentations d’outils numériques pour travailleurs sociaux | Utilité indirecte pour réfugiés → non conforme | Refusé |
| Ressources documentaires hors action concrète | Accepté si guide pratique utile au public | Cas par cas |
| Dispositifs non gratuits | Accepté si gratuit pour réfugiés ou dispositif d’aide financière associé | Cas par cas |
| Offres d’emploi | Trop ponctuel. Possible via fiches emploi si récurrent et structuré | Refusé |
| Dispositifs déjà largement documentés | Accepté si apport spécifique, simplification, ciblage | Cas par cas |
| Dispositifs insuffisamment décrits | Contact avec l’organisation nécessaire avant publication | Refusé |
| Dispositif ne respectant pas les valeurs [Réfugiés.info](http://xn--rfugis-bvae.info/) | Discrimination, prosélytisme, risque éthique, etc. | Refusé |
| Dispositif avec contenu obsolète | Si pas mis à jour après contact | Refusé |
| Dispositifs de droit commun | Si utiles, accessibles et pertinents pour les réfugiés | **Accepté** |
| Dispositifs strictement internes à une structure | Non accessibles au public | Refusé |
| Dispositifs demandant un prépaiement | Vérifier absence de risque financier pour le public | Cas par cas |

## 5. Durée

**Est-ce que le type de dispositif a une durée égale ou supérieure à 20 jours ?**

La durée du dispositif doit être égale ou supérieure à 20 jours : 

Dans le fichier json, dans le champ extra, consultez : 

`"periode": {
"fin": "date",
"debut": "date"`

La date affichée est `”20241218"` soit un format [`Année Mois Jour`] 

Pour déterminer la durée, tu dois prendre la date `"debut"` et la date `"fin"` et calculer le nombre de jours. 

| Condition | Décision |
| --- | --- |
| Si ce nombre de jours est égal ou supérieur à 20 | **Accepté** |
| Si ce nombre de jours est inférieur à 20 | Refusé |

## 6. Volume d’heures

**Est-ce que le type de dispositif a un volume d’heures égal ou supérieur à 20 heures ?**

Le volume d’heures total doit être égal ou supérieur à 20 heures : 

Dans le fichier json, dans le champ extra, consultez : 

`"duree-indicative"` ?
