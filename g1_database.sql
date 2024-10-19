--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.4

-- Started on 2024-10-19 14:02:59

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public."Product" DROP CONSTRAINT "Product_CG_id_fkey";
ALTER TABLE ONLY public."Order" DROP CONSTRAINT "Order_PM_id_fkey";
ALTER TABLE ONLY public."Order" DROP CONSTRAINT "Order_C_id_fkey";
ALTER TABLE ONLY public."Order" DROP CONSTRAINT "Order_A_id_fkey";
ALTER TABLE ONLY public."OrderDetail" DROP CONSTRAINT "OrderDetail_P_id_fkey";
ALTER TABLE ONLY public."OrderDetail" DROP CONSTRAINT "OrderDetail_O_id_fkey";
ALTER TABLE ONLY public."Favourite" DROP CONSTRAINT "Favourite_P_id_fkey";
ALTER TABLE ONLY public."Favourite" DROP CONSTRAINT "Favourite_C_id_fkey";
ALTER TABLE ONLY public."CartDetail" DROP CONSTRAINT "CartDetail_P_id_fkey";
ALTER TABLE ONLY public."CartDetail" DROP CONSTRAINT "CartDetail_C_id_fkey";
ALTER TABLE ONLY public."Address" DROP CONSTRAINT "Address_C_id_fkey";
DROP INDEX public."Favourite_C_id_P_id_key";
DROP INDEX public."Customer_C_email_key";
DROP INDEX public."CartDetail_C_id_P_id_key";
ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
ALTER TABLE ONLY public."Product" DROP CONSTRAINT "Product_pkey";
ALTER TABLE ONLY public."Payment" DROP CONSTRAINT "Payment_pkey";
ALTER TABLE ONLY public."Order" DROP CONSTRAINT "Order_pkey";
ALTER TABLE ONLY public."OrderDetail" DROP CONSTRAINT "OrderDetail_pkey";
ALTER TABLE ONLY public."Favourite" DROP CONSTRAINT "Favourite_pkey";
ALTER TABLE ONLY public."Customer" DROP CONSTRAINT "Customer_pkey";
ALTER TABLE ONLY public."Category" DROP CONSTRAINT "Category_pkey";
ALTER TABLE ONLY public."CartDetail" DROP CONSTRAINT "CartDetail_pkey";
ALTER TABLE ONLY public."Address" DROP CONSTRAINT "Address_pkey";
ALTER TABLE public."Product" ALTER COLUMN "P_id" DROP DEFAULT;
ALTER TABLE public."Payment" ALTER COLUMN "PM_id" DROP DEFAULT;
ALTER TABLE public."OrderDetail" ALTER COLUMN "OD_id" DROP DEFAULT;
ALTER TABLE public."Order" ALTER COLUMN "O_id" DROP DEFAULT;
ALTER TABLE public."Favourite" ALTER COLUMN "Fav_id" DROP DEFAULT;
ALTER TABLE public."Customer" ALTER COLUMN "C_id" DROP DEFAULT;
ALTER TABLE public."Category" ALTER COLUMN "CG_id" DROP DEFAULT;
ALTER TABLE public."CartDetail" ALTER COLUMN "CA_id" DROP DEFAULT;
ALTER TABLE public."Address" ALTER COLUMN "A_id" DROP DEFAULT;
DROP TABLE public._prisma_migrations;
DROP SEQUENCE public."Product_P_id_seq";
DROP TABLE public."Product";
DROP SEQUENCE public."Payment_PM_id_seq";
DROP TABLE public."Payment";
DROP SEQUENCE public."Order_O_id_seq";
DROP SEQUENCE public."OrderDetail_OD_id_seq";
DROP TABLE public."OrderDetail";
DROP TABLE public."Order";
DROP SEQUENCE public."Favourite_Fav_id_seq";
DROP TABLE public."Favourite";
DROP SEQUENCE public."Customer_C_id_seq";
DROP TABLE public."Customer";
DROP SEQUENCE public."Category_CG_id_seq";
DROP TABLE public."Category";
DROP SEQUENCE public."CartDetail_CA_id_seq";
DROP TABLE public."CartDetail";
DROP SEQUENCE public."Address_A_id_seq";
DROP TABLE public."Address";
DROP TYPE public."OrderStatus";
DROP SCHEMA public;
--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3507 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 861 (class 1247 OID 16939)
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: tuser
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'DEFAULT',
    'SUCCESS',
    'ERROR'
);


