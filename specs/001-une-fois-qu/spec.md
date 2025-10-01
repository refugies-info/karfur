# Feature Specification: Publication de fiches validées sans traduction obligatoire

**Feature Branch**: `001-une-fois-qu`  
**Created**: 2025-10-01  
**Status**: Draft  
**Input**: User description: "Une fois qu'une fiche est validée, selon le processus actuel, elle doit passer par la traduction avant d'être publiée sur le site internet. On souhaite désormais permettre de publier une fiche sur le site internet sans forcement passer par la traduction sans que cela affecte le pourcentage de traduction de la langue en question sur le site."

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies  
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
Un administrateur valide une fiche (dispositif) en français. Actuellement, cette fiche doit obligatoirement être traduite dans toutes les langues cibles avant d'être publiée sur le site public. Avec cette fonctionnalité, l'administrateur pourra choisir de publier immédiatement la fiche en français uniquement, sans attendre les traductions. Les visiteurs du site verront la fiche en français, et le pourcentage de traduction affiché pour les autres langues ne sera pas affecté négativement par cette publication anticipée.

### Acceptance Scenarios
1. **Given** une fiche validée en français non traduite, **When** l'administrateur choisit de publier sans traduction, **Then** la fiche apparaît sur le site public en français uniquement
2. **Given** une fiche publiée sans traduction, **When** un visiteur consulte le site dans une autre langue (ex: arabe), **Then** la fiche apparaît en français avec une bannière d'information affichant "Pourquoi cette fiche n'est pas traduite" avec un lien vers une popup descriptive
3. **Given** une fiche publiée sans traduction, **When** le système calcule le pourcentage de traduction pour une langue, **Then** cette fiche n'est pas comptabilisée dans le calcul (ni comme traduite, ni comme non traduite)
4. **Given** une fiche publiée sans traduction, **When** une traduction est ajoutée ultérieurement, **Then** la fiche devient disponible dans cette langue et est comptabilisée dans le pourcentage de traduction
5. **Given** une fiche en cours de traduction partielle (ex: 3 langues sur 7), **When** l'administrateur publie sans attendre les 4 autres traductions, **Then** la fiche est visible sur le site dans toutes les langues (affichée en français pour les langues non traduites, dans la langue cible pour les langues traduites)

