# Global Official Languages Implementation Plan

**Date:** 2026-05-24
**Status:** Draft

## Overview

Add comprehensive support for all global official languages to the existing next-intl i18n implementation. This includes UN official languages, major world languages, and languages with significant global reach.

## Current State

**Currently Supported (5 languages):**

- English (en) - Default
- Spanish (es)
- French (fr)
- German (de)
- Hindi (hi)

**Architecture:**

- next-intl for internationalization
- JSON translation files in `messages/` directory
- Dynamic locale loading from filesystem
- Language switcher component
- Locale-prefixed routing (`/en/...`, `/es/...`, etc.)

## Target Languages to Add

### Priority 1: UN Official Languages (Missing)

- Arabic (ar) - RTL language
- Chinese (zh) - Simplified (zh-CN)
- Russian (ru)

### Priority 2: Major World Languages

- Portuguese (pt) - Brazil (pt-BR)
- Japanese (ja)
- Korean (ko)
- Italian (it)
- Dutch (nl)
- Polish (pl)
- Turkish (tr)

### Priority 3: Regional Official Languages

- Bengali (bn)
- Urdu (ur) - RTL language
- Indonesian (id)
- Vietnamese (vi)
- Thai (th)
- Ukrainian (uk)

**Total Target:** 20 languages (5 existing + 15 new)

## Implementation Plan

### Phase 1: Language Research & Preparation

**Task 1.1: Define locale codes and language metadata**

- Create comprehensive language mapping with:
  - ISO 639-1 codes (2-letter)
  - Native language names
  - English language names
  - RTL/LTR direction
  - Regional variants (if needed)

**Task 1.2: Create language metadata file**

- Create `lib/languages.ts` with comprehensive language data
- Include display names, native names, direction, and regional info

### Phase 2: Translation File Creation

**Task 2.1: Create base translation template**

- Ensure `messages/en.json` has all required keys
- Document translation key structure

**Task 2.2: Create translation files for Priority 1 languages**

- `messages/ar.json` (Arabic - RTL)
- `messages/zh.json` (Chinese - Simplified)
- `messages/ru.json` (Russian)

**Task 2.3: Create translation files for Priority 2 languages**

- `messages/pt.json` (Portuguese)
- `messages/ja.json` (Japanese)
- `messages/ko.json` (Korean)
- `messages/it.json` (Italian)
- `messages/nl.json` (Dutch)
- `messages/pl.json` (Polish)
- `messages/tr.json` (Turkish)

**Task 2.4: Create translation files for Priority 3 languages**

- `messages/bn.json` (Bengali)
- `messages/ur.json` (Urdu - RTL)
- `messages/id.json` (Indonesian)
- `messages/vi.json` (Vietnamese)
- `messages/th.json` (Thai)
- `messages/uk.json` (Ukrainian)

**Note:** Initial translations can be machine-translated with placeholder text, then refined later.

### Phase 3: Core Configuration Updates

**Task 3.1: Update `lib/locales.ts`**

- Add all new locale codes to `localeLabels`
- Include native names and RTL indicators
- Ensure proper sorting

**Task 3.2: Create `lib/languages.ts` (new file)**

```ts
export interface Language {
  code: string
  name: string // English name
  nativeName: string // Native language name
  direction: "ltr" | "rtl"
  region?: string
}

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", direction: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", direction: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", direction: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", direction: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", direction: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", direction: "rtl" },
  { code: "zh", name: "Chinese", nativeName: "中文", direction: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", direction: "ltr" },
  // ... add all others
]
```

**Task 3.3: Update `i18n/routing.ts`**

- No changes needed - dynamically loads from messages directory
- Verify `localePrefix: "as-needed"` is appropriate for 20+ languages

### Phase 4: RTL Support Implementation

**Task 4.1: Add RTL detection utility**

- Create helper function to check if locale is RTL
- Use in layout and components

**Task 4.2: Update `app/[locale]/layout.tsx`**

- Add `dir` attribute to `<html>` based on locale direction
- Ensure proper RTL CSS support

```ts
const direction = languages.find(l => l.code === locale)?.direction ?? "ltr"
<html lang={locale} dir={direction}>
```

**Task 4.3: Add RTL CSS utilities**

- Ensure Tailwind supports RTL (consider `tailwindcss-rtl` plugin if needed)
- Test RTL layout for Arabic and Urdu

### Phase 5: UI Component Updates

**Task 5.1: Redesign language switcher**

