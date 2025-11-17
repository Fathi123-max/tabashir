# Multilingual System Documentation

This document explains how to use and extend the multilingual system implemented for the Tabashir HR Consulting platform.

## Overview

The application now supports both English and Arabic languages with:
- Dynamic language switching
- RTL (Right-to-Left) support for Arabic
- Persistent language preferences
- Easy translation management

## Files Structure

```
111/tabashir_hr_consulting/
├── lib/
│   └── use-translation.ts           # Translation hook and translations
├── public/locales/
│   ├── en/
│   │   └── common.json             # English translations (for future expansion)
│   └── ar/
│       └── common.json             # Arabic translations (for future expansion)
├── app/
│   ├── globals.css                 # RTL support styles
│   └── (candidate)/dashboard/_components/
│       ├── user-profile-header.tsx # Language switcher component
│       └── applied-jobs-card.tsx   # Example translated component
└── MULTILINGUAL_SYSTEM.md          # This documentation
```

## How to Use

### 1. Using Translations in Components

```tsx
import { useTranslation } from "@/lib/use-translation";

export function MyComponent() {
  const { t, language, isRTL } = useTranslation();

  return (
    <div className={isRTL ? 'text-right' : ''}>
      <h1>{t('dashboard')}</h1>
      <button>{t('save')}</button>
    </div>
  );
}
```

### 2. Adding New Translations

Edit the `lib/use-translation.ts` file and add your new keys to both `en` and `ar` objects:

```typescript
const translations = {
  en: {
    // Existing translations...
    myNewKey: "My New Text",
  },
  ar: {
    // Existing translations...
    myNewKey: "النص الجديد",
  }
};
```

### 3. RTL Support

The system automatically handles RTL layout for Arabic. Use the `isRTL` property for conditional styling:

```tsx
<div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
  <span>{t('text')}</span>
  <ArrowRight className={isRTL ? 'rotate-180' : ''} />
</div>
```

### 4. Language Switching

The language switcher is already implemented in the `UserProfileHeader` component. It:
- Saves language preference to localStorage
- Updates document direction and language
- Triggers events for other components to update

## Available Translation Keys

### Navigation
- `dashboard`, `jobs`, `resume`, `appliedJobs`, `likedJobs`, `account`
- `interview`, `courses`, `community`, `services`, `aiJobApply`

### Buttons
- `login`, `register`, `logout`, `save`, `cancel`, `apply`, `submit`
- `edit`, `delete`, `view`, `download`, `upload`, `next`, `previous`
- `back`, `continue`, `finish`, `close`, `confirm`, `search`, `filter`
- `clear`, `refresh`

### Forms
- `firstName`, `lastName`, `email`, `password`, `phone`
- `address`, `city`, `country`

### Status & Messages
- `loading`, `success`, `error`, `pending`
- `welcome`, `noData`, `noResults`

### Language-specific
- `selectLanguage`, `english`, `arabic`, `languagePreference`, `chooseLanguage`

## Adding New Components

1. Add the `"use client"` directive if not already present
2. Import the translation hook: `import { useTranslation } from "@/lib/use-translation"`
3. Use the hook in your component: `const { t, isRTL } = useTranslation()`
4. Replace static text with translation calls: `{t('keyName')}`
5. Add RTL-aware styling using the `isRTL` property

## Example Component Translation

Before:
```tsx
export function MyCard() {
  return (
    <div className="flex items-center">
      <h3>Applied Jobs</h3>
      <button>View Details</button>
    </div>
  );
}
```

After:
```tsx
"use client"

import { useTranslation } from "@/lib/use-translation";

export function MyCard() {
  const { t, isRTL } = useTranslation();

  return (
    <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
      <h3>{t('appliedJobs')}</h3>
      <button>{t('view')} {t('appliedJobs')}</button>
    </div>
  );
}
```

## CSS RTL Support

The system includes automatic RTL styles in `globals.css`:
- Text alignment adjustments
- Flex direction reversal
- Margin adjustments
- Custom RTL utilities

## Future Enhancements

1. **JSON File Loading**: The current system uses inline translations. You can extend it to load from the JSON files in `public/locales/`
2. **More Languages**: Add more language objects to the translations
3. **Pluralization**: Add support for plural forms
4. **Nested Keys**: Support for nested translation keys
5. **Interpolation**: Add support for variable interpolation in translations

## Testing

1. Open the application in your browser
2. Look for the language switcher (flag icon) in the header
3. Click to switch between English and Arabic
4. Observe:
   - Text changes language
   - Layout switches to RTL for Arabic
   - Language preference is saved and persists on refresh

## Troubleshooting

1. **Translations not showing**: Make sure the component has `"use client"` directive
2. **RTL not working**: Check if the component uses the `isRTL` property for conditional styling
3. **Language not persisting**: Verify localStorage is working in your browser
4. **Missing translations**: Check if the translation key exists in both language objects

## Contributing

When adding new features:
1. Always add translation keys for any user-facing text
2. Test both English and Arabic versions
3. Ensure RTL layout works properly
4. Update this documentation if needed 