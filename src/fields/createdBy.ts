import type { Field } from 'payload'

export const createdByField: Field = {
  name: 'createdBy',
  type: 'relationship',
  relationTo: 'users',
  admin: {
    hidden: true,
  },
  index: true,
}
