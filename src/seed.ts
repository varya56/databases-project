import {PostgresSeed} from "./postgres/seed.ts"
import {MongoSeed} from "./mongo/seed.ts"
import {NeoSeed} from "./neo4j/seed.ts"

async function main() {
    await PostgresSeed();
    await MongoSeed();
    await NeoSeed();
}

await main();
console.log("Seed data added!");