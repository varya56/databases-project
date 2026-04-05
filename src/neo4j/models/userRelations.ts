import { driver } from '../db';

export async function createUser(userId: number, username: string, email: string) {
    const session = driver.session();
    try {
        await session.run(
            `MERGE (u:User {userId: $userId})
             SET u.username = $username, u.email = $email`,
            { userId, username, email }
        );
    } finally {
        await session.close();
    }
}

export async function createFriendship(userId1: number, userId2: number) {
    const session = driver.session();
    try {
        await session.run(
            `MATCH (a:User {userId: $userId1}), (b:User {userId: $userId2})
             MERGE (a)-[:FRIENDS_WITH]->(b)
             MERGE (b)-[:FRIENDS_WITH]->(a)`,
            { userId1, userId2 }
        );
    } finally {
        await session.close();
    }
}

export async function getAllUsers() {
    const session = driver.session();
    try {
        const result = await session.run(`MATCH (u:User) RETURN u`);
        return result.records.map(r => r.get('u').properties);
    } finally {
        await session.close();
    }
}