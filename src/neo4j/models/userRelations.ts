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

export async function createTransactionRelationship(
    senderId: number,
    recipientIds: number[],
    amount: number,
    transactionId: string
) {
    const session = driver.session();
    try {
        for (const recipientId of recipientIds) {
            await session.run(
                `MATCH (a:User {userId: $senderId}), (b:User {userId: $recipientId})
                 CREATE (a)-[:SENT_TO {
                     amount: $amount,
                     transactionId: $transactionId,
                     timestamp: datetime()
                 }]->(b)`,
                { senderId, recipientId, amount, transactionId }
            );
        }
    } finally {
        await session.close();
    }
}

export async function getAllUsers() {
    const session = driver.session();
    try {
        const result = await session.run(`MATCH (u:User) RETURN u ORDER BY u.userId`);
        return result.records.map(r => r.get('u').properties);
    } finally {
        await session.close();
    }
}

export async function getFriends(userId: number) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {userId: $userId})-[:FRIENDS_WITH]->(friend:User)
             RETURN friend.userId AS userId, friend.username AS username, friend.email AS email`,
            { userId }
        );
        return result.records.map(r => ({
            userId: r.get('userId'),
            username: r.get('username'),
            email: r.get('email')
        }));
    } finally {
        await session.close();
    }
}

export async function areFriends(userId1: number, userId2: number): Promise<boolean> {
    const session = driver.session();
    try {
        const result = await session.run(
            `RETURN EXISTS {
                MATCH (a:User {userId: $userId1})-[:FRIENDS_WITH]->(b:User {userId: $userId2})
            } AS areFriends`,
            { userId1, userId2 }
        );
        return result.records[0]?.get('areFriends') ?? false;
    } finally {
        await session.close();
    }
}

export async function getFriendRecommendations(userId: number) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {userId: $userId})-[:FRIENDS_WITH]->(friend)-[:FRIENDS_WITH]->(recommended)
             WHERE recommended <> u
             AND NOT (u)-[:FRIENDS_WITH]->(recommended)
             RETURN recommended.userId AS userId, recommended.username AS username, recommended.email AS email,
                    COUNT(friend) AS mutualCount
             ORDER BY mutualCount DESC`,
            { userId }
        );
        return result.records.map(r => ({
            userId: r.get('userId'),
            username: r.get('username'),
            email: r.get('email'),
            mutualFriends: r.get('mutualCount').toNumber()
        }));
    } finally {
        await session.close();
    }
}