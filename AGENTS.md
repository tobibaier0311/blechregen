# Arbeitsstand und Prioritäten

## Aktueller Fokus

- Ausschließlich am **grünen Design** der statischen BlechRegen-Website weiterarbeiten. Das blaue Design und andere Varianten vorerst nicht weiterentwickeln.
- Die vier Hauptbereiche und die abgestimmten Stilvorgaben sind in der separaten grünen Version umgesetzt (siehe technischer Kontext). Nur abgestimmte Stilvorgaben übernehmen, keine eigenständige Neugestaltung vorziehen.
- Echte Bandinhalte und klare Sprache verwenden. Keine Namen, Termine, Referenzen oder sonstigen Fakten erfinden; fehlende Informationen kenntlich machen bzw. nachfragen.
- Alle händischen Änderungen des Nutzers erhalten. Keine Dateien auf einen älteren Stand zurücksetzen, keine fremden Änderungen überschreiben.
- Ohne ausdrücklichen Auftrag nichts pushen oder live veröffentlichen.

## Festgelegte Inhaltsstruktur

Der Nutzer hat folgende vier Hauptbereiche in dieser Reihenfolge festgelegt:

1. **Band & Musik**: Musik und Band thematisch zusammenführen, nicht als zwei getrennte Hauptbereiche behandeln. Sowohl die Musik, die BlechRegen spielt, als auch die Musiker*innen bzw. die Kapelle vorstellen.
2. **Termine**: Öffentliche Auftritte aus Konzertmeister in einer eigenen schlichten Liste auf Startseite und Terminseite zeigen. HTML-Export-Adapter und Netlify-Funktion sind vorbereitet, aber nicht aktiviert. Vor Aktivierung ausdrücklich prüfen, dass alle exportierten Termine veröffentlicht werden dürfen; den signierten Link nur serverseitig konfigurieren. Anleitung im README.
3. **Media**: Fotos, Videos und Musikmitschnitte, sowohl als Audio als auch als Video. Nur tatsächlich vorhandene bzw. vom Nutzer bereitgestellte oder freigegebene Medien verwenden.
4. **Buch uns / Booking**: Bereich für Buchungsanfragen. Die endgültige sichtbare Bezeichnung ist noch offen zwischen „Buch uns“ und „Booking“.

Die Navigation und die gemeinsame Seite unter `/band/` sind umgesetzt. `/musik/` bleibt als Hinweis auf die gemeinsame Seite erreichbar. Keine zusätzlichen Hauptbereiche oder Unterseiten ohne inhaltlichen Bedarf erfinden.

**Startseite erhalten:** Der Nutzer hat ausdrücklich klargestellt, dass die bisherigen Abschnitte und Kernaussagen der grünen Startseite erhalten bleiben sollen: Hero, Genre-Laufband, Entstehungsgeschichte, Musik/Stil-Spielerei, Kapelle/Besetzung, Termine und Buchung. Die vier Hauptbereiche betreffen die Navigation und Unterseiten, nicht einen Ersatz der Startseite durch vier reine Übersichtsblöcke. Texte und Dekoration bereinigen, aber keine inhaltlichen Abschnitte stillschweigend streichen oder neu erfinden.

Der Geschichtsabschnitt auf der Startseite trägt wieder die ausdrücklich gewünschte Überschrift „Erst a Maß. Dann a Idee.“. Daneben steht ein vereinfachtes gelbes Plakat mit „Oans / Zwoa / Hey!“, ohne zusätzliche Labels oder Zahlen. Der Einstiegstext ist auf zwei kurze Absätze reduziert; die ausführliche Geschichte bleibt auf „Band & Musik“.

## Abgestimmte Stilrichtung

