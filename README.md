# Fullstack Project

**Made by :**

- กวิน ชูสิน 650610745
- กิตปกรณ์ ทองโคตร 650610749
- รวิภา สามห้วย 650610801
- สุรางค์รัตน์ เตมีศักดิ์ 650610816
- ธัญชนก กวีกุล 650615021
<br/>

# SETUP

## 1) Change all .env.example to .env

There are .env.example in 
- **ProjectTerm_G1_Shop** repository
- **TBackend** repository
- **TProject** repository

*** ***Don't forget to change all .env.example into .env*** ***
<br/>
<br/>

## 2) Config .env in TBackend repository

There are **GOOGLE_CID** and **GOOGLE_CS** you need to config.
- **GOOGLE_CID** is for Google OAuth 2.0 **Client ID**
- **GOOGLE_CS** is for Google OAuth 2.0 **Client Secret**
<br/>

## 3) Spinning up database instance using [docker](https://hub.docker.com/).

```bash
docker compose up -d --build
```
<br/>

## 4) Open TBackend terminal

**User Management**

```bash
docker exec -it g1-db bash
```

```bash
psql -U usertest -d g1db
```
*** ***Don't forget to change the password*** ***

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
<br/>

## 5) Open TBackend in intergrated terminal

**If you are deploying, the next code is required**

```bash
docker exec -it g1-backend bash
```

**then (require for both deployment and development)**

```bash
npx prisma migrate dev --name init
```

```bash
npx prisma generate
```

<br/>

## 6) Run backend and dev(only for dev section)

**open TBackend terminal**

```bash
node index.js
```

<br/>

**then open TProject terminal**

```bash
npm run dev
```
<br/>


# Project Structure

## 1. **Tbackend**  
โฟลเดอร์นี้เก็บส่วนหลังบ้าน (backend) ของโปรเจกต์ ซึ่งเป็นโค้ดที่จัดการกับการทำงานของระบบด้านหลัง ไม่ว่าจะเป็นการเชื่อมต่อฐานข้อมูลหรือจัดการ API

- **prisma**  
  โฟลเดอร์ที่เก็บไฟล์ที่เกี่ยวข้องกับ Prisma ORM ที่ใช้ในการเชื่อมต่อและจัดการฐานข้อมูล
  - **migrations**  
    เก็บข้อมูลและไฟล์ที่ใช้ในการเปลี่ยนแปลงโครงสร้างฐานข้อมูล (Database Migrations) เมื่อมีการเปลี่ยนแปลงใน schema ของฐานข้อมูล

- **routes**  
  เก็บไฟล์ที่ใช้ในการกำหนดเส้นทาง (routes) ของ API เช่น การเรียกใช้งาน API ที่เกี่ยวกับผู้ใช้ คำสั่งซื้อ ฯลฯ

- **schemas**  
  เก็บไฟล์ schema ที่ใช้กำหนดโครงสร้างของข้อมูลในระบบ เช่น รูปแบบข้อมูล address

- **slip**  
  เก็บไฟล์ที่เกี่ยวข้องกับ slip หรือการอัปโหลดไฟล์ที่เกี่ยวกับการชำระเงิน (payslip)

- **uploads**  
  เก็บไฟล์ที่ถูกอัปโหลดมาจากฝั่งผู้ดูแลระบบ (admin) ก็คือไฟล์รูปภาพสินค้า

## 2. **Tproject**  
โฟลเดอร์นี้เก็บส่วนหน้าบ้าน (frontend) ของโปรเจกต์ ซึ่งเป็นโค้ดที่แสดงผลหน้าเว็บไซต์และจัดการกับการทำงานที่ผู้ใช้มองเห็น

- **src**  
  โฟลเดอร์ที่เก็บซอร์สโค้ดหลักของโปรเจกต์

  - **components**  
    เก็บ component ย่อย ๆ ที่ใช้สร้างหน้าเว็บ เช่น Banner, Cart, และ Favourite
    - **banner**  
      เก็บรูแภาพสำหรับแทดงในแต่ละ category
    - **cart**  
      เก็บ component ที่ใช้แสดงข้อมูลตะกร้าสินค้าของผู้ใช้
    - **favourite**  
      เก็บ component ที่ใช้แสดงรายการสินค้าที่ผู้ใช้บันทึกเป็นรายการโปรด

  - **context**  
    เก็บโค้ดที่ใช้จัดการ context ของโปรเจกต์ เช่น สถานะของการเข้าสู่ระบบ

  - **page**  
    เก็บไฟล์ของหน้าต่าง ๆ ที่แสดงให้ผู้ใช้เห็น เช่น หน้าสำหรับผู้ดูแลระบบ หน้าลงชื่อเข้าใช้ และหน้าโปรไฟล์ผู้ใช้
    - **admin**  
      เก็บไฟล์ที่เกี่ยวข้องกับหน้าสำหรับผู้ดูแลระบบ (admin) เพื่อจัดการระบบหลังบ้าน
    - **login**  
      เก็บไฟล์ที่ใช้สำหรับแสดงหน้าลงชื่อเข้าใช้ (login) ของผู้ใช้
    - **register**  
      เก็บไฟล์ที่ใช้สำหรับแสดงหน้าลงทะเบียนผู้ใช้ใหม่
    - **user**  
      เก็บไฟล์ที่ใช้แสดงหน้าโปรไฟล์ผู้ใช้ และข้อมูลที่เกี่ยวข้องกับผู้ใช้

