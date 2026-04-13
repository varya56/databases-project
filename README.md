# final-project


To install dependencies:
```bash
npm install
```

To run:
```bash
docker compose up -d
npx drizzle-kit push # to push the postgres schema to the database

node index.ts
# or 
npx tsx src/index.ts 
```

To add seed data, run:
```bash
node ./src/seed.ts
# or
npx tsx src/seed.ts
```
