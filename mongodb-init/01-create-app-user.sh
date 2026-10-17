#!/bin/bash
set -e

mongosh \
    --username "$MONGO_INITDB_ROOT_USERNAME" \
    --password "$MONGO_INITDB_ROOT_PASSWORD" \
    --authenticationDatabase admin \
    "$MONGODB_DATABASE" \
    --eval "
    db.createUser({
        user: '$MONGODB_APP_USER',
        pwd: '$MONGODB_APP_PASSWORD',
        roles: [
            {
                role: 'readWrite',
                db: '$MONGODB_DATABASE'
            }
        ]
    });
"
