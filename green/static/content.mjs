// Öffentliche Inhalte der statischen Website. Nach Änderungen neu bauen.
const richText = (...paragraphs) => ({ root: {
  type: 'root', direction: 'ltr', format: '', indent: 0, version: 1,
  children: paragraphs.map(text => ({ type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1,
    children: [{ type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '', version: 1 }],
  })),
} })

export const content = {
  settings: {
    siteName: 'BlechRegen',
    contact: { email: 'blechregen@gmail.com' },
    socialMedia: { instagram: 'https://www.instagram.com/blechregen/' },
  },
  home: {
    hero: { text: 'Sieben Musikanten aus Regensburg. Bayerisch-böhmische Blasmusik mit Salsa und Cumbia.' },
    about: {
      text: richText(
        'Bei einem gepflegten Bockbieranstich entstand nach etlichen Kaltgetränken und zünftiger Blasmusik die Idee, eine kleine Blasmusikbesetzung zu gründen.',
        'Frisch von einer Kolumbienreise zurück, schwirrten uns Salsa und Cumbia noch im Kopf herum. Weil es mit den nötigen Tanzkünsten eher schwierig aussah, beschlossen wir, uns auf die Musik zu konzentrieren: gemütliche bayerische Blasmusik, verbunden mit heißen Rhythmen, die zum Mitwippen zwingen.',
        'Wir kommen aus dem Umfeld des Sinfonischen Blasorchesters CampusBlosn und sind als klassische Siebenerbesetzung unterwegs – auf unserer lokalen Biergartenreise, die vielleicht einmal in Kolumbien endet. Nix is gwiss.',
      ),
      quote: 'Tradition im Herzen, Fernweh im Takt.',
    },
    music: {
      text: 'Wir mögen klassische Blasmusik genauso, wie sie ist. Manchmal braucht es aber einen Rhythmus, der die Biergarnitur kurz aufweckt.',
      features: [
        { title: 'Bayerisch-böhmisch', text: 'Polka, Walzer und Märsche – ehrlich gespielt und ohne großes Drumherum.' },
        { title: 'Ein Schuss Kolumbien', text: 'Latin, Salsa und Cumbia für den Moment, in dem auch die Bierbank mitwippt.' },
        { title: 'Sieben Musikanten', text: 'Eine kleine, flexible Besetzung für Biergarten, Frühschoppen, Fest und private Feier.' },
      ],
    },
  },
  // Hier nur bestätigte öffentliche Auftritte und echte Bandmitglieder eintragen.
  events: [],
  musicians: [],
  galleries: [],
}
