'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

export function InquiryForm({ email }: { email: string }) {
  const form = useRef<HTMLFormElement>(null)
  const [ready, setReady] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [manualCopy, setManualCopy] = useState('')
  useEffect(() => setReady(true), [])

  function message() {
    const fields = new FormData(form.current!)
    const value = (key: string) => String(fields.get(key) || '').trim() || 'Noch offen'
    return `Hallo BlechRegen,\n\nwir möchten euch für eine Veranstaltung anfragen.\n\nName: ${value('name')}\nE-Mail: ${value('email')}\nAnlass: ${value('occasion')}\nTermin: ${value('date')}\nOrt: ${value('place')}\n\n${value('message')}\n\nViele Grüße\n${value('name')}`
  }
  function openEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    window.location.href = `mailto:${email}?subject=${encodeURIComponent('Veranstaltungsanfrage an BlechRegen')}&body=${encodeURIComponent(message())}`
    setFeedback('Bitte sendet den Entwurf in eurem E-Mail-Programm ab. Öffnet sich kein Programm, könnt ihr den Text kopieren und selbst eine E-Mail schreiben.')
  }
  async function copy() {
    const text = message()
    try {
      await navigator.clipboard.writeText(text)
      setManualCopy('')
      setFeedback('Anfragetext kopiert. Fügt ihn in eine E-Mail an ' + email + ' ein.')
    } catch {
      setManualCopy(text)
      setFeedback('Bitte markiert und kopiert den Text unten.')
    }
  }
  return <form ref={form} className="green-inquiry" method="post" onSubmit={openEmail}>
    <noscript><p>Für den E-Mail-Entwurf wird JavaScript benötigt. Schreibt uns alternativ direkt an <a href={`mailto:${email}`}>{email}</a>.</p></noscript>
    <fieldset disabled={!ready}>
      <legend>E-Mail-Entwurf vorbereiten</legend>
      <label>Name / Organisation<input name="name" autoComplete="name" required /></label>
      <label>E-Mail<input name="email" type="email" autoComplete="email" required /></label>
      <div className="form-row"><label>Anlass<select name="occasion"><option>Biergarten / Frühschoppen</option><option>Hochzeit / private Feier</option><option>Vereins- / Firmenfest</option><option>Festival / Kulturabend</option><option>Anderer Anlass</option></select></label><label>Wunschtermin<input name="date" type="date" /></label></div>
      <label>Veranstaltungsort<input name="place" /></label>
      <label>Was plant ihr?<textarea name="message" rows={4} required /></label>
      <div className="green-form-actions"><button className="concept-button concept-button-dark" type="submit">E-Mail-Entwurf öffnen</button><button className="green-copy-button" type="button" onClick={copy}>Text kopieren</button></div>
      <p role="status">{feedback}</p>
      {manualCopy && <label>Text zum Kopieren<textarea readOnly value={manualCopy} rows={10} /></label>}
    </fieldset>
  </form>
}
