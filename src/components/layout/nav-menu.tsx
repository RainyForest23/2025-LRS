'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, FileText, Video, History, LogOut, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const navItems = [
  { href: "/", label: "대시보드", icon: Home },
  { href: "/applications", label: "강의 신청", icon: FileText },
  { href: "/assignments", label: "내 강의실", icon: Video },
  { href: "/history", label: "활동 이력", icon: History },
]

export function NavMenu({ userRole }: { userRole: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="flex items-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={cn("gap-2")}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        )
      })}

      {userRole === 'admin' && (
        <Link href="/admin/dashboard">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            관리자
          </Button>
        </Link>
      )}

      {/* Debug Indicator */}
      <span className="text-xs text-muted-foreground ml-2 border px-2 py-1 rounded">
        Role: {userRole}
      </span>

      <Button
        variant="ghost"
        size="sm"
        className="gap-2 ml-4"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        로그아웃
      </Button>
    </nav>
  )
}
