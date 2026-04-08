import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkpgahhzrzdwndhrboiw.supabase.co';
// 접두어를 제거하고 표준 JWT 형식의 키만 적용합니다.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrcGdhaGh6cnpkd25kaHJib2l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MTUzMjYsImV4cCI6MjA5MTE5MTMyNn0.urI1xwynQJDW7h62J_Vg6IZJHm32n4ekz6Dh_hf_fhg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
