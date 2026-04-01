// Source - https://stackoverflow.com/a/54064268
// Posted by Paul Wasilewski, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-31, License - CC BY-SA 4.0

db.createUser(
    {
        user: "mongo",
        pwd: "mongo",
        roles: [
            {
                role: "readWrite",
                db: "final-project"
            }
        ]
    }
);
