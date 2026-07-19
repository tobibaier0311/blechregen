import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Website-Einstellungen',
  admin: {
    group: 'Einstellungen',
  },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: 'Name der Gruppe',
      required: true,
      defaultValue: 'BlechRegen',
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Unterzeile',
      defaultValue: 'Von Bayern bis Bogotá',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Kontakt',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'E-Mail-Adresse',
        },
        {
          name: 'phoneNumbers',
          type: 'array',
          label: 'Telefonnummern',
          fields: [
            { name: 'label', type: 'text', label: 'Bezeichnung' },
            { name: 'number', type: 'text', label: 'Telefonnummer', required: true },
          ],
        },
        {
          name: 'address',
          type: 'group',
          label: 'Anschrift',
          fields: [
            { name: 'street', type: 'text', label: 'Straße und Hausnummer' },
            { name: 'postalCode', type: 'text', label: 'Postleitzahl' },
            { name: 'city', type: 'text', label: 'Ort' },
          ],
        },
      ],
    },
    {
      name: 'socialMedia',
      type: 'group',
      label: 'Social Media',
      fields: [
        { name: 'instagram', type: 'text', label: 'Instagram-URL' },
        { name: 'facebook', type: 'text', label: 'Facebook-URL' },
        { name: 'youtube', type: 'text', label: 'YouTube-URL' },
      ],
    },
    {
      name: 'bookingText',
      type: 'richText',
      label: 'Buchungshinweis',
    },
    {
      name: 'defaultSeo',
      type: 'group',
      label: 'Standardwerte für Suchmaschinen',
      fields: [
        { name: 'title', type: 'text', label: 'Seitentitel', maxLength: 60 },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta-Beschreibung',
          maxLength: 160,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Vorschaubild',
        },
      ],
    },
  ],
}
