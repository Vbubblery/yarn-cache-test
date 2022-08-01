# SVG sprite

## Add new icon to the sprite

1. Put your icons to `icons/` directory
2. Enter `yarn run generate:svg-sprite` command from root of the project
to regenerate sprite


## How to use icon

Use `<BaseSVG>` component:
```
<BaseSVG name="cart" size="20" />
```

### Props:
- `name` – name of SVG file in `/icons`
- `size` (optional) – target size of SVG icon


## Discover available icons

1. Regenerate sprite with `yarn run generate:svg-sprite` command
2. Open `/svg/sprite.symbol.html` via browser
