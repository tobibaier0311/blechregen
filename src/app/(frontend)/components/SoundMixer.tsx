'use client'

import { useState } from 'react'

const messages = { bayern: '🍺 Oans, zwoa – Polka voraus! Die Maß steht bereit.', mix: "🍻 + 💃 = BlechRegen. So mögen wir's!", latin: '💃 ¡Arriba! Jetzt groovt sogar die Tuba Cumbia.' } as const

export function SoundMixer() {
  const [mix, setMix] = useState<keyof typeof messages>('mix')
  return <div className="concept-mixer"><div><p>Wie viel Latin darf&apos;s sein?</p>{Object.entries({ bayern: 'Mehr Bayern', mix: 'Halbe-Halbe', latin: 'Mehr Latin' }).map(([key, label]) => <button className={mix === key ? 'active' : ''} key={key} onClick={() => setMix(key as keyof typeof messages)} type="button">{label}</button>)}</div><output aria-live="polite">{messages[mix]}</output></div>
}
