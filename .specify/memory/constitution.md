<!--
Sync Impact Report:
Version change: Initial → 1.0.0
Added sections: All core principles and governance
Templates requiring updates: ✅ constitution.md created
Follow-up TODOs: None - all placeholders filled
-->

# Réfugiés.info Constitution

## Core Principles

### I. Accessibility First (NON-NEGOTIABLE)
All features MUST meet WCAG 2.1 AA standards and maintain compatibility with assistive technologies. Accessibility testing is mandatory before any release. The platform serves vulnerable populations who rely on accessible design. Features that compromise accessibility will be rejected regardless of other benefits.

**Rationale**: As a French government service serving refugee populations, accessibility is both a legal requirement and moral imperative.

### II. Multilingual by Design
Every user-facing feature MUST support the platform's 8 languages (French + 7 refugee languages). Text content must be externalized for translation. UI components must handle variable text lengths and RTL languages. No hardcoded strings in user interfaces.

**Rationale**: The refugee population requires information in their native languages to effectively navigate French administrative processes.

### III. Progressive Migration Strategy
Legacy technologies (Redux, Sagas, SCSS, Pages Router) should be gradually replaced with modern alternatives (Context API, Tailwind CSS, App Router). New features MUST use modern approaches. Existing code can be refactored incrementally during feature work.

**Rationale**: Maintains development velocity while improving maintainability and reducing technical debt.

### IV. Monorepo Consistency
All packages must follow Turborepo conventions and use pnpm for dependency management. Shared types go in `@refugies-info/api-types`, shared UI in `@refugies-info/ui`. Cross-package dependencies must be explicit and properly versioned.

**Rationale**: Ensures consistent development experience and enables efficient builds across the entire platform.

### V. Government Standards Compliance
All styling must use DSFR (Système de Design de l'État) components and tokens. Custom styling should extend DSFR rather than replace it. Maintain the DSFR CSS layer patch for Tailwind compatibility.

**Rationale**: Legal requirement for French government digital services and ensures consistent user experience across government platforms.

## Security & Privacy Requirements

**Data Protection**: All user data handling must comply with GDPR. Personal information should be minimized and encrypted at rest. No user tracking without explicit consent.

**API Security**: All server endpoints must implement proper authentication and authorization. Use TSOA decorators for API documentation and validation. Rate limiting required for public endpoints.

**Dependency Management**: Regular security audits of dependencies. Use pnpm overrides to address vulnerabilities. Keep Node.js on LTS versions (currently 22.x).

## Development Workflow

**Testing Strategy**: Follow narrow integration testing principles over heavy mocking. Test database interactions with real test databases. Unit tests for pure functions, integration tests for service layers.

**Code Quality**: Use Prettier with project configuration (120 char width, consistent quote props). Follow Conventional Commits specification with appropriate scopes (api-types, client, server, mobile, storybook, ui, workspace).

**Review Process**: All PRs require accessibility review for user-facing changes. Breaking changes require constitution compliance check. Performance impact assessment for client-side changes.

**Branch Strategy**: Feature branches follow `###-feature-name` pattern. Separate deployment branches for staging and production environments per application (client, server, mobile).

## Governance

This constitution supersedes all other development practices. All pull requests must verify compliance with these principles. Any deviation requires explicit justification and approval from the technical lead.

**Amendment Process**: Constitution changes require team consensus and impact assessment on existing templates and workflows. Version bumps follow semantic versioning: MAJOR for principle changes, MINOR for new sections, PATCH for clarifications.

**Compliance Review**: Monthly review of adherence to principles. Quarterly assessment of technical debt and migration progress. Annual accessibility audit by external experts.

**Version**: 1.0.0 | **Ratified**: 2025-01-29 | **Last Amended**: 2025-01-29