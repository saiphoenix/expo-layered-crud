# Feature: `top-rated`

**User story:** _As a shopper, I see the 10 best-rated products on the Home screen._

A **widget** feature: `<TopRatedCarousel />` fetches its own data (`useTopRatedProducts`), so the
Home module can render it without knowing anything about products. It's exported from the
catalog's public API.

| File                     | Role                                    |
| ------------------------ | --------------------------------------- |
| `index.ts`               | Public API                              |
| `top-rated-carousel.tsx` | Horizontal list with skeleton and error |

This is how modules **compose** each other: one module exports a widget, another places it.

Read more: [Feature-Sliced Design: overview](https://feature-sliced.design/docs/get-started/overview) (see "widgets")