ALTER TYPE public."OrderStatus" OWNER TO tuser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 231 (class 1259 OID 17019)
-- Name: Address; Type: TABLE; Schema: public; Owner: tuser
--

CREATE TABLE public."Address" (
    "A_id" integer NOT NULL,
    "C_id" integer NOT NULL,
    "A_name" character varying(100) NOT NULL,
    "A_phone" character varying(11) NOT NULL,
    "A_street" character varying(255) NOT NULL,
    "A_city" character varying(100) NOT NULL,
    "A_state" character varying(100) NOT NULL,
    "A_postalCode" character varying(20) NOT NULL,
    "A_country" character varying(100) NOT NULL
);


ALTER TABLE public."Address" OWNER TO tuser;

--
-- TOC entry 230 (class 1259 OID 17018)
-- Name: Address_A_id_seq; Type: SEQUENCE; Schema: public; Owner: tuser
--

CREATE SEQUENCE public."Address_A_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Address_A_id_seq" OWNER TO tuser;

--
-- TOC entry 3509 (class 0 OID 0)
-- Dependencies: 230
-- Name: Address_A_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tuser
--

ALTER SEQUENCE public."Address_A_id_seq" OWNED BY public."Address"."A_id";


--
-- TOC entry 229 (class 1259 OID 17012)
-- Name: CartDetail; Type: TABLE; Schema: public; Owner: tuser
--

CREATE TABLE public."CartDetail" (
    "CA_id" integer NOT NULL,
    "C_id" integer NOT NULL,
    "P_id" integer NOT NULL,
    "CA_quantity" integer NOT NULL,
    "CA_price" numeric(65,30) NOT NULL
);


ALTER TABLE public."CartDetail" OWNER TO tuser;

--
-- TOC entry 228 (class 1259 OID 17011)
-- Name: CartDetail_CA_id_seq; Type: SEQUENCE; Schema: public; Owner: tuser
--

CREATE SEQUENCE public."CartDetail_CA_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CartDetail_CA_id_seq" OWNER TO tuser;

--
-- TOC entry 3510 (class 0 OID 0)
-- Dependencies: 228
-- Name: CartDetail_CA_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tuser
--

ALTER SEQUENCE public."CartDetail_CA_id_seq" OWNED BY public."CartDetail"."CA_id";


--
-- TOC entry 217 (class 1259 OID 16946)
-- Name: Category; Type: TABLE; Schema: public; Owner: tuser
--

CREATE TABLE public."Category" (
    "CG_id" integer NOT NULL,
    "CG_name" character varying(255) NOT NULL
);


ALTER TABLE public."Category" OWNER TO tuser;

--
-- TOC entry 216 (class 1259 OID 16945)
-- Name: Category_CG_id_seq; Type: SEQUENCE; Schema: public; Owner: tuser
--

CREATE SEQUENCE public."Category_CG_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Category_CG_id_seq" OWNER TO tuser;

--
-- TOC entry 3511 (class 0 OID 0)
-- Dependencies: 216
-- Name: Category_CG_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tuser
--

ALTER SEQUENCE public."Category_CG_id_seq" OWNED BY public."Category"."CG_id";


--
-- TOC entry 221 (class 1259 OID 16962)
-- Name: Customer; Type: TABLE; Schema: public; Owner: tuser
--

