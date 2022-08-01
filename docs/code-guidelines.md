# Code guidelines

A short guide to be incrementally updated as we agree on more conventions to have a less fragmented code base.
For now, the recommendations follow no particular order, but later, they should be split into relevant sections.

This guide is intended to serve as a base line for code reviews related to this project and complements what has already been put in place with the linter and formatter.

- Custom components used globally (in more than one component) should be prefixed with `Base` like `BaseButton`
- If the custom component is used only in one place it should be named after this place like `Home` and `HomeTagDropdown`
- All new components should use the composition API
- All usage of external component library should be enclosed it in a flowlity/base component
- The enclosed components should be prefixed with `Base` like `BaseButton`
- In the `<template>` , the custom components should be `CamelCased` and not `kebab-cased`
- Styling should by default be done with Tailwind and only if not possible in `<style>`
- If the style used by the designer is not yet implemented, we should add it in `tailwind.config.js` in the extended defaults of Tailwind
- Use lazy import on everything that is not required on initial render
- Global (used multiple times across different features, domains, etc.) data interfaces or types should be defined and put into an interface folder at root level.
- Custom interfaces or types should be defined inside a `typings` folder on the same level as the custom `components` one inside the domain or feature folder
- Avoid as much as possible the use of `any` or `unknown` as custom types
- Avoid re-emitting events from grand-children to grand-parents. Use the `v-on="$listeners"` directive instead
- Avoid writing javascript logic in the `<template>` section
- Use the date helper for all date manipulations
- Put all watchers at the end of setup() to avoid double calls
- When destructuring props in setup() use toRefs on the props to make them immutable (to detach them from their origin), it also make them behave as ref() so everything is standardized
- Add `data-testid="XXX` HTML attribute on every user interaction
- Dates should be stored and circulate as strings with this format "YYYY-MM-DD"
