<!--
Sync Impact Report:
Version change: 1.3.0 → 1.3.1
Amended sections: Compliance Review (DRI changed to CTO)
Templates requiring updates: None
Follow-up TODOs: None
-->

# Réfugiés.info Constitution

## Core Principles

### I. Accessibility First (NON-NEGOTIABLE)
All features MUST meet RGAA 4 (Référentiel Général d'Amélioration de l'Accessibilité) standards and maintain compatibility with assistive technologies. Accessibility testing is mandatory before any release. The platform serves vulnerable populations who rely on accessible design. Features that compromise accessibility will be rejected regardless of other benefits.

**Rationale**: As a French government service serving refugee populations, accessibility is both a legal requirement under French law and moral imperative.

### II. Multilingual by Design
All content targeting refugees MUST support the platform's 8 languages (French + 7 refugee languages). Sections targeting contributors and administrators (e.g., Middle Office, Back Office) are exempt and can be French-only. Text content for multilingual sections must be externalized for translation, and UI components must handle variable text lengths and RTL languages.

**Rationale**: The refugee population requires information in their native languages, while administrative interfaces for French-speaking social workers and staff can be streamlined for a single language.

### III. Progressive Migration Strategy
Legacy technologies (Redux, Sagas, SCSS, Pages Router) should be gradually replaced with modern alternatives (Context API, Tailwind CSS, App Router). New features MUST use modern approaches. Existing code should be refactored incrementally at the developer's discretion when working on related features. Larger refactoring efforts may also be prioritized as dedicated tech debt initiatives.

**Rationale**: Maintains development velocity while improving maintainability and reducing technical debt.

### IV. Monorepo Consistency
All packages must follow Turborepo conventions and use pnpm for dependency management. Shared types go in `@refugies-info/api-types`, shared UI in `@refugies-info/ui`. Cross-package dependencies must be explicit and properly versioned.

**Rationale**: Ensures consistent development experience and enables efficient builds across the entire platform.

### V. Government Standards Compliance
All styling must use DSFR (Système de Design de l'État) components and tokens. Custom styling should extend DSFR rather than replace it. Maintain the DSFR CSS layer patch for Tailwind compatibility.

**Rationale**: Legal requirement for French government digital services and ensures consistent user experience across government platforms.

### VI. Mobile-First and Refugee-Centric UI
All user interfaces MUST be designed with a mobile-first approach and be fully responsive. UI/UX for mobile web browsers should be specifically tailored to the needs of refugee users, as this is their primary access method. Desktop views can be optimized for social workers and administrative staff.

**Rationale**: Refugee users overwhelmingly access the service via mobile phones, making a mobile-optimized experience critical for service delivery. Desktop experiences are secondary and cater to administrative users.

## Security & Privacy Requirements

**Data Protection**: All user data handling must comply with GDPR. Personal information should be minimized and encrypted at rest. No user tracking without explicit consent.

**API Security**: All server endpoints must implement proper authentication and authorization. Use TSOA decorators for API documentation and validation. Rate limiting required for public endpoints.

**Dependency Management**: Regular security audits of dependencies. Use pnpm overrides to address vulnerabilities.

## Technology Standards

**Core Stack**: The platform's active applications (`server`, `client`, `mobile`) are built on a Node.js runtime and a TypeScript codebase. All new code MUST be written in TypeScript.

**Node.js Version**: All services and development environments MUST use the current Long-Term Support (LTS) version of Node.js (currently 22.x).

**Frameworks**: Adherence to the primary frameworks for each application (Express for `server`, Next.js for `client`, React Native for `mobile`) is required unless a migration is formally approved.

## Development Workflow

**Testing Strategy**: Follow narrow integration testing principles over heavy mocking. Test database interactions with real test databases. Unit tests for pure functions, integration tests for service layers.

**Code Quality**: Use Prettier with project configuration (120 char width, consistent quote props). Follow Conventional Commits specification with appropriate scopes (api-types, client, server, mobile, storybook, ui, workspace).

**Review Process**: All PRs with user-facing changes require an accessibility review from a designated specialist. Breaking changes require a constitution compliance check. Performance impact assessment is required for client-side changes.

**Branch Strategy**: Feature branches SHOULD be named using the convention generated by Linear (e.g., `name/TICKET-123-description`). Hotfix branches MUST follow the pattern `hotfix/[staging|production]/TICKET-123-description`. Separate deployment branches for staging and production environments per application (client, server, mobile) are maintained separately.

## Governance

This constitution supersedes all other development practices. All pull requests must verify compliance with these principles. Any deviation requires explicit justification and approval from the technical lead.

**Amendment Process**: Constitution changes require team consensus and impact assessment on existing templates and workflows. Version bumps follow semantic versioning: MAJOR for principle changes, MINOR for new sections, PATCH for clarifications.

**Compliance Review**: The CTO is the DRI for ensuring the following reviews occur: monthly review of adherence to principles, quarterly assessment of technical debt and migration progress, and an annual accessibility audit by external experts.

**Version**: 1.3.1 | **Ratified**: 2025-01-29 | **Last Amended**: 2025-09-29