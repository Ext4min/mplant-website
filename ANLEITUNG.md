# mplant Website – Einrichtungs-Anleitung

Diese Anleitung führt Sie durch die einmalige Einrichtung, damit Ihre Website mit Ihrem neuen GitHub-Konto und Netlify verbunden ist.

**Gesamte Dauer:** ca. 30 Minuten

---

## Schritt 1: Dateien auf GitHub hochladen (5 Minuten)

Ihr GitHub-Account **Ext4min** und die Repository **mplant-website** sind bereits angelegt.

1. Gehen Sie zu Ihrer Repository: **https://github.com/Ext4min/mplant-website**
2. Sie sehen eine leere Seite mit dem Text „Quick setup" oder ähnlich
3. Klicken Sie auf **„uploading an existing file"** (mittig auf der Seite)
4. **Alle Dateien und Ordner** aus dem ZIP-Ordner in das Browserfenster ziehen:
   - `index.html`, `karriere.html`, `logo.png`
   - `cms-loader.js`, `netlify.toml`
   - **Ordner** `admin`, `content`, `images`

   **WICHTIG:** Ziehen Sie die Dateien und Ordner alle zusammen in einem Rutsch. GitHub akzeptiert das über den Browser.
   
   Falls das nicht klappt (manche Browser übertragen keine Ordner richtig): Nutzen Sie **GitHub Desktop** (https://desktop.github.com) – das ist einfacher und übernimmt auch Unterordner zuverlässig.

5. Unten: **„Commit changes"** klicken

---

## Schritt 2: Netlify mit GitHub verbinden

Sie haben aktuell die Website unter `mplant-pflanzenhof.netlify.app` laufen, aber sie ist per Netlify Drop hochgeladen und nicht mit GitHub verbunden. Das ändern wir jetzt.

**Option A: Bestehendes Projekt umschalten (empfohlen)**

1. Anmelden bei https://app.netlify.com
2. Öffnen Sie Ihr Projekt **mplant-pflanzenhof**
3. Oben auf **„Site configuration"** → links auf **„Build & deploy"**
4. Bei **„Continuous deployment"** auf **„Link repository"** klicken
5. **GitHub** wählen → Netlify fragt nach Berechtigung → **„Authorize"**
6. Repository **Ext4min/mplant-website** auswählen
7. Bei den Build-Einstellungen: alles leer lassen, unten **„Deploy site"**

**Option B: Neues Netlify-Projekt erstellen** (falls A nicht klappt)

1. https://app.netlify.com → **„Add new site"** → **„Import an existing project"**
2. **„Deploy with GitHub"**
3. Repository **Ext4min/mplant-website** wählen
4. Nichts einstellen, unten **„Deploy site"**
5. Nach dem Test: das alte `mplant-pflanzenhof`-Projekt löschen (unter Site configuration → Danger zone → Delete site)

---

## Schritt 3: Anmeldung (Identity) aktivieren

Damit das CMS funktioniert und Mitarbeiter sich einloggen können:

1. In Netlify Ihr Projekt öffnen → **„Site configuration"** → links **„Identity"**
2. Auf **„Enable Identity"** klicken
3. Weiter unten: **„Registration"** → **„Invite only"** auswählen
4. Ganz unten: **„Services"** → **„Git Gateway"** → **„Enable Git Gateway"**

---

## Schritt 4: Mitarbeiter einladen

1. Immer noch unter **„Identity"** → **„Invite users"**
2. E-Mail-Adressen der Mitarbeiter eintragen
3. Auf **„Send"**

Die eingeladenen Personen bekommen eine E-Mail mit Bestätigungs-Link, richten ein Passwort ein und können sich unter `IHRE-URL/admin` anmelden.

---

## Wie es danach funktioniert

**Für Mitarbeiter zum Bearbeiten von Inhalten:**

1. Im Browser `mplant.de/admin` (oder Ihre Netlify-URL + `/admin`) aufrufen
2. Mit E-Mail und Passwort anmelden
3. Auf der linken Seite die zu bearbeitende Sektion wählen
4. Text oder Bild ändern
5. Oben rechts auf **„Save"**
6. Nach ~30 Sekunden ist die Änderung live

---

## Was ist alles über das CMS bearbeitbar?

### Startseite
- **Startbild & Titel** (Hero-Bereich)
- **Aktuell im Hof** (der schmale dunkle Streifen unter dem Hero – ideal für saisonale Hinweise)
- **Karriere-Banner** (der grüne Streifen mit „Wir suchen Verstärkung")
- **Die zwei Bereiche** (Pflanzenhof & Garten)
- **Pflanzenhof-Detailbereich** (die 4 kleinen Bilder + Text)
- **Sortiment-Kacheln** (die 6 Kacheln „Was Sie bei uns finden")
- **Garten- und Landschaftsbau** (die 6 Leistungs-Kacheln + der 4-stufige Zeitstrahl)
- **Vorher/Nachher Bilder-Slider** (die zwei Referenz-Bilder)
- **Galerie / Referenzen** (unbegrenzt viele Bilder möglich)
- **Kontakt & Öffnungszeiten**
- **Kundenstimmen** (unbegrenzt viele Rezensionen)

### Karriere-Seite
- **Kopfbereich** (Bild, Titel, Untertitel)
- **Vorteile** (die 3 „Warum mplant?"-Kacheln)
- **Offene Stellen** (unbegrenzt viele Stellenanzeigen, jede mit Aufgaben, Anforderungen, Was wir bieten)
- **Bewerbungs-Bereich**

---

## Was ist neu in diesem Update?

**Ihre gewünschten Änderungen:**

1. ✅ **Karriere-Banner nach oben verschoben** – jetzt direkt nach dem Willkommens-Bereich
2. ✅ **Gedankenstriche entfernt** – alle Texte umformuliert mit Kommas und Punkten
3. ✅ **Zeitstrahl waagerecht** – „So läuft ein Projekt bei uns" jetzt mit 4 Punkten auf einer Linie
4. ✅ **Vorher/Nachher-Slider** – interaktiver Bildvergleich im GaLaBau-Bereich
5. ✅ **Aktuell im Hof** – dezenter Streifen zwischen Hero und Willkommen für saisonale Hinweise

---

## Bei Problemen

- **Admin-Bereich nicht erreichbar?** Prüfen Sie, ob in Netlify unter Identity „Git Gateway" wirklich aktiviert ist.
- **Änderung erscheint nicht auf der Website?** Warten Sie 1-2 Minuten und laden Sie die Seite neu (Strg+Umschalt+R oder Cmd+Umschalt+R).
- **Bilder zu groß beim Hochladen?** Verkleinern Sie sie vor dem Hochladen auf max. 2000px Breite.

---

## Neue Änderungen in diesem Update

- ✅ **Öffnungszeiten-Schleife** oben rechts (immer sichtbar, auf allen Seiten). Text pflegbar über CMS unter "Öffnungszeiten-Schleife".
- ✅ **"Zwei Standbeine, ein Team"-Überschrift** entfernt (nur der Beschreibungstext bleibt).
- ✅ **Vorher/Nachher-Slider** mit Ihrem echten Referenzbild bestückt (Verjüngung).
- ✅ **Neuer Button** "Aktuelle Pflanzen im Hof" zwischen Karriere-Banner und Sortiment.
- ✅ **Neue eigene Seite** `aktuelles.html` im Stil der Karriere-Seite. Mitarbeiter können dort beliebig viele Kacheln anlegen mit Bild, Titel und Beschreibung. Ideal für saisonale Angebote, frisch eingetroffene Ware oder Aktionen.

### Wo pflegen die Mitarbeiter das im CMS?

- **Öffnungszeiten-Schleife**: Startseite → "Öffnungszeiten-Schleife"
- **Aktuelles-Button auf Startseite**: Startseite → "Aktuelles-Button"
- **Aktuelles im Hof (Seite)**: Eigene Kategorie ganz unten → "Aktuelles im Hof (eigene Seite)"

### Wie fügen Mitarbeiter eine neue "Aktuelles"-Kachel hinzu?

1. Im Admin auf **"Aktuelles im Hof (eigene Seite)"** klicken
2. Unter **Kacheln** auf **Add** klicken
3. Bild hochladen, Titel und Beschreibungstext eintragen
4. Oben rechts auf **Save** klicken
5. Nach ca. 30 Sekunden ist die neue Kachel auf `aktuelles.html` live