- Current button-based UI won't scale to 20 languages
- Implement dropdown/select UI with search
- Group languages by region or category
- Show native language names

**Task 5.2: Update language switcher component**

```tsx
// New design: searchable dropdown
- Search input for filtering languages
- Grouped by: UN Official, Major World, Regional
- Show: Native name + English name
- Highlight current selection
- Keyboard navigation support
```

**Task 5.3: Update header/footer**

- Ensure language switcher fits in header
- Consider moving to dedicated language selection page if needed

### Phase 6: SEO & Sitemap Updates

**Task 6.1: Update `next-sitemap.config.ts`**

- Add all new locales to `alternateRefs`
- Update `transform` function to handle all locales
- Ensure proper priority for each language

**Task 6.2: Update page metadata**

- Ensure all pages generate proper hreflang for all 20 languages
- Update `generateMetadata` functions

**Task 6.3: Test sitemap generation**

- Verify sitemap includes all locale variants
- Check hreflang attributes

### Phase 7: Testing & Validation

**Task 7.1: Test routing for all locales**

- Verify `/[locale]/` routes work for all 20 languages
- Test language switching
- Check fallback to default locale

**Task 7.2: Test RTL languages**

- Verify Arabic and Urdu display correctly
- Check layout direction
- Test text alignment

**Task 7.3: Test language switcher**

- Verify dropdown functionality
- Test search/filter
- Check keyboard navigation

**Task 7.4: Performance testing**

- Measure bundle size impact
- Test build time with 20 translation files
- Consider lazy loading for non-critical languages

### Phase 8: Documentation

**Task 8.1: Update AGENTS.md**

- Document new language support
- Add translation guidelines

**Task 8.2: Create translation guide**

- Document how to add new translations
- Provide translation best practices
- Include tools/resources for translators

**Task 8.3: Update README**

- Add list of supported languages
- Document language switching

## Technical Considerations

### Bundle Size

- 20 translation files will increase bundle size
- Consider dynamic import for translation files
- Evaluate server-side vs client-side translation loading

### Translation Quality

- Initial implementation can use machine translations
- Plan for professional translation review
- Consider community translation contributions

### Maintenance

- 20 languages require ongoing maintenance
- Establish translation update workflow
- Consider translation management system (TMS) integration

### Performance

- Test build time with 20 locales
- Consider static generation for all locales
- Evaluate incremental static regeneration (ISR)

### Accessibility

- Ensure language switcher is keyboard accessible
- Provide proper ARIA labels
- Test with screen readers

## Rollout Strategy

### Phase 1 (Week 1): Core Infrastructure

- Add language metadata
- Create translation files (machine-translated)
- Update core configuration
- Implement RTL support

### Phase 2 (Week 2): UI Updates

- Redesign language switcher
- Update components
- Test RTL languages

### Phase 3 (Week 3): SEO & Testing

- Update sitemap
- Test all routes
- Performance optimization

### Phase 4 (Ongoing): Translation Quality

- Professional translation review
- Community contributions
- Continuous improvement

## Success Criteria

- [x] All 20 languages have translation files
- [x] Language switcher works with all languages
- [x] RTL languages display correctly
- [x] Sitemap includes all locale variants
- [x] Build time remains acceptable (< 5 minutes)
- [x] Bundle size impact is minimal
- [x] All routes work for all locales
- [x] Documentation is updated

## Risks & Mitigations

**Risk:** Build time increases significantly with 20 locales
**Mitigation:** Implement incremental static generation, consider lazy loading

**Risk:** Translation quality is poor with machine translation
**Mitigation:** Phase rollout, prioritize professional translation for key languages

**Risk:** Language switcher UI becomes cluttered
**Mitigation:** Implement searchable dropdown with grouping

**Risk:** RTL layout issues
**Mitigation:** Early testing with Arabic, use RTL CSS utilities

## Dependencies

- next-intl (already installed)
- Tailwind CSS (already installed)
- Potential: tailwindcss-rtl plugin for RTL support
- Potential: Translation management system for ongoing maintenance

## Timeline Estimate

- Phase 1: 3-5 days
- Phase 2: 2-3 days
- Phase 3: 2-3 days
- Phase 4: Ongoing

**Total Initial Implementation:** 7-11 days

## Next Steps

1. Review and approve this plan
2. Begin Phase 1: Language Research & Preparation
3. Create language metadata file
4. Start with Priority 1 languages (UN official)
5. Test incrementally with each language added
