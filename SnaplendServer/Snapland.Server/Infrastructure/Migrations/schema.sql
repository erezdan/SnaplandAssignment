--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-08-11 12:58:44

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16390)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 5741 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 17476)
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 17697)
-- Name: area_versions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.area_versions (
    id uuid NOT NULL,
    area_id uuid NOT NULL,
    version_number integer DEFAULT 1 NOT NULL,
    name character varying(255) NOT NULL,
    geometry public.geometry(Polygon,4326) NOT NULL,
    edited_by_user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.area_versions OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17683)
-- Name: areas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.areas (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    geometry public.geometry(Polygon,4326) NOT NULL,
    created_by_user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    area_km2 double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public.areas OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 17675)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    display_name character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    password_hash text DEFAULT ''::text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 5575 (class 2606 OID 17480)
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- TOC entry 5581 (class 2606 OID 17705)
-- Name: area_versions area_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.area_versions
    ADD CONSTRAINT area_versions_pkey PRIMARY KEY (id, area_id);


--
-- TOC entry 5579 (class 2606 OID 17691)
-- Name: areas areas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_pkey PRIMARY KEY (id);


--
-- TOC entry 5577 (class 2606 OID 17682)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5582 (class 1259 OID 17718)
-- Name: uq_area_versions_area_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_area_versions_area_version ON public.area_versions USING btree (area_id, version_number);


--
-- TOC entry 5584 (class 2606 OID 17706)
-- Name: area_versions area_versions_area_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.area_versions
    ADD CONSTRAINT area_versions_area_id_fkey FOREIGN KEY (area_id) REFERENCES public.areas(id) ON DELETE CASCADE;


--
-- TOC entry 5585 (class 2606 OID 17711)
-- Name: area_versions area_versions_edited_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.area_versions
    ADD CONSTRAINT area_versions_edited_by_user_id_fkey FOREIGN KEY (edited_by_user_id) REFERENCES public.users(id);


--
-- TOC entry 5583 (class 2606 OID 17692)
-- Name: areas areas_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


-- Completed on 2025-08-11 12:58:44

--
-- PostgreSQL database dump complete
--

