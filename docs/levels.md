# Level Config System

Levels are defined in `src/js/levels.js` via `LEVEL_DEFINITIONS`.

Each level object has:

- `id`: unique string identifier.
- `name`: display name.
- `map`: array of equal-length strings.

## Supported map tiles

- `#` wall tile (blocks player, enemies, and bullets)
- `.` empty floor tile
- `P` player spawn (required, exactly one recommended)
- `T` turret spawn (zero or more)

Rows are written **top to bottom** in the `map` array.

## Example

```js
{
  id: 'example-level',
  name: 'Example',
  map: [
    '########',
    '#P....T#',
    '#..##..#',
    '########',
  ],
}
```

## Adding a new level

1. Open `src/js/levels.js`.
2. Add a new object to `LEVEL_DEFINITIONS`.
3. Keep all row strings the same length.
4. Include at least one `P` tile.
5. Add walls with `#` where movement/projectiles should be blocked.

The game progresses through the levels in array order, and player death restarts the current level index.
