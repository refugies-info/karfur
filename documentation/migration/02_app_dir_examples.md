# App Directory Migration Examples

## 1. Root Layout & Registry (Styled Components)

**`lib/registry.tsx`**
```tsx
'use client'
import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // Only create stylesheet once with lazy initial state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
```

**`app/[locale]/layout.tsx`**
```tsx
import StyledComponentsRegistry from '@/lib/registry'
import { Providers } from './providers' // Your moved providers

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <html lang={locale}>
      <body>
        <StyledComponentsRegistry>
          <Providers>
             {children}
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

## 2. i18n Middleware

**`middleware.ts`**
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['fr', 'en', 'ar', 'ps', 'ru', 'uk', 'ti', 'fa']
const defaultLocale = 'fr'

function getLocale(request: NextRequest) {
  const headers = { 'accept-language': request.headers.get('accept-language') || '' }
  const languages = new Negotiator({ headers }).languages()
  return match(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en/products
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

## 3. Server vs Client Component

**Old `pages/index.tsx` (SSG)**
```tsx
export const getStaticProps = async () => {
    const data = await API.getThemes();
    return { props: { data } }
}
export default function Home({ data }) { ... }
```

**New `app/[locale]/page.tsx` (RSC)**
```tsx
import API from '~/utils/API'

// Simple async component
export default async function Home() {
  // Fetched directly on server
  const data = await API.getThemes()

  return (
    <main>
       <Hero themes={data} />
    </main>
  )
}
```
