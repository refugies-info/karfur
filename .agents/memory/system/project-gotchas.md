---
description: Important warnings, edge cases, and things to watch out for. Lessons learned from past mistakes and project-specific quirks.
limit: 20000
---

## Critical Non-Negotiables

**Accessibility First (RGAA 4)**:
- All features MUST meet French accessibility standards (RGAA 4)
- Accessibility testing mandatory before release
- Never remove focus styles without alternatives
- Use semantic HTML, ARIA attributes, keyboard navigation
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Use `useAnnounce` hook for dynamic updates

**Multilingual by Design**:
- User-facing content MUST support 8 languages
- Never hardcode user-facing text
- Test with long translations (German, French can be 20-30% longer)
- Handle RTL languages (Arabic, Dari, Pashto)
- Use logical CSS properties for RTL support

## DSFR CSS Layer Patch

**Critical**: React DSFR requires a custom patch to work with Tailwind:
- The patch wraps DSFR CSS in a `@layer dsfr {}` block
- Without this, Tailwind and DSFR styles conflict
- When updating `@codegouvfr/react-dsfr`, the patch must be regenerated

**How to update the patch**:
```bash
pnpm patch @codegouvfr/react-dsfr@[version]
# Edit: node_modules/.pnpm_patches/@codegouvfr/react-dsfr@[version]/dsfr/dsfr.min.css
# Add: @layer dsfr { ... wrap all CSS ... }
pnpm patch-commit './node_modules/.pnpm_patches/@codegouvfr/react-dsfr@[version]'
```

## Pre-commit Hooks

**Automatic formatting on commit**:
- Biome auto-formats JS/TS/JSON files
- Stylelint auto-fixes CSS/SCSS
- knip detects unused files/exports

**If commit fails**:
1. Check what changed (hooks modify files in place)
2. Add the auto-formatted changes: `git add .`
3. Commit again

**Bypass only when necessary**: `git commit --no-verify`

## Migration Pitfalls

**Progressive Migration Strategy**:
- Don't force refactoring unrelated code in same PR
- When touching legacy code, prefer incremental updates
- Check which patterns are being migrated:
  - TypeGoose → Zod schemas (ongoing)
  - Redux → Context API (ongoing)
  - SCSS → Tailwind (ongoing)
  - Pages Router → App Router (ongoing)

**Biome vs. AGENTS.md**:
- AGENTS.md still mentions Prettier (outdated)
- Actual config: Biome (line width: 100, not 120)
- Many Biome rules disabled (pragmatic approach for legacy code)

## Build Dependencies

**Client build requires running server**:
- `pnpm build:client` needs server for prerendering
- If build fails, check if dev server is running

**Turbo excludes AI assistant directories**:
- `.gemini/`, `.specify/`, `.windsurf/` excluded from build inputs
- These directories won't trigger rebuilds

## Mobile Development

**React Native Reanimated**:
- Recently upgraded to latest version
- Uses string 'clamp' instead of `Extrapolate.CLAMP` enum
- Custom animations in TagsCarousel

**Android-specific**:
- Gradle daemon, parallel builds, caching enabled
- Watch for gesture handler conflicts

## Security & Environment

**Environment variables**:
- Top-level `.env` for scripts
- Per-app `.env` files: `apps/client/.env`, `apps/server/.env`, `apps/mobile/.env`
- Never commit secrets
- Server has extensive env var requirements (see turbo.json)

## Testing

**Narrow Integration Testing**:
- Prefer testing real behavior over mocks
- Set up required state → Execute → Verify state changes
- Don't rely heavily on spies/mocks

## Zod/Mongoose Type Patching Strategy

**Problem**: `@zodyac/zod-mongoose` has limitations:
- **Unions**: `z.union([z.string(), z.array(...)])` only picks the first type.
- **Records**: `z.record()` is converted to Mongoose `Map` (hard to use in frontend/logic).
- **Nested Optionals**: Optional nested objects with required fields can trigger validation errors.

**Solution**: Use the "Omit & Extend" pattern (Type Patching).

**Pattern**:
1. **Relax Schema**: In the Zod schema, use `z.any()` for problematic fields to satisfy Mongoose generation.
   ```typescript
   export const MySchema = z.object({
     // Relaxed for Mongoose compatibility
     complexField: z.any().optional(),
   });
   ```
2. **Strict Types**: Define the strict type manually.
   ```typescript
   type ComplexFieldType = string | string[] | null;
   ```
3. **Patch Type**: Export a patched type that overrides the relaxed field.
   ```typescript
   type Base = z.infer<typeof MySchema>;
   export type MyModel = Omit<Base, "complexField"> & {
     complexField?: ComplexFieldType;
   } & Document<Types.ObjectId>;
   ```
**When to use**: Whenever `zod-mongoose` fails to handle a valid TS type correctly (Unions, Records, complex nested optionals).
**Never use `z.any()` to solve typing issues** without:
1. Proof of a real library bug (GitHub issue analysis)
2. Or a reproducible test case demonstrating the issue
3. **Always ask Luis for approval** before using `z.any()`

Reason: `z.any()` defeats the purpose of fine-grained typing with Zod. Find proper solutions instead.
