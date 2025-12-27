-- Fix infinite recursion in RLS policies (public schema version)

-- 1. RLS를 우회하여 user role을 가져오는 함수 생성 (public 스키마에)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.users WHERE auth_id = auth.uid() LIMIT 1;
$$;

-- 2. 기존 admin 정책 삭제 및 재생성
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
CREATE POLICY "Admins can manage all users" ON users
    FOR ALL USING (public.get_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can manage all applications" ON applications;
CREATE POLICY "Admins can manage all applications" ON applications
    FOR ALL USING (public.get_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can manage all assignments" ON assignments;
CREATE POLICY "Admins can manage all assignments" ON assignments
    FOR ALL USING (public.get_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can manage all reviews" ON reviews;
CREATE POLICY "Admins can manage all reviews" ON reviews
    FOR ALL USING (public.get_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can manage all evaluations" ON evaluations;
CREATE POLICY "Admins can manage all evaluations" ON evaluations
    FOR ALL USING (public.get_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can manage all attendance" ON attendance;
CREATE POLICY "Admins can manage all attendance" ON attendance
    FOR ALL USING (public.get_user_role() = 'admin');
