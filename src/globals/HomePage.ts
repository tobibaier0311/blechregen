import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Startseite',
  admin: {
    group: 'Inhalte',
  },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Einstieg',
      fields: [
        { name: 'eyebrow', type: 'text', label: 'Kleine Zeile über der Überschrift' },
        { name: 'headline', type: 'text', label: 'Hauptüberschrift', required: true },
        { name: 'text', type: 'textarea', label: 'Einleitung', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Titelbild' },
        { name: 'primaryButtonLabel', type: 'text', label: 'Text des Termin-Buttons' },
        { name: 'secondaryButtonLabel', type: 'text', label: 'Text des Buchungs-Buttons' },
      ],
    },
    {
      name: 'about',
      type: 'group',
      label: 'Über uns',
      fields: [
        { name: 'kicker', type: 'text', label: 'Kleine Überschrift' },
        { name: 'headline', type: 'text', label: 'Überschrift', required: true },
        { name: 'text', type: 'richText', label: 'Über-uns-Text', required: true },
        { name: 'quote', type: 'textarea', label: 'Hervorgehobener Satz' },
      ],
    },
    {
      name: 'music',
      type: 'group',
      label: 'Unsere Musik',
      fields: [
        { name: 'kicker', type: 'text', label: 'Kleine Überschrift' },
        { name: 'headline', type: 'text', label: 'Überschrift', required: true },
        { name: 'text', type: 'textarea', label: 'Einleitung' },
        {
          name: 'features',
          type: 'array',
          label: 'Musikalische Merkmale',
          maxRows: 4,
          fields: [
            { name: 'title', type: 'text', label: 'Titel', required: true },
            { name: 'text', type: 'textarea', label: 'Beschreibung', required: true },
          ],
        },
      ],
    },
    {
      name: 'events',
      type: 'group',
      label: 'Termine',
      fields: [
        { name: 'kicker', type: 'text', label: 'Kleine Überschrift' },
        { name: 'headline', type: 'text', label: 'Überschrift', required: true },
        { name: 'emptyHeadline', type: 'text', label: 'Hinweis ohne kommende Termine' },
        { name: 'emptyText', type: 'textarea', label: 'Erklärung ohne kommende Termine' },
      ],
    },
    {
      name: 'booking',
      type: 'group',
      label: 'Buchung',
      fields: [
        { name: 'kicker', type: 'text', label: 'Kleine Überschrift' },
        { name: 'headline', type: 'text', label: 'Überschrift', required: true },
        { name: 'text', type: 'textarea', label: 'Buchungstext', required: true },
        { name: 'buttonLabel', type: 'text', label: 'Text des Anfrage-Buttons' },
      ],
    },
  ],
  versions: {
    drafts: {
      autosave: true,
    },
  },
}
