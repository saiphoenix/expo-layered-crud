# Module: `settings`

Appearance (theme), developer tools and app info.

```
settings/
├── index.ts                     public API: SettingsScreen, UiSandboxScreen, settingsRoutes
├── settings.routes.ts
└── features/
    ├── app-settings/            /settings: theme, reset cache, app info
    │   ├── settings-screen.tsx
    │   └── use-reset-server-data.ts   mutation: queryClient.resetQueries()
    └── ui-sandbox/              /ui-sandbox: every UI component on one screen
        └── ui-sandbox-screen.tsx      Primitives · Shared · Modules tabs
```

The UI Sandbox imports `CatalogShowcase` from `@/modules/catalog`. When you add a module with its
own components, export a `<Module>Showcase` and add it to the "Modules" tab.

See the full reference: [catalog module](../catalog/README.md).
