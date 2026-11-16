'use client'

import Link from 'next/link'
import { useRef } from 'react'

export function MobileMenu({ navigation }: { navigation: readonly (readonly [string, string])[] }) {
  const menu = useRef<HTMLDetailsElement>(null)
  function close() { if (menu.current) menu.current.open = false }
  return <details className="mobile-menu" ref={menu}>
    <summary aria-label="Menü öffnen"><span /><span /></summary>
    <nav aria-label="Mobile Navigation">
      {navigation.map(([label, href]) => <Link href={href} key={href} onClick={close}>{label}</Link>)}
      <Link href="/booking" onClick={close}>Buch uns</Link>
    </nav>
  </details>
}
