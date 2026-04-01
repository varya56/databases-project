# final-project

To install dependencies:
```bash
npm install
```

To run:
```bash
node index.ts
```

To add seed data, run:
```bash
npx drizzle-kit push # to push the postgres schema to the database
node ./src/postgres/seed.ts # add seed data
```
