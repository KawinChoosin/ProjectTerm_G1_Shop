# Get started

- Make `.env` from `.env.example`

# User management

# User management

- `docker exec -it g1-db bash`
- `psql -U usertest -d g1db`
- Don't forget to change the password.

```
REVOKE CONNECT ON DATABASE g1db FROM public;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
CREATE USER tuser WITH PASSWORD '1234';
GRANT CONNECT ON DATABASE g1db TO tuser;
GRANT USAGE ON SCHEMA public TO tuser;
GRANT CREATE ON SCHEMA public TO tuser;
GRANT ALL ON DATABASE g1db TO tuser;
GRANT ALL ON SCHEMA public TO tuser;
ALTER USER tuser CREATEDB;
```

# Database prisma setup

```
npx prisma migrate dev --name init
npx prisma generate
```

# use zod

- `npm install zod`

# Data Insert and run

```
node test.js
node index.js
```

# UUID generating

```
npm install uuid
```

# JWT generating

```
npm install jsonwebtoken
```

# upload img?

```npm install multer

