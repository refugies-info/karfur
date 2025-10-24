# AGENTS.md: AI Agent Guidelines for Réfugiés.info

This document provides comprehensive guidance for AI agents (including Claude, Cascade, and other LLMs) working on the Réfugiés.info codebase. It complements the [Constitution](/.specify/memory/constitution.md) and [Contributing Guidelines](./CONTRIBUTING.md).

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Core Principles & Non-Negotiables](#core-principles--non-negotiables)
3. [Monorepo Architecture](#monorepo-architecture)
4. [Technology Stack](#technology-stack)
5. [Code Style & Formatting](#code-style--formatting)
6. [Development Workflow](#development-workflow)
7. [Testing Discipline](#testing-discipline)
8. [Common Tasks & Patterns](#common-tasks--patterns)
9. [Safety & Security](#safety--security)
10. [Accessibility Requirements](#accessibility-requirements)
11. [Multilingual Considerations](#multilingual-considerations)

---

## Project Overview

**Réfugiés.info** is a French government digital service (DIAIR) designed to help refugees navigate administrative processes and access integration resources. The platform serves vulnerable populations across 8 languages (French + 7 refugee languages) and is built on a modern TypeScript monorepo.

**Key Facts:**
- **License**: MIT
- **Governance**: French Ministry of Interior (Ministère de l'Intérieur)
- **Compliance**: RGAA 4 (French accessibility standards), GDPR, DSFR (French government design system)
- **Primary Users**: Refugee populations (mobile-first), social workers, administrators
- **Live Site**: https://refugies.info

---

## Core Principles & Non-Negotiables

### I. Accessibility First (NON-NEGOTIABLE)

**All features MUST meet RGAA 4 standards and maintain compatibility with assistive technologies.**

- Accessibility testing is mandatory before any release
- Features that compromise accessibility will be rejected regardless of other benefits
- Use semantic HTML, ARIA attributes, and keyboard navigation
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Ensure WCAG 2.1 AA color contrast compliance
- All PRs with user-facing changes require accessibility review

**When working on code:**
- Never remove focus styles without providing alternatives
- Use `React.forwardRef` for all components wrapping DSFR elements or native HTML
- Test keyboard navigation and tab order
- Verify ARIA labels and roles are correct

### II. Multilingual by Design

**All content targeting refugees MUST support 8 languages (French + 7 refugee languages).**

- Sections targeting contributors/administrators (Middle Office, Back Office) can be French-only
- Text content must be externalized for translation (use i18n system)
- UI components must handle variable text lengths and RTL languages
- Never hardcode user-facing text in components
- Test with long translations (German, French can be 20-30% longer than English)

### III. Progressive Migration Strategy

**Legacy technologies (Redux, Sagas, SCSS, Pages Router) should be gradually replaced with modern alternatives.**

- New features MUST use modern approaches (Context API, Tailwind CSS, App Router)
- Existing code should be refactored incrementally when working on related features
- Larger refactoring efforts may be prioritized as dedicated tech debt initiatives
- Do not force refactoring unrelated code in the same PR

### IV. Monorepo Consistency

**All packages must follow Turborepo conventions and use pnpm for dependency management.**

- Use `pnpm` for all package operations (never `npm` or `yarn`)
- Shared types go in `@refugies-info/api-types`
- Shared UI components go in `@refugies-info/ui`
- Cross-package dependencies must be explicit and properly versioned
- Use the `~` alias for imports from the lib directory (e.g., `~/lib/search-helpers`)

### V. Government Standards Compliance

**All styling must use DSFR (Système de Design de l'État) components and tokens.**

- Use `react-dsfr` as the primary base for UI components
- Custom styling should extend DSFR rather than replace it
- Maintain the DSFR CSS layer patch for Tailwind compatibility
- Use Tailwind CSS classes mapped to DSFR tokens (colors, spacing, typography)
- No arbitrary values outside DSFR tokens

### VI. Mobile-First and Refugee-Centric UI

**All user interfaces MUST be designed with a mobile-first approach and be fully responsive.**

- Refugee users overwhelmingly access via mobile phones
- Mobile experience is primary; desktop is secondary (for social workers/staff)
- Test on real mobile devices, not just browser DevTools
- Optimize for low-bandwidth scenarios

---

## Monorepo Architecture

### Directory Structure

```
karfur/
├── apps/
│   ├── client/              # Next.js frontend (public-facing)
│   ├── server/              # Express backend (API)
│   ├── mobile/              # React Native mobile app
│   └── storybook/           # Component documentation
├── packages/
│   ├── api-types/           # Shared TypeScript types
│   ├── ui/                  # Shared UI components
│   └── typescript-config/   # Shared TypeScript configs
├── documentation/           # Project documentation
├── migrations/              # Database migrations
├── scripts/                 # Utility scripts
└── .specify/                # Specification & planning artifacts
```

### Package Scopes (for Conventional Commits)

- `api-types` - Changes to `@refugies-info/api-types`
- `client` - Changes to `@refugies-info/client` (Next.js frontend)
- `server` - Changes to `@refugies-info/server` (Express backend)
- `mobile` - Changes to `@refugies-info/mobile` (React Native)
- `storybook` - Changes to `@refugies-info/storybook`
- `ui` - Changes to `@refugies-info/ui` (shared components)
- `workspace` - Root-level changes (package.json, turbo.json, etc.)

### Key Commands

```bash
# Development
pnpm dev                    # Start all services
pnpm dev:client            # Start client + UI
pnpm dev:server            # Start server
pnpm dev:storybook         # Start Storybook + UI

# Building
pnpm build                 # Build all
pnpm build:client          # Build client only (requires dev server running for prerendering)
pnpm build:server          # Build server only

# Testing
pnpm test                  # Run all tests
pnpm test:client           # Test client
pnpm test:server           # Test server

# Linting & Formatting
pnpm lint                  # Lint all (excludes mobile)
pnpm lint:style            # Lint CSS/SCSS
pnpm check:types           # Type check all

# Cleanup
pnpm clean:modules         # Remove all node_modules
pnpm clean:cache           # Clear build artifacts
```

---

## Technology Stack

### Core Requirements

- **Node.js**: 22.x LTS (currently 22.14.0)
- **Language**: TypeScript (all new code MUST be TypeScript)
- **Package Manager**: pnpm 10.18.0
- **Build Tool**: Turborepo

### Application Frameworks

- **Client**: Next.js (App Router preferred for new features)
- **Server**: Express.js
- **Mobile**: React Native (Expo)
- **UI Components**: React DSFR + Tailwind CSS
- **Database**: MongoDB
- **Styling**: Tailwind CSS + DSFR tokens

### Key Dependencies

- `react-dsfr@1.20.2` - French government design system
- `tailwindcss@4.x` - Utility-first CSS
- `typescript@^5.9.2` - Type safety
- `express` - Backend framework
- `next` - Frontend framework
- `mongodb` - Database driver
- `jest` - Testing framework
- `prettier@^3.6.2` - Code formatting
- `turbo@2.5.8` - Monorepo orchestration

---

## Code Style & Formatting

### Prettier Configuration

All code MUST be formatted with Prettier using the project's `.prettierrc`:

```json
{
  "printWidth": 120,
  "quoteProps": "consistent",
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "useTabs": false,
  "endOfLine": "auto",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "always",
  "plugins": ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"]
}
```

**Key Rules:**
- 120 character line width
- 2-space indentation
- Trailing commas on all multi-line structures
- Double quotes for strings
- Semicolons required
- Imports automatically organized

### Conventional Commits

All commits MUST follow the Conventional Commits specification (v1.0.0):

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`

**Scopes:** `api-types`, `client`, `server`, `mobile`, `storybook`, `ui`, `workspace`

**Example:**
```
feat(client): add search filters with Redis caching

- Implement debounced search input
- Add rate limiting middleware
- Cache results with 5-15 min TTL

Closes #123
```

### TypeScript Standards

- **Strict Mode**: All TypeScript files must use `strict: true`
- **No `any`**: Avoid `any` types; use proper typing or `unknown` with type guards
- **Explicit Returns**: Always specify return types for functions
- **Interfaces over Types**: Use `interface` for object shapes (better for declaration merging)
- **Naming**: Use PascalCase for types/interfaces, camelCase for variables/functions

### Import Conventions

```typescript
// ✅ GOOD: Use ~ alias for lib imports
import { searchHelpers } from "~/lib/search-helpers";
import { Button } from "@refugies-info/ui";

// ❌ BAD: Relative paths for lib imports
import { searchHelpers } from "../../../lib/search-helpers";

// ✅ GOOD: Group imports (external, internal, relative)
import React from "react";
import { Button } from "@refugies-info/ui";
import { useSearch } from "~/hooks/useSearch";
import { SearchForm } from "./SearchForm";
```

### Styling Standards

**Tailwind CSS is the first choice for styling:**

```tsx
// ✅ GOOD: Use Tailwind classes
<div className="flex items-center justify-between gap-4 rounded-lg bg-blue-50 p-4">
  <span className="text-lg font-semibold text-gray-900">Title</span>
</div>

// ✅ GOOD: Use DSFR tokens mapped to Tailwind
<Button className="bg-dsfr-primary text-white">Submit</Button>

// ❌ BAD: Arbitrary values outside DSFR tokens
<div style={{ backgroundColor: "#123456", padding: "10px" }}>
  Content
</div>

// ❌ BAD: Create SCSS files for simple styling
// Use Tailwind instead
```

**When to use SCSS/CSS:**
- Complex animations or keyframes
- Global styles applied consistently across the app
- When Tailwind classes cannot achieve the desired styling

---

## Development Workflow

### Branch Strategy

- **Feature branches**: `name/TICKET-123-description` (generated by Linear)
- **Hotfix branches**: `hotfix/[staging|production]/TICKET-123-description`
- **Deployment branches**: Separate per application (client, server, mobile)

### Pull Request Process

1. **Create feature branch** from `dev` branch
2. **Make focused changes** (avoid unrelated refactoring)
3. **Run tests locally**: `pnpm test`
4. **Run linting**: `pnpm lint` and `pnpm lint:style`
5. **Type check**: `pnpm check:types`
6. **Commit with Conventional Commits**: `git commit -m "feat(scope): description"`
7. **Push to fork** and create PR against `dev`
8. **PR title format**: `[scope] description` (e.g., `[client] add search filters`)
9. **Accessibility review**: Required for user-facing changes
10. **Merge when approved**: Use squash merge for clean history

### When Making Code Changes

**Before implementing:**
1. Read the Constitution to understand non-negotiables
2. Check if similar patterns exist in the codebase
3. Verify the change aligns with the tech stack
4. Consider accessibility implications

**During implementation:**
1. Keep changes focused and minimal
2. Follow existing code style and patterns
3. Add descriptive comments for complex logic
4. Update related tests
5. Test in multiple languages (if user-facing)

**After implementation:**
1. Run full test suite: `pnpm test`
2. Run linting: `pnpm lint`
3. Type check: `pnpm check:types`
4. Manual testing on mobile and desktop
5. Accessibility testing (keyboard, screen reader)

---

## Testing Discipline

### Testing Strategy

Follow **narrow integration testing principles** over heavy mocking:

1. **Set up required initial state** (e.g., in test database)
2. **Execute the function under test**
3. **Verify resulting state changes directly** (e.g., query database)

This approach is superior to tests reliant on mocks and spies because it tests real behavior.

**Example Pattern:**
```typescript
describe("dispositif.service", () => {
  it("should update dispositif status and notify Google", async () => {
    // 1. Setup: Create test dispositif
    const dispositif = await createTestDispositif(conn, {
      status: "PUBLISHED",
    });

    // 2. Execute: Update status
    await updateDispositifStatus(dispositif._id, "ARCHIVED");

    // 3. Verify: Check state changed
    const updated = await getDispositif(dispositif._id);
    expect(updated.status).toBe("ARCHIVED");
  });
});
```

### Test Coverage

- **Unit tests**: Pure functions, utilities, helpers
- **Integration tests**: Service layers, database interactions
- **E2E tests**: Critical user flows (search, filtering, authentication)
- **Accessibility tests**: Component rendering, keyboard navigation

### Running Tests

```bash
pnpm test                    # Run all tests
pnpm test:client             # Test client only
pnpm test:server             # Test server only
pnpm test:client -- --watch  # Watch mode
```

---

## Common Tasks & Patterns

### Adding a New Feature

1. **Create specification** (if using .specify workflow)
   - When using spec kit, the `specify` command generates a numbered branch name (e.g., `001-feature-name`)
   - In this case, **reference the Linear issue in the PR description**
2. **Create feature branch**: `git checkout -b name/TICKET-123-feature-name` (or use generated branch from spec kit)
3. **Implement changes** following code style guidelines
4. **Add tests** for new functionality
5. **Update documentation** if needed
6. **Create PR** with clear description
7. **Request accessibility review** for user-facing changes

### Refactoring Legacy Code

- **Incremental approach**: Refactor when working on related features
- **Don't force refactoring**: Keep PRs focused
- **Update tests**: Ensure refactored code is tested
- **Verify behavior**: No functional changes should occur
- **Document decisions**: Explain why refactoring was needed

### Creating Shared UI Components

1. **Check if DSFR component exists** - use/extend it if available
2. **Create in `@refugies-info/ui`** if reusable across apps
3. **Use `React.forwardRef`** for components wrapping DSFR/HTML
4. **Export from package** and document in Storybook
5. **Add Storybook examples** with multilingual/RTL checks
6. **Test accessibility** (keyboard, screen reader, focus management)

**Component Template:**
```typescript
import React from "react";
import { Button as DSFRButton } from "@codegouvfr/react-dsfr/Button";

interface CustomButtonProps
  extends React.ComponentPropsWithoutRef<typeof DSFRButton> {
  variant?: "primary" | "secondary";
}

export const CustomButton = React.forwardRef<
  HTMLButtonElement,
  CustomButtonProps
>(({ variant = "primary", ...props }, ref) => (
  <DSFRButton
    ref={ref}
    className={`custom-button custom-button--${variant}`}
    {...props}
  />
));

CustomButton.displayName = "CustomButton";
```

### Working with MongoDB

**Connection & Queries:**
- Use MongoDB Atlas console for query testing
- Provide queries in format that can be copy-pasted into Atlas
- Use proper MongoDB syntax (not JavaScript)

**Example Query:**
```javascript
// Find all archived dispositifs
db.dispositifs.find({ status: "ARCHIVED" })
```

### Handling Multilingual Content

- **Never hardcode user-facing text** in components
- **Use i18n system** for translations
- **Test with long translations** (German, French)
- **Handle RTL languages** in CSS (use logical properties)
- **Externalize text** for translation workflows

### Managing Dependencies

**Adding packages:**
```bash
pnpm add package-name              # Add to current workspace
pnpm add -w package-name           # Add to root
pnpm add -D package-name           # Add as dev dependency
pnpm add --filter @refugies-info/server package-name  # Add to specific workspace
```

**Updating packages:**
```bash
pnpm update -i                     # Interactive update
pnpm update package-name@latest    # Update specific package
```

**Handling overrides:**
Use `pnpm.overrides` in root `package.json` for version conflicts:
```json
{
  "pnpm": {
    "overrides": {
      "undici": ">=6.21.2",
      "@codegouvfr/react-dsfr": "1.20.2"
    }
  }
}
```

---

## Safety & Security

### API Security

- **Authentication**: All server endpoints must implement proper authentication
- **Authorization**: Verify user permissions before returning data
- **Rate Limiting**: Required for public endpoints
- **Input Validation**: Validate and sanitize all user inputs
- **TSOA Decorators**: Use for API documentation and validation

### Data Protection

- **GDPR Compliance**: All user data handling must comply with GDPR
- **Minimize Data**: Collect only necessary personal information
- **Encryption**: Encrypt sensitive data at rest
- **No Tracking**: No user tracking without explicit consent
- **Audit Logging**: Log sensitive operations for compliance

### Dependency Security

- **Regular Audits**: Dependabot is configured on GitHub to automatically scan for vulnerabilities
- **Use Overrides**: Address vulnerabilities via `pnpm.overrides`
- **Keep Updated**: Update dependencies regularly
- **Check Licenses**: Verify license compatibility (MIT-compatible)

### Environment Variables

- **Never commit secrets**: Use `.env` files (gitignored)
  - Top-level `.env` file for scripts and shared configuration
  - Per-app `.env` files: `apps/client/.env`, `apps/server/.env`, `apps/mobile/.env`
- **Document variables**: List all required env vars in documentation
- **Use defaults carefully**: Only for non-sensitive values
- **Rotate credentials**: Regularly rotate API keys and tokens

---

## Accessibility Requirements

### RGAA 4 Compliance (French Accessibility Standards)

All user-facing features MUST meet RGAA 4 standards:

1. **Semantic HTML**: Use correct HTML elements (`<button>`, `<nav>`, `<main>`, etc.)
2. **ARIA Attributes**: Add `role`, `aria-label`, `aria-describedby` where needed
3. **Keyboard Navigation**: All interactive elements must be keyboard accessible
4. **Focus Management**: Visible focus indicators, logical tab order
5. **Color Contrast**: WCAG AA compliance (4.5:1 for text, 3:1 for graphics)
6. **Text Alternatives**: Images need `alt` text, icons need labels
7. **Form Labels**: All inputs must have associated labels
8. **Error Messages**: Clear, accessible error handling
9. **Screen Reader Testing**: Test with NVDA, JAWS, VoiceOver

### Testing Checklist

- [ ] Keyboard navigation works (Tab, Shift+Tab, Enter, Escape)
- [ ] Focus indicators are visible
- [ ] Screen reader announces content correctly
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Form labels are properly associated
- [ ] Error messages are clear and accessible
- [ ] No focus traps
- [ ] Heading hierarchy is correct
- [ ] Images have descriptive alt text
- [ ] Links have descriptive text (not "click here")
- [ ] Navigation and functionality work with styles disabled

### Component Accessibility

When creating components:

```typescript
// ✅ GOOD: Proper ARIA and semantic HTML
<button
  aria-label="Close dialog"
  onClick={onClose}
  className="rounded-lg hover:bg-gray-100"
>
  <X size={20} />
</button>

// ❌ BAD: No label, poor contrast
<div onClick={onClose} className="cursor-pointer text-gray-400">
  X
</div>

// ✅ GOOD: Form with labels
<label htmlFor="search">Search dispositifs</label>
<input
  id="search"
  type="text"
  aria-describedby="search-help"
  placeholder="Enter keywords"
/>
<span id="search-help">Search by name, category, or location</span>

// ❌ BAD: No label association
<input type="text" placeholder="Search" />
```

---

## Multilingual Considerations

### Supported Languages

1. French (fr)
2. Arabic (ar)
3. Dari (fa)
4. Pashto (ps)
5. Tigrinya (ti)
6. Somali (so)
7. Amharic (am)
8. Ukrainian (uk)

### Implementation Guidelines

**Text Externalization:**
```typescript
// ✅ GOOD: Use i18n
import { useTranslation } from "react-i18next";

export function SearchForm() {
  const { t } = useTranslation();
  return <input placeholder={t("search.placeholder")} />;
}

// ❌ BAD: Hardcoded text
<input placeholder="Search dispositifs" />
```

**Handling Variable Text Lengths:**
- German/French can be 20-30% longer than English
- Use flexible layouts (flexbox, grid)
- Avoid fixed widths for text containers
- Test with longest translations

**RTL Language Support:**
```css
/* ✅ GOOD: Use logical properties */
.container {
  padding-inline: 1rem;
  margin-inline-start: 0;
  text-align: start;
}

/* ❌ BAD: Physical properties */
.container {
  padding-left: 1rem;
  margin-left: 0;
  text-align: left;
}
```

**Testing Multilingual Features:**
- Test with all 8 languages
- Verify text doesn't overflow
- Check RTL rendering (Arabic, Dari, Pashto, Tigrinya)
- Ensure images/icons work in all contexts
- Test number/date formatting per locale

---

## When to Ask for Help

**Consult the team or documentation when:**

1. **Architecture decisions**: Unclear where code should live
2. **Accessibility concerns**: Unsure if implementation meets RGAA 4
3. **Security implications**: Handling sensitive data or authentication
4. **Performance impact**: Changes affecting load time or database queries
5. **Multilingual issues**: Text handling, RTL, locale-specific logic
6. **Breaking changes**: Modifications affecting multiple packages
7. **Database migrations**: Schema changes or data transformations
8. **Deployment concerns**: Changes to build process or environment

---

## Useful Resources

- **Constitution**: `/.specify/memory/constitution.md`
- **Contributing Guide**: `./CONTRIBUTING.md`
- **React DSFR Docs**: https://github.com/codegouvfr/react-dsfr
- **Tailwind CSS**: https://tailwindcss.com
- **Conventional Commits**: https://www.conventionalcommits.org
- **RGAA 4 Standards**: https://www.numerique.gouv.fr/publications/rgaa-accessibilite/
- **GDPR Compliance**: https://gdpr-info.eu/
- **Turborepo Docs**: https://turbo.build

---

## Quick Reference

### Essential Commands

```bash
# Setup
pnpm install                # Install dependencies
pnpm dev                    # Start development

# Development
pnpm lint                   # Check code style
pnpm check:types            # Type checking
pnpm test                   # Run tests
pnpm build                  # Build for production

# Cleanup
pnpm clean:modules          # Remove node_modules
pnpm clean:cache            # Clear build artifacts
```

### File Locations

- **Shared Types**: `packages/api-types/src/**`
- **Shared UI**: `packages/ui/src/**`
- **Frontend**: `apps/client/src/**`
- **Backend**: `apps/server/src/**`
- **Mobile**: `apps/mobile/src/**`
- **Documentation**: `documentation/**`
- **Specifications**: `.specify/**`

### Key Configuration Files

- `.prettierrc` - Code formatting rules
- `turbo.json` - Build pipeline configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `package.json` - Dependencies and scripts

---

**Version**: 1.0.0 | **Last Updated**: October 2025

This document is a living guide. Suggestions for improvements are welcome via pull requests or issues.