- Das grüne Design bleibt die Arbeitsbasis. Für die Gestaltung die bereits gemeinsam erarbeitete blaue Version als Referenz nutzen, nicht als eigenständig weiterzuentwickelnde Variante.
- **Überschriften ohne vorangestellte Bindestriche, Nummern oder Kapitelmarker.** Keine Muster wie „01 / Unsere Geschichte“ oder „— Termine“.
- Überschriften in **Großbuchstaben (uppercase)** darstellen, einschließlich Abschnitts- und Unterüberschriften. Per CSS umsetzen, nicht die Inhaltstexte umschreiben. Im Hero wurde der separate BlechRegen-Schriftzug auf Nutzerwunsch entfernt: „Wenn die Polka Salsa tanzt“ ist dort jetzt die große, plakative Hauptüberschrift, ohne Schlusspunkt, leicht kursiv und um -3° gedreht mit sanft versetzten Zeilen. „Salsa tanzt“ bleibt in einer Zeile; das Logo daneben bleibt bestehen. Kein Punkteraster im Hero und keine helle Trennkante zum Laufband.
- Genre-Laufband als schmalen, gleichmäßigen Streifen halten, ohne Pause-Button oder zusätzliche Bedienzeile. Bei Hover/Tastaturfokus anhalten; reduzierte Bewegung respektieren.
- Im Laufband Wort und Trennstern als gleichmäßig verteilte Elemente behandeln: identische Abstände auch über die Wiederholungsnaht, einheitliche SVG-Sterne und nahtloser linearer Durchlauf. Die erste komplette Genre-Folge füllt mindestens eine Bildschirmbreite; keine separat auseinandergezogenen Wortgruppen.
- Im Hero wird testweise die vom Nutzer bereitgestellte PNG `BlechRegen Logo Transparent.png` anstelle der gezeichneten Trompete verwendet. Asset-Kopie unter `green/public/images/`; nicht das Original verändern. Die frühere Trompetenkomponente bleibt für einen möglichen Vergleich erhalten.
- **Weniger beliebiger Text:** unnötige Labels, wiederholte Slogans und generische Werbetexte streichen. Inhalte sollen die Band, ihre Musik und das Angebot konkret erklären.
- Die ruhigere, weniger templatehafte Komposition der blauen Version als Richtung übernehmen: klare Hierarchie, lesbare Texte und echte Bandinhalte statt dekorativer Textblöcke oder starrer, gleichförmiger Kartenraster.
- Spielereien nicht pauschal entfernen: Die musikalische Stil-Spielerei wurde vom Nutzer ausdrücklich positiv bewertet. Gezielt und verständlich einsetzen, ohne Inhalte zu überlagern.
- Der Verweis auf das blaue Design ist keine pauschale Freigabe für dessen Farbpalette oder sämtliche Details. Konkrete neue Farb-, Schrift- und Layoutentscheidungen bei Bedarf gemeinsam abstimmen.

Diese Vorgaben sind in der grünen Website umgesetzt: ruhige Überschriften, konkrete Texte, offene Inhaltsanordnung und erhaltene musikalische Stil-Spielerei. Farbwelt und kräftige Schrift der grünen Basis bleiben erhalten.

## Weiterer Designleitfaden

Der Nutzer möchte eigene Designregeln erstellen. Die Arbeit wurde zunächst für Struktur und Inhalte zurückgestellt; anschließend hat er die oben festgehaltene Stilrichtung vorgegeben. Ein vollständiger `DESIGN.md`-Leitfaden steht noch aus.

Danach gemeinsam einen `DESIGN.md`-Leitfaden auf Basis des grünen Designs erarbeiten:

- Charakter und Ziel der Bandwebsite.
- Farben und ihre jeweiligen Aufgaben.
- Schriftarten, Größen und Hervorhebungen.
- Seitenaufbau, Abstände und Umgang mit echten Bandbildern.
- Einheitliche Buttons, Interaktionszustände und gezielte Bewegung.
- Klare, konkrete Texte statt generischer Werbesprüche.
- Bewusster Verzicht auf Dekoration ohne Zweck.

Dazu Frontend Design und Product Designer nutzen. Bestehende Eigenschaften von neuen Vorschlägen unterscheiden und subjektive Entscheidungen gemeinsam abstimmen. Anschließend bestätigte technische Werte bei Bedarf zentral als CSS-Variablen abbilden. Die oben dokumentierten Stilvorgaben gelten bereits als Richtung; ein vollständiger Designleitfaden wurde noch nicht erstellt oder technisch umgesetzt.

## Technischer Kontext zur grünen Vorschau

- Grüne Quellen liegen dauerhaft im Projekt unter `green/`, ausgehend von Commit `c5b3a54`. Die alte temporäre Kopie `/private/tmp/blechregen-green-UdOhtH` nicht mehr bearbeiten.
- Start mit `npm run dev:green` unter `http://localhost:3004`; automatische Übernahme von Änderungen an grünen Quellen. Die blaue Vorschau auf Port 3003 bleibt gestoppt. Tatsächlichen Serverstatus jeweils prüfen.
- Quellseiten: `green/src/app/(frontend)/`; ergänzende Stilregeln: `green/src/app/(frontend)/green.css`; Inhalte: `green/static/content.mjs`; Bilder: `green/public/`.
- `npm run build:green` erzeugt `green/dist/`. Die aktive `netlify.toml` wurde auf ausdrücklichen Nutzerauftrag zur Veröffentlichung des grünen Designs auf diesen Export und `green/netlify/functions` umgestellt. Keine weiteren Deployments ohne Auftrag. Der Konzertmeister-Abruf bleibt bis zur bestätigten öffentlichen Freigabe deaktiviert.
- `dist/`, `green/dist/` und generierte `.static-*`-/`.green-*`-Verzeichnisse nicht als Quelldateien bearbeiten.
- Das Hauptprojekt enthält uncommittete Änderungen einschließlich der blauen Variante. Nicht pauschal zurücksetzen, überschreiben oder als grünes Design behandeln.
