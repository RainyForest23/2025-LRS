const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase URL or Service Role Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seedAdmin() {
    const email = 'admin@example.com';
    const password = 'adminPassword123!';
    const name = 'Admin User';
    const phone = '010-0000-0000';

    console.log(`Creating admin user: ${email}...`);

    // 1. Create Auth User
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name }
    });

    if (authError) {
        console.error('Error creating auth user:', authError.message);
        return;
    }

    console.log('Auth user created. ID:', authUser.user.id);

    // 2. Insert into users table (public)
    const { error: dbError } = await supabase
        .from('users')
        .insert({
            auth_id: authUser.user.id,
            email,
            name,
            phone,
            role: 'admin',
            is_active: true
        });

    if (dbError) {
        console.error('Error creating public user profile:', dbError.message);
        // Cleanup auth user if db insert fails? 
        // For now just log.
    } else {
        console.log('Admin user profile created successfully in public.users table.');
    }
}

seedAdmin();