### Edge Cases
- Que se passe-t-il si une fiche publiée sans traduction est ensuite dépubliée puis republiée?
- Comment gérer les fiches qui ont des traductions partielles (certaines langues traduites, d'autres non)?
- Tous les administrateurs ont le droit de publier sans traduction (pas de rôle spécifique requis)
- Aucune limite de temps - une fiche peut rester publiée sans traduction indéfiniment
- Comment les statistiques de traduction globales du site sont-elles affectées?

## Requirements *(mandatory)*

### Functional Requirements

#### Publication sans traduction
- **FR-001**: Le système DOIT permettre aux administrateurs de publier une fiche validée sans attendre que toutes les traductions soient complétées
- **FR-002**: Le système DOIT permettre de publier une fiche avec traductions partielles (certaines langues traduites, d'autres non)
- **FR-003**: Les administrateurs DOIVENT pouvoir identifier visuellement quelles fiches sont publiées sans traduction complète dans le backoffice (via filtres et indicateurs)

#### Calcul des pourcentages de traduction
- **FR-004**: Le système DOIT exclure les fiches publiées sans traduction du calcul du pourcentage de traduction pour chaque langue
- **FR-005**: Le système DOIT inclure automatiquement une fiche dans le calcul de traduction dès qu'une traduction est ajoutée pour une langue donnée
- **FR-006**: Le système DOIT maintenir un historique de l'état de traduction des fiches pour les besoins d'audit et de reporting

#### Affichage public
- **FR-007**: Les fiches publiées DOIVENT être visibles sur le site public dans toutes les langues, même si elles ne sont pas traduites
- **FR-008**: Lorsqu'une fiche n'est pas traduite dans la langue consultée, le système DOIT afficher le contenu en français
- **FR-009**: Le système DOIT afficher une bannière d'information en haut de la fiche avec le message "Pourquoi cette fiche n'est pas traduite" et un lien vers une popup explicative

#### Gestion des traductions ultérieures
- **FR-010**: Le système DOIT permettre d'ajouter des traductions à une fiche déjà publiée sans traduction
- **FR-011**: Le système DOIT rendre automatiquement disponible une fiche dans une langue dès que sa traduction est complétée et validée
- **FR-012**: Le système DOIT notifier tous les administrateurs via Slack quand une traduction est ajoutée à une fiche publiée sans traduction

#### Permissions et contrôles
- **FR-013**: Tous les utilisateurs avec le rôle "administrateur" DOIVENT pouvoir publier une fiche sans traduction complète (pas de permission spécifique requise)
- **FR-014**: Le système DOIT enregistrer dans les logs qui a publié une fiche sans traduction et quand
- **FR-015**: Aucune limite n'est imposée sur le nombre de fiches publiées sans traduction ou leur durée de publication

#### Indicateurs et reporting
- **FR-016**: Le système DOIT fournir des statistiques sur le nombre de fiches publiées sans traduction complète
- **FR-017**: Le système DOIT permettre de filtrer/rechercher les fiches publiées sans traduction dans le backoffice
- **FR-018**: Aucune alerte ou rappel automatique n'est requis pour inciter à compléter les traductions manquantes

### Key Entities

- **Fiche (Dispositif)**: Contenu informatif destiné aux réfugiés. Possède un statut de validation, un statut de publication, et des traductions dans plusieurs langues. Peut être publiée même si toutes les traductions ne sont pas complétées.

- **Traduction**: Version linguistique d'une fiche. Possède un statut (en cours, validée, publiée), une langue cible, et est liée à une fiche source. Une traduction peut être ajoutée après la publication de la fiche source.

- **Statut de publication**: Le statut "Publié" existant reste inchangé. Un attribut/flag séparé sera utilisé pour marquer les fiches qui n'ont pas vocation à être traduites (et donc doivent être exclues du calcul de pourcentage de traduction).

- **Pourcentage de traduction**: Métrique calculée par langue indiquant le taux de fiches traduites. Le calcul doit exclure les fiches publiées sans traduction pour cette langue spécifique.

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain ✅ **All clarifications resolved**
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

### Constitutional Compliance
- [x] Accessibility requirements explicitly defined (RGAA 4) - Pas d'impact majeur, utilisation des composants existants
- [x] Multilingual support considered for refugee-facing content - **Core feature**: gestion des traductions partielles
- [x] DSFR design system compatibility noted - Utilisation des composants existants pour les indicateurs
- [x] GDPR compliance implications addressed - Logs de publication (données d'audit standard)
- [x] Mobile-first, responsive design with refugee-centric UX specified - Indicateurs de langue disponibles doivent être clairs sur mobile
- [x] UI composition follows react-dsfr standards and component reusability guidelines - Réutilisation des composants d'indicateurs existants

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted: publication anticipée, traductions partielles, calcul de pourcentages, affichage multilingue
- [x] Ambiguities marked: 9 clarifications identifiées
- [x] User scenarios defined: 5 scénarios d'acceptation + edge cases
- [x] Requirements generated: 18 exigences fonctionnelles organisées en 5 catégories
- [x] Entities identified: 4 entités clés (Fiche, Traduction, Statut, Pourcentage)
- [x] Review checklist passed: ✅ **SUCCESS** - All clarifications resolved

---

## Summary & Next Steps

### Specification Status
✅ **Specification complete** with identified clarifications needed before planning phase.

### Key Clarifications Required (9 total)

**Critical (block implementation):**
1. Permissions requises pour publier sans traduction (FR-013)
2. Nouveau modèle de statut de publication nécessaire? (Key Entities)

**Important (affect scope):**
3. Type d'indicateur visuel pour fiches non traduites (FR-009, Scenario 2)
4. Qui notifier lors de l'ajout de traductions? (FR-012)
5. Règles métier sur le nombre de fiches sans traduction? (FR-015)
6. Système d'alertes pour traductions manquantes? (FR-018)

**Nice-to-have (can be deferred):**
7. Historique de l'état de traduction - cas d'usage? (FR-006)
8. Indicateurs visuels dans quelle interface? (FR-003)
9. Comportement lors de dépublication/republication (Edge case)

**✅ Resolved:**
- ~~Comportement d'affichage pour visiteurs non-francophones~~ → Les fiches sont toujours visibles en français
- ~~Gestion des traductions partielles~~ → Clarifiée dans le scénario 5

### Recommended Next Action
Use `/clarify` workflow to resolve critical clarifications before proceeding to `/plan`.
