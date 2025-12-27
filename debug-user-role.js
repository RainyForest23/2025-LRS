// Debug script to check user role mapping
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function checkUserRole() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  console.log('=== Checking Users Table ===')
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (usersError) {
    console.error('Error fetching users:', usersError)
    return
  }

  console.log('Users in database:')
  users.forEach(user => {
    console.log({
      id: user.id,
      auth_id: user.auth_id,
      email: user.email,
      name: user.name,
      role: user.role,
      is_active: user.is_active
    })
  })

  console.log('\n=== Checking Auth Users ===')
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

  if (authError) {
    console.error('Error fetching auth users:', authError)
    return
  }

  console.log('Auth users:')
  authUsers.users.forEach(user => {
    console.log({
      id: user.id,
      email: user.email,
      created_at: user.created_at
    })
  })

  console.log('\n=== Checking Mapping ===')
  for (const authUser of authUsers.users) {
    const matchingUser = users.find(u => u.auth_id === authUser.id)
    console.log(`Auth ID: ${authUser.id} (${authUser.email})`)
    if (matchingUser) {
      console.log(`  ✓ Mapped to user: ${matchingUser.name} (role: ${matchingUser.role})`)
    } else {
      console.log(`  ✗ NO MATCHING USER FOUND`)
    }
  }
}

checkUserRole().then(() => {
  console.log('\n=== Done ===')
  process.exit(0)
}).catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
