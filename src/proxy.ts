import { createHash, timingSafeEqual } from 'node:crypto'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const unauthorized = () =>
  new NextResponse('Diese BlechRegen-Vorschau ist passwortgeschützt.', {
    status: 401,
    headers: {
      'Cache-Control': 'no-store',
      'WWW-Authenticate': 'Basic realm="BlechRegen Vorschau", charset="UTF-8"',
    },
  })

const secureEqual = (actual: string, expected: string) => {
  const actualHash = createHash('sha256').update(actual).digest()
  const expectedHash = createHash('sha256').update(expected).digest()

  return timingSafeEqual(actualHash, expectedHash)
}

export function proxy(request: NextRequest) {
  if (process.env.PREVIEW_PROTECTION !== 'true') {
    return NextResponse.next()
  }

  const expectedUsername = process.env.PREVIEW_USERNAME
  const expectedPassword = process.env.PREVIEW_PASSWORD
  const authorization = request.headers.get('authorization')

  if (!expectedUsername || !expectedPassword || !authorization?.startsWith('Basic ')) {
    return unauthorized()
  }

  const credentials = Buffer.from(authorization.slice(6), 'base64').toString('utf8')
  const separator = credentials.indexOf(':')

  if (separator === -1) {
    return unauthorized()
  }

  const username = credentials.slice(0, separator)
  const password = credentials.slice(separator + 1)

  if (!secureEqual(username, expectedUsername) || !secureEqual(password, expectedPassword)) {
    return unauthorized()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
