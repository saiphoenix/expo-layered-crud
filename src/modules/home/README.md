# Module: `home`

The Home tab (`/`). A **composition** module: it owns no API data. It shows widgets and numbers
from other modules' public APIs:

- `TopRatedCarousel`, `useProductCount`, `useCategories`, `catalogRoutes` from `@/modules/catalog`
- `settingsRoutes` from `@/modules/settings`

```
home/
├── index.ts                    public API: HomeScreen
└── features/dashboard/
    ├── index.ts
    └── home-screen.tsx
```

A module can be this small. Start small, and add `data/`, `components/` only when you need them.
See the full reference: [catalog module](../catalog/README.md).
