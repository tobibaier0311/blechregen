import 'dotenv/config'

import fs from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'

import config from '../src/payload.config'

function richText(...paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        textStyle: '',
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

async function uploadImage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  filename: string,
  alt: string,
) {
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: filename } },
  })

  if (existing.docs[0]) return existing.docs[0]

  const absolutePath = path.resolve(process.cwd(), 'public/images', filename)
  const data = await fs.readFile(absolutePath)

  return payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data,
      mimetype: 'image/jpeg',
      name: filename,
      size: data.byteLength,
    },
  })
}

async function seed() {
  const payload = await getPayload({ config })
  const groupPhoto = await uploadImage(
    payload,
    'blechregen-live.jpg',
    'Die sieben Musiker von BlechRegen mit ihren Instrumenten',
  )
  const logo = await uploadImage(payload, 'blechregen-logo.jpg', 'Logo von BlechRegen')

  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      hero: {
        eyebrow: 'Bayerisch · Böhmisch · mit kolumbianischem Einschlag',
        headline: 'Blasmusik zum Aufwachen',
        text: 'Sieben Musikanten aus Regensburg, die traditionelle Blasmusik mögen – und gerne ein wenig Fernweh dazumischen.',
        image: groupPhoto.id,
        primaryButtonLabel: 'Nächste Termine',
        secondaryButtonLabel: 'BlechRegen anfragen',
      },
      about: {
        kicker: 'Über uns',
        headline: 'Von Bayern bis Bogotá',
        text: richText(
          'Bei einem gepflegten Bockbieranstich entstand nach etlichen Kaltgetränken und zünftiger Blasmusik die Idee, eine kleine Blasmusikbesetzung zu gründen.',
          'Frisch von einer Kolumbienreise zurück, schwirrten uns Salsa und Cumbia noch im Kopf herum. Weil es mit den nötigen Tanzkünsten eher schwierig aussah, beschlossen wir, uns auf die Musik zu konzentrieren: gemütliche bayerische Blasmusik, verbunden mit heißen Rhythmen, die zum Mitwippen zwingen.',
          'Wir kommen aus dem Umfeld des Sinfonischen Blasorchesters CampusBlosn und sind als klassische Siebenerbesetzung unterwegs – auf unserer lokalen Biergartenreise, die vielleicht einmal in Kolumbien endet. Nix is gwiss.',
        ),
        quote: 'Tradition im Herzen, Fernweh im Takt.',
      },
      music: {
        kicker: 'Unsere Musik',
        headline: 'Vertraut, aber nicht ganz gewöhnlich',
        text: 'Wir mögen klassische Blasmusik genauso, wie sie ist. Manchmal braucht es aber einen Rhythmus, der die Biergarnitur kurz aufweckt.',
        features: [
          {
            title: 'Bayerisch-böhmisch',
            text: 'Polka, Walzer und Märsche – ehrlich gespielt und ohne großes Drumherum.',
          },
          {
            title: 'Ein Schuss Kolumbien',
            text: 'Latin, Salsa und Cumbia für den Moment, in dem auch die Bierbank mitwippt.',
          },
          {
            title: 'Sieben Musikanten',
            text: 'Eine kleine, flexible Besetzung für Biergarten, Frühschoppen, Fest und private Feier.',
          },
        ],
      },
      events: {
        kicker: 'Termine',
        headline: 'BlechRegen live erleben',
        emptyHeadline: 'Neue Termine folgen.',
        emptyText: 'Der Kalender füllt sich gerade. Für eure eigene Veranstaltung könnt ihr uns jederzeit direkt anfragen.',
      },
      booking: {
        kicker: 'Kontakt & Buchung',
        headline: 'Spielen wir bei euch?',
        text: 'Ob Biergarten, Vereinsfest, Hochzeit oder Frühschoppen: Schreibt uns kurz, was ihr vorhabt. Wir melden uns persönlich bei euch.',
        buttonLabel: 'Unverbindlich anfragen',
      },
      _status: 'published',
    },
  })

  const settings = await payload.findGlobal({ slug: 'site-settings' })
  if (!settings.logo) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: { logo: logo.id },
    })
  }

  payload.logger.info('Startseite und Medien wurden in Payload angelegt.')
  await payload.destroy()
  process.exit(0)
}

await seed()