CREATE TABLE public."Customer" (
    "C_id" integer NOT NULL,
    "C_name" character varying(255),
    "C_password" character varying(255),
    "C_email" character varying(255) NOT NULL,
    "C_gender" character varying(10),
    "C_age" integer,
    "T_pnum" character varying(11),
    "C_Role" boolean DEFAULT false
);


ALTER TABLE public."Customer" OWNER TO tuser;

--
-- TOC entry 220 (class 1259 OID 16961)
-- Name: Customer_C_id_seq; Type: SEQUENCE; Schema: public; Owner: tuser
--

CREATE SEQUENCE public."Customer_C_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Customer_C_id_seq" OWNER TO tuser;

--
-- TOC entry 3512 (class 0 OID 0)
-- Dependencies: 220
-- Name: Customer_C_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tuser
--

ALTER SEQUENCE public."Customer_C_id_seq" OWNED BY public."Customer"."C_id";


--
-- TOC entry 233 (class 1259 OID 17028)
-- Name: Favourite; Type: TABLE; Schema: public; Owner: tuser
--

CREATE TABLE public."Favourite" (
    "Fav_id" integer NOT NULL,
    "C_id" integer NOT NULL,
    "P_id" integer NOT NULL
);


ALTER TABLE public."Favourite" OWNER TO tuser;

--
-- TOC entry 232 (class 1259 OID 17027)
-- Name: Favourite_Fav_id_seq; Type: SEQUENCE; Schema: public; Owner: tuser
--

CREATE SEQUENCE public."Favourite_Fav_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Favourite_Fav_id_seq" OWNER TO tuser;

--
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 232
-- Name: Favourite_Fav_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tuser
--

ALTER SEQUENCE public."Favourite_Fav_id_seq" OWNED BY public."Favourite"."Fav_id";


--
-- TOC entry 223 (class 1259 OID 16972)
-- Name: Order; Type: TABLE; Schema: public; Owner: tuser
--

CREATE TABLE public."Order" (
    "O_id" integer NOT NULL,
    "C_id" integer NOT NULL,
    "O_Date_time" timestamp(3) without time zone NOT NULL,
    "O_Total" numeric(65,30) NOT NULL,
    "PM_id" integer NOT NULL,
    "A_id" integer NOT NULL,
    "O_Description" text,
    "O_status" public."OrderStatus" DEFAULT 'DEFAULT'::public."OrderStatus" NOT NULL
);


ALTER TABLE public."Order" OWNER TO tuser;

--
-- TOC entry 225 (class 1259 OID 16982)
-- Name: OrderDetail; Type: TABLE; Schema: public; Owner: tuser
--

CREATE TABLE public."OrderDetail" (
    "OD_id" integer NOT NULL,
    "O_id" integer NOT NULL,
    "P_id" integer NOT NULL,
    "OD_quantity" integer NOT NULL,
    "OD_price" numeric(65,30) NOT NULL
);


ALTER TABLE public."OrderDetail" OWNER TO tuser;

--
-- TOC entry 224 (class 1259 OID 16981)
-- Name: OrderDetail_OD_id_seq; Type: SEQUENCE; Schema: public; Owner: tuser
--

CREATE SEQUENCE public."OrderDetail_OD_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OrderDetail_OD_id_seq" OWNER TO tuser;

--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 224
-- Name: OrderDetail_OD_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tuser
--

ALTER SEQUENCE public."OrderDetail_OD_id_seq" OWNED BY public."OrderDetail"."OD_id";


--
-- TOC entry 222 (class 1259 OID 16971)
-- Name: Order_O_id_seq; Type: SEQUENCE; Schema: public; Owner: tuser
--

CREATE SEQUENCE public."Order_O_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Order_O_id_seq" OWNER TO tuser;

--
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 222
-- Name: Order_O_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tuser
--

ALTER SEQUENCE public."Order_O_id_seq" OWNED BY public."Order"."O_id";


--
-- TOC entry 227 (class 1259 OID 16989)
-- Name: Payment; Type: TABLE; Schema: public; Owner: tuser
--

