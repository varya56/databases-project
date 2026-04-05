import 'dotenv/config';
import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
    process.env.NEO4J_URL!,
    neo4j.auth.basic('neo4j', 'password')
);

export async function connectToNeo4j() {
    await driver.verifyConnectivity();
    console.log('Connected to Neo4j.');
    return driver;
}

export async function disconnectNeo4j() {
    await driver.close();
}

export { driver };