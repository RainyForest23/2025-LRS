-- Fix infinite recursion in RLS policies
-- 문제: "Admins can manage all users" 정책이 users 테이블을 참조하면서 무한 재귀 발생
-- 해결: security definer 함수를 사용하여 RLS를 우회

-- 1. RLS를 우회하여 user role을 가져오는 함수 생성
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.users WHERE auth_id = auth.uid() LIMIT 1;
$$;

-- 2. 기존 admin 정책 삭제
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- 3. 새로운 admin 정책 생성 (함수 사용)
CREATE POLICY "Admins can manage all users" ON users
    FOR ALL USING (
        auth.user_role() = 'admin'
    );

-- 4. 다른 테이블의 admin 정책도 동일하게 수정
DROP POLICY IF EXISTS "Admins can manage all applications" ON applications;
CREATE POLICY "Admins can manage all applications" ON applications
    FOR ALL USING (auth.user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can manage all assignments" ON assignments;
CREATE POLICY "Admins can manage all assignments" ON assignments
    FOR ALL USING (auth.user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can manage all reviews" ON reviews;
CREATE POLICY "Admins can manage all reviews" ON reviews
    FOR ALL USING (auth.user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can manage all evaluations" ON evaluations;
CREATE POLICY "Admins can manage all evaluations" ON evaluations
    FOR ALL USING (auth.user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can manage all attendance" ON attendance;
CREATE POLICY "Admins can manage all attendance" ON attendance
    FOR ALL USING (auth.user_role() = 'admin');