CREATE TABLE public."Payment" (
    "PM_id" integer NOT NULL,
    "PM_amount" numeric(65,30) NOT NULL,
    "PM_path" character varying(100) NOT NULL,
    "Date_time" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO tuser;

--
-- TOC entry 226 (class 1259 OID 16988)
-- Name: Payment_PM_id_seq; Type: SEQUENCE; Schema: public; Owner: tuser
--

CREATE SEQUENCE public."Payment_PM_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Payment_PM_id_seq" OWNER TO tuser;

--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 226
-- Name: Payment_PM_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tuser
--

ALTER SEQUENCE public."Payment_PM_id_seq" OWNED BY public."Payment"."PM_id";


--
-- TOC entry 219 (class 1259 OID 16953)
-- Name: Product; Type: TABLE; Schema: public; Owner: tuser
--

CREATE TABLE public."Product" (
    "P_id" integer NOT NULL,
    "P_name" character varying(255) NOT NULL,
    "P_description" text,
    "P_quantity" integer NOT NULL,
    "P_price" numeric(65,30) NOT NULL,
    "P_img" character varying(1000),
    "CG_id" integer NOT NULL
);


ALTER TABLE public."Product" OWNER TO tuser;

--
-- TOC entry 218 (class 1259 OID 16952)
-- Name: Product_P_id_seq; Type: SEQUENCE; Schema: public; Owner: tuser
--

CREATE SEQUENCE public."Product_P_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Product_P_id_seq" OWNER TO tuser;

--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 218
-- Name: Product_P_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tuser
--

ALTER SEQUENCE public."Product_P_id_seq" OWNED BY public."Product"."P_id";


--
-- TOC entry 215 (class 1259 OID 16927)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: tuser
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO tuser;

--
-- TOC entry 3304 (class 2604 OID 25826)
-- Name: Address A_id; Type: DEFAULT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Address" ALTER COLUMN "A_id" SET DEFAULT nextval('public."Address_A_id_seq"'::regclass);


--
-- TOC entry 3303 (class 2604 OID 25827)
-- Name: CartDetail CA_id; Type: DEFAULT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."CartDetail" ALTER COLUMN "CA_id" SET DEFAULT nextval('public."CartDetail_CA_id_seq"'::regclass);


--
-- TOC entry 3295 (class 2604 OID 25828)
-- Name: Category CG_id; Type: DEFAULT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Category" ALTER COLUMN "CG_id" SET DEFAULT nextval('public."Category_CG_id_seq"'::regclass);


--
-- TOC entry 3297 (class 2604 OID 25830)
-- Name: Customer C_id; Type: DEFAULT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Customer" ALTER COLUMN "C_id" SET DEFAULT nextval('public."Customer_C_id_seq"'::regclass);


--
-- TOC entry 3305 (class 2604 OID 25831)
-- Name: Favourite Fav_id; Type: DEFAULT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Favourite" ALTER COLUMN "Fav_id" SET DEFAULT nextval('public."Favourite_Fav_id_seq"'::regclass);


--
-- TOC entry 3299 (class 2604 OID 25832)
-- Name: Order O_id; Type: DEFAULT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Order" ALTER COLUMN "O_id" SET DEFAULT nextval('public."Order_O_id_seq"'::regclass);


--
-- TOC entry 3301 (class 2604 OID 25833)
-- Name: OrderDetail OD_id; Type: DEFAULT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."OrderDetail" ALTER COLUMN "OD_id" SET DEFAULT nextval('public."OrderDetail_OD_id_seq"'::regclass);


--
-- TOC entry 3302 (class 2604 OID 25834)
-- Name: Payment PM_id; Type: DEFAULT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Payment" ALTER COLUMN "PM_id" SET DEFAULT nextval('public."Payment_PM_id_seq"'::regclass);


--
-- TOC entry 3296 (class 2604 OID 25835)
-- Name: Product P_id; Type: DEFAULT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Product" ALTER COLUMN "P_id" SET DEFAULT nextval('public."Product_P_id_seq"'::regclass);


--
-- TOC entry 3499 (class 0 OID 17019)
-- Dependencies: 231
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: tuser
--

INSERT INTO public."Address" VALUES (1, 273235621, 'Kawin JJ', '0980798171', '12 หมู่ 5 ต.ทางพูน อ.เฉลิมพระเกียรติ', 'เฉลิมพระเกียรติ', 'นครศรีธรรมราช', '80350', 'Thailand');
INSERT INTO public."Address" VALUES (2, 273235621, 'Kawin JJ', '0980798171', '12 หมู่ 5 ต.ทางพูน อ.เฉลิมพระเกียรติ', 'เฉลิมพระเกียรติ', 'นครศรีธรรมราช', '80350', 'Thailand');
INSERT INTO public."Address" VALUES (3, 1676743469, 'F', '0123456789', 'reer', 'fddfs', 'fsdfds', '12222', 'Tfsd');
INSERT INTO public."Address" VALUES (4, 1510456600, 'cat2', '0887699473', 'adfsghjk', 'dfgh', 'asdfgh', 'sdfghj', 'asdfghjk.');


--
-- TOC entry 3497 (class 0 OID 17012)
-- Dependencies: 229
-- Data for Name: CartDetail; Type: TABLE DATA; Schema: public; Owner: tuser
--

INSERT INTO public."CartDetail" VALUES (26, 1, 2, 2, 50.000000000000000000000000000000);


--
-- TOC entry 3485 (class 0 OID 16946)
-- Dependencies: 217
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: tuser
--

INSERT INTO public."Category" VALUES (1, 'Sports');
INSERT INTO public."Category" VALUES (2, 'Clothes');
INSERT INTO public."Category" VALUES (3, 'Electronics');


--
-- TOC entry 3489 (class 0 OID 16962)
-- Dependencies: 221
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: tuser
--

INSERT INTO public."Customer" VALUES (1, 'admin', 'admin', 'admin@admin.com', 'other', 99, '0999999999', true);
INSERT INTO public."Customer" VALUES (273235621, 'test', '1234', 'kawin2526jj@gmail.com', 'Male', 20, '0922222222', false);
INSERT INTO public."Customer" VALUES (1676743469, 'F', '12345678', 'Test@gmail.com', 'Male', 100, '0000000000', false);
INSERT INTO public."Customer" VALUES (1510456600, '่jukjik', '1234', 'jj@gmail.com', 'Other', 0, '0887699473', false);
INSERT INTO public."Customer" VALUES (1788793909, 'test1001', '12345678', 'a@b.c', 'Female', 5, '0123456789', false);


--
-- TOC entry 3501 (class 0 OID 17028)
-- Dependencies: 233
-- Data for Name: Favourite; Type: TABLE DATA; Schema: public; Owner: tuser
--

INSERT INTO public."Favourite" VALUES (1, 1, 4);
INSERT INTO public."Favourite" VALUES (2, 273235621, 7);


--
-- TOC entry 3491 (class 0 OID 16972)
-- Dependencies: 223
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: tuser
--

INSERT INTO public."Order" VALUES (5, 273235621, '2024-10-16 20:56:34', 240.000000000000000000000000000000, 5, 1, 'หมายเลข order: 111111111111', 'SUCCESS');
INSERT INTO public."Order" VALUES (10, 273235621, '2024-10-16 21:16:42', 675.000000000000000000000000000000, 10, 2, 'slip incorrect', 'ERROR');
INSERT INTO public."Order" VALUES (11, 1510456600, '2024-10-16 21:21:17', 30.000000000000000000000000000000, 11, 4, 'are you sure ', 'ERROR');
INSERT INTO public."Order" VALUES (12, 273235621, '2024-10-16 22:12:26', 80.000000000000000000000000000000, 12, 1, NULL, 'DEFAULT');
INSERT INTO public."Order" VALUES (13, 273235621, '2024-10-16 23:11:52', 875.000000000000000000000000000000, 13, 2, NULL, 'DEFAULT');


--
-- TOC entry 3493 (class 0 OID 16982)
-- Dependencies: 225
-- Data for Name: OrderDetail; Type: TABLE DATA; Schema: public; Owner: tuser
--

INSERT INTO public."OrderDetail" VALUES (9, 5, 6, 2, 240.000000000000000000000000000000);
INSERT INTO public."OrderDetail" VALUES (19, 10, 3, 1, 75.000000000000000000000000000000);
INSERT INTO public."OrderDetail" VALUES (20, 10, 8, 1, 600.000000000000000000000000000000);
INSERT INTO public."OrderDetail" VALUES (21, 11, 4, 2, 30.000000000000000000000000000000);
INSERT INTO public."OrderDetail" VALUES (22, 12, 5, 2, 80.000000000000000000000000000000);
INSERT INTO public."OrderDetail" VALUES (23, 13, 9, 2, 300.000000000000000000000000000000);
INSERT INTO public."OrderDetail" VALUES (24, 13, 2, 3, 75.000000000000000000000000000000);
INSERT INTO public."OrderDetail" VALUES (25, 13, 1, 5, 500.000000000000000000000000000000);


--
-- TOC entry 3495 (class 0 OID 16989)
-- Dependencies: 227
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: tuser
--

INSERT INTO public."Payment" VALUES (1, 9400.000000000000000000000000000000, 'slip/slip-1729012908042-64042095.jpg', '2024-10-16 07:21:48');
INSERT INTO public."Payment" VALUES (2, 2350.000000000000000000000000000000, 'slip/slip-1729013043829-60791499.jpg', '2024-10-16 07:24:04');
INSERT INTO public."Payment" VALUES (3, 2350.000000000000000000000000000000, 'slip/slip-1729013048334-61377891.jpg', '2024-10-16 07:24:04');
INSERT INTO public."Payment" VALUES (4, 900.000000000000000000000000000000, 'slip/slip-1729051944347-525471799.jpg', '2024-10-16 18:12:23');
INSERT INTO public."Payment" VALUES (5, 240.000000000000000000000000000000, 'slip/slip-1729061798730-511838782.png', '2024-10-16 20:56:34');
INSERT INTO public."Payment" VALUES (6, 500.000000000000000000000000000000, 'slip/slip-1729062301216-395316407.png', '2024-10-16 21:04:59');
INSERT INTO public."Payment" VALUES (7, 250.000000000000000000000000000000, 'slip/slip-1729062457439-399058044.png', '2024-10-16 21:07:37');
INSERT INTO public."Payment" VALUES (8, 14400.000000000000000000000000000000, 'slip/slip-1729062514616-748872130.png', '2024-10-16 21:08:34');
INSERT INTO public."Payment" VALUES (9, 17425.000000000000000000000000000000, 'slip/slip-1729062588211-924908424.png', '2024-10-16 21:09:47');
INSERT INTO public."Payment" VALUES (10, 675.000000000000000000000000000000, 'slip/slip-1729063006296-149808461.png', '2024-10-16 21:16:42');
INSERT INTO public."Payment" VALUES (11, 30.000000000000000000000000000000, 'slip/slip-1729063281782-226818912.png', '2024-10-16 21:21:17');
INSERT INTO public."Payment" VALUES (12, 80.000000000000000000000000000000, 'slip/slip-1729066350491-331941519.png', '2024-10-16 22:12:26');
INSERT INTO public."Payment" VALUES (13, 875.000000000000000000000000000000, 'slip/slip-1729069916790-260274550.jpg', '2024-10-16 23:11:52');


--
-- TOC entry 3487 (class 0 OID 16953)
-- Dependencies: 219
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: tuser
--

INSERT INTO public."Product" VALUES (7, 'Laptop', 'High-performance laptop', 8, 800.000000000000000000000000000000, '7.png', 3);
INSERT INTO public."Product" VALUES (6, 'Jacket', 'Warm winter jacket', 10, 120.000000000000000000000000000000, '6.png', 2);
INSERT INTO public."Product" VALUES (3, 'Tennis Racket', 'Lightweight tennis racket', 14, 75.000000000000000000000000000000, '3.png', 1);
INSERT INTO public."Product" VALUES (8, 'Smartphone', 'Latest model smartphone', 24, 600.000000000000000000000000000000, '8.png', 3);
INSERT INTO public."Product" VALUES (4, 'T-Shirt', 'Comfortable cotton t-shirt', 18, 15.000000000000000000000000000000, '4.png', 2);
INSERT INTO public."Product" VALUES (5, 'Jeans', 'Blue denim jeans', 28, 40.000000000000000000000000000000, '5.png', 2);
INSERT INTO public."Product" VALUES (9, 'Headphones', 'Noise-cancelling headphones', 48, 150.000000000000000000000000000000, '9.png', 3);
INSERT INTO public."Product" VALUES (2, 'Football', 'Standard football for matches', 7, 25.000000000000000000000000000000, '2.png', 1);
INSERT INTO public."Product" VALUES (1, 'Bike', 'Green bike for outdoor sports', 0, 100.000000000000000000000000000000, '1.png', 1);


--
-- TOC entry 3483 (class 0 OID 16927)
-- Dependencies: 215
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: tuser
--

INSERT INTO public._prisma_migrations VALUES ('196d5a2a-e751-4bf5-b53f-5bc7885b7593', '69dc369c6707574de8b7817d3fcf351da2e4c2802825de5e8ca79aff4b8b7691', '2024-10-15 17:07:25.024256+00', '20241015170724_init', NULL, NULL, '2024-10-15 17:07:24.908329+00', 1);


--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 230
-- Name: Address_A_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tuser
--

SELECT pg_catalog.setval('public."Address_A_id_seq"', 4, true);


--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 228
-- Name: CartDetail_CA_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tuser
--

SELECT pg_catalog.setval('public."CartDetail_CA_id_seq"', 26, true);


--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 216
-- Name: Category_CG_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tuser
--

SELECT pg_catalog.setval('public."Category_CG_id_seq"', 3, true);


--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 220
-- Name: Customer_C_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tuser
--

SELECT pg_catalog.setval('public."Customer_C_id_seq"', 1, true);


--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 232
-- Name: Favourite_Fav_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tuser
--

SELECT pg_catalog.setval('public."Favourite_Fav_id_seq"', 5, true);


--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 224
-- Name: OrderDetail_OD_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tuser
--

SELECT pg_catalog.setval('public."OrderDetail_OD_id_seq"', 25, true);


--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 222
-- Name: Order_O_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tuser
--

SELECT pg_catalog.setval('public."Order_O_id_seq"', 13, true);


--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 226
-- Name: Payment_PM_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tuser
--

SELECT pg_catalog.setval('public."Payment_PM_id_seq"', 13, true);


--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 218
-- Name: Product_P_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tuser
--

SELECT pg_catalog.setval('public."Product_P_id_seq"', 9, true);


--
-- TOC entry 3325 (class 2606 OID 17026)
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY ("A_id");


--
-- TOC entry 3323 (class 2606 OID 17017)
-- Name: CartDetail CartDetail_pkey; Type: CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."CartDetail"
    ADD CONSTRAINT "CartDetail_pkey" PRIMARY KEY ("CA_id");


--
-- TOC entry 3309 (class 2606 OID 16951)
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("CG_id");


--
-- TOC entry 3314 (class 2606 OID 16970)
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("C_id");


--
-- TOC entry 3328 (class 2606 OID 17033)
-- Name: Favourite Favourite_pkey; Type: CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Favourite"
    ADD CONSTRAINT "Favourite_pkey" PRIMARY KEY ("Fav_id");


--
-- TOC entry 3318 (class 2606 OID 16987)
-- Name: OrderDetail OrderDetail_pkey; Type: CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."OrderDetail"
    ADD CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("OD_id");


--
-- TOC entry 3316 (class 2606 OID 16980)
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("O_id");


--
-- TOC entry 3320 (class 2606 OID 16994)
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY ("PM_id");


--
-- TOC entry 3311 (class 2606 OID 16960)
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("P_id");


--
-- TOC entry 3307 (class 2606 OID 16935)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3321 (class 1259 OID 17035)
-- Name: CartDetail_C_id_P_id_key; Type: INDEX; Schema: public; Owner: tuser
--

CREATE UNIQUE INDEX "CartDetail_C_id_P_id_key" ON public."CartDetail" USING btree ("C_id", "P_id");


--
-- TOC entry 3312 (class 1259 OID 17034)
-- Name: Customer_C_email_key; Type: INDEX; Schema: public; Owner: tuser
--

CREATE UNIQUE INDEX "Customer_C_email_key" ON public."Customer" USING btree ("C_email");


--
-- TOC entry 3326 (class 1259 OID 17036)
-- Name: Favourite_C_id_P_id_key; Type: INDEX; Schema: public; Owner: tuser
--

CREATE UNIQUE INDEX "Favourite_C_id_P_id_key" ON public."Favourite" USING btree ("C_id", "P_id");


--
-- TOC entry 3337 (class 2606 OID 17087)
-- Name: Address Address_C_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_C_id_fkey" FOREIGN KEY ("C_id") REFERENCES public."Customer"("C_id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3335 (class 2606 OID 17082)
-- Name: CartDetail CartDetail_C_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."CartDetail"
    ADD CONSTRAINT "CartDetail_C_id_fkey" FOREIGN KEY ("C_id") REFERENCES public."Customer"("C_id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3336 (class 2606 OID 17077)
-- Name: CartDetail CartDetail_P_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."CartDetail"
    ADD CONSTRAINT "CartDetail_P_id_fkey" FOREIGN KEY ("P_id") REFERENCES public."Product"("P_id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3338 (class 2606 OID 17097)
-- Name: Favourite Favourite_C_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Favourite"
    ADD CONSTRAINT "Favourite_C_id_fkey" FOREIGN KEY ("C_id") REFERENCES public."Customer"("C_id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3339 (class 2606 OID 17092)
-- Name: Favourite Favourite_P_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Favourite"
    ADD CONSTRAINT "Favourite_P_id_fkey" FOREIGN KEY ("P_id") REFERENCES public."Product"("P_id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3333 (class 2606 OID 17057)
-- Name: OrderDetail OrderDetail_O_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."OrderDetail"
    ADD CONSTRAINT "OrderDetail_O_id_fkey" FOREIGN KEY ("O_id") REFERENCES public."Order"("O_id") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3334 (class 2606 OID 17062)
-- Name: OrderDetail OrderDetail_P_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."OrderDetail"
    ADD CONSTRAINT "OrderDetail_P_id_fkey" FOREIGN KEY ("P_id") REFERENCES public."Product"("P_id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3330 (class 2606 OID 17052)
-- Name: Order Order_A_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_A_id_fkey" FOREIGN KEY ("A_id") REFERENCES public."Address"("A_id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3331 (class 2606 OID 17042)
-- Name: Order Order_C_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_C_id_fkey" FOREIGN KEY ("C_id") REFERENCES public."Customer"("C_id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3332 (class 2606 OID 17047)
-- Name: Order Order_PM_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_PM_id_fkey" FOREIGN KEY ("PM_id") REFERENCES public."Payment"("PM_id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3329 (class 2606 OID 17037)
-- Name: Product Product_CG_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tuser
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_CG_id_fkey" FOREIGN KEY ("CG_id") REFERENCES public."Category"("CG_id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3508 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO tuser;


-- Completed on 2024-10-19 14:03:00

--
-- PostgreSQL database dump complete
--

