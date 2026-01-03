CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: appointment_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.appointment_status AS ENUM (
    'upcoming',
    'completed',
    'cancelled'
);


--
-- Name: risk_level; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.risk_level AS ENUM (
    'low',
    'medium',
    'high'
);


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.users_profile (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name');
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appointments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    doctor_name text,
    hospital text,
    appointment_date timestamp with time zone NOT NULL,
    notes text,
    status public.appointment_status DEFAULT 'upcoming'::public.appointment_status,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: emergency_contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.emergency_contacts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    contact_name text NOT NULL,
    contact_number text NOT NULL,
    relation text
);


--
-- Name: guidance_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guidance_content (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    pregnancy_week integer NOT NULL,
    risk_level public.risk_level NOT NULL,
    title text NOT NULL,
    description text NOT NULL
);


--
-- Name: symptoms_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.symptoms_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    symptom_type text NOT NULL,
    severity integer,
    notes text,
    logged_date date DEFAULT CURRENT_DATE,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT symptoms_log_severity_check CHECK (((severity >= 1) AND (severity <= 5)))
);


--
-- Name: users_profile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_profile (
    id uuid NOT NULL,
    name text,
    age integer,
    pregnancy_week integer,
    risk_level public.risk_level DEFAULT 'low'::public.risk_level,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT users_profile_pregnancy_week_check CHECK (((pregnancy_week >= 1) AND (pregnancy_week <= 42)))
);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: emergency_contacts emergency_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emergency_contacts
    ADD CONSTRAINT emergency_contacts_pkey PRIMARY KEY (id);


--
-- Name: guidance_content guidance_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guidance_content
    ADD CONSTRAINT guidance_content_pkey PRIMARY KEY (id);


--
-- Name: symptoms_log symptoms_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.symptoms_log
    ADD CONSTRAINT symptoms_log_pkey PRIMARY KEY (id);


--
-- Name: users_profile users_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_profile
    ADD CONSTRAINT users_profile_pkey PRIMARY KEY (id);


--
-- Name: appointments appointments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users_profile(id) ON DELETE CASCADE;


--
-- Name: emergency_contacts emergency_contacts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emergency_contacts
    ADD CONSTRAINT emergency_contacts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users_profile(id) ON DELETE CASCADE;


--
-- Name: symptoms_log symptoms_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.symptoms_log
    ADD CONSTRAINT symptoms_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users_profile(id) ON DELETE CASCADE;


--
-- Name: users_profile users_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_profile
    ADD CONSTRAINT users_profile_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: guidance_content Anyone can read guidance content; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read guidance content" ON public.guidance_content FOR SELECT USING (true);


--
-- Name: appointments Users can delete own appointments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own appointments" ON public.appointments FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: emergency_contacts Users can delete own contacts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own contacts" ON public.emergency_contacts FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: symptoms_log Users can delete own symptoms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own symptoms" ON public.symptoms_log FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: appointments Users can insert own appointments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own appointments" ON public.appointments FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: emergency_contacts Users can insert own contacts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own contacts" ON public.emergency_contacts FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: users_profile Users can insert own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own profile" ON public.users_profile FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: symptoms_log Users can insert own symptoms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own symptoms" ON public.symptoms_log FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: appointments Users can update own appointments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own appointments" ON public.appointments FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: emergency_contacts Users can update own contacts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own contacts" ON public.emergency_contacts FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: users_profile Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.users_profile FOR UPDATE USING ((auth.uid() = id));


--
-- Name: symptoms_log Users can update own symptoms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own symptoms" ON public.symptoms_log FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: appointments Users can view own appointments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own appointments" ON public.appointments FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: emergency_contacts Users can view own contacts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own contacts" ON public.emergency_contacts FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: users_profile Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.users_profile FOR SELECT USING ((auth.uid() = id));


--
-- Name: symptoms_log Users can view own symptoms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own symptoms" ON public.symptoms_log FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: appointments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

--
-- Name: emergency_contacts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

--
-- Name: guidance_content; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.guidance_content ENABLE ROW LEVEL SECURITY;

--
-- Name: symptoms_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.symptoms_log ENABLE ROW LEVEL SECURITY;

--
-- Name: users_profile; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;