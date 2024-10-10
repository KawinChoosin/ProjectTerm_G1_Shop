# Fullstack Project

**Made by :**
- กวิน ชูสิน 650610745
- กิตปกรณ์ ทองโคตร 650610749
- รวิภา สามห้วย 650610801
- สุรางค์รัตน์ เตมีศักดิ์ 650610816
- ธัญชนก กวีกุล 650615021

## 1. Spinning up database instance using [docker](https://hub.docker.com/).
   
```bash
docker compose up -d --build
```

## 2. Go to TBackend repository

**Install Packages**
```bash
npm i
```

**User Management**
```bash
docker exec -it g1-db bash
```

```bash
psql -U usertest -d g1db
```
- Don't forget to change the password.

```bash
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

**Database Prisma Setup**

```bash
npx prisma migrate dev --name init
```
```bash
npx prisma generate
```

## 3. Go to TProject repository

**Install Packages**
```bash
npm i
```

**Start Dev**
```bash
npm run dev
```
