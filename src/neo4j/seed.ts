import { connectToNeo4j, disconnectNeo4j, driver } from './db';
import { createUser, createFriendship} from './models/userRelations';

export async function NeoSeed() {
    await connectToNeo4j();

    // Clear existing graph data so seed is repeatable
    const session = driver.session();
    await session.run('MATCH (n) DETACH DELETE n');
    await session.close();

    // Create users — IDs match the Postgres users table for cross-DB consistency
    await createUser(1, 'hayden', 'hayden@example.com');
    await createUser(2, 'varvara',   'varvara@example.com');
    await createUser(3, 'jake',  'jake@example.com')

    // Create friendships
    await createFriendship(1, 2);
    await createFriendship(2, 3);

    await disconnectNeo4j();
}

//await NeoSeed();
console.log("Added Neo4J data!");