# Smart Campus Room Availability — app

React + TypeScript + Vite. Fictional data only; no network, storage, login or payments.

## Setup, run, test

```text
npm install        # setup
npm run dev        # run: open the printed local URL
npx vitest run     # test: all tests in src/smartcampus.test.ts
npm run build      # type-check and build
```

## Layout (src/)

- `rooms.ts`: `Room` type, `EQUIPMENT`, `ROOMS` (5 rooms). Data only.
- `filter.ts`: `filterRooms` (F1 capacity >= attendees, F2 ALL selected equipment).
- `booking.ts`: `canBook` (AC1-AC5) and `checkRoom` (F3, F5: uses the chosen room's own data).
- `time.ts`: `toMinutes` / `fmt` for the form. No rules.
- `App.tsx`, `components/`: the page. Imports the rules, holds no room data.
