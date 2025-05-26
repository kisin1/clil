# Issues mit User Stories

## Issue #1: UI-Framework-Integration und Theme-Anpassung
**User Story:** Als Nutzer möchte ich eine ansprechende und konsistente Benutzeroberfläche erleben, damit ich mich intuitiv im CLIL-KI-Tool zurechtfinde und ein professionelles Erscheinungsbild wahrnehme.

**Detaillierte Aufgaben:**
- [ ] Vuetify 3 installieren und konfigurieren
- [ ] Anpassung des Farbschemas an CLIL-KI-Tool Designvorgaben
- [ ] Optional: PrimeVue für spezifische Komponenten einrichten
- [ ] Gemeinsame Theme-Variablen für konsistentes Erscheinungsbild definieren
- [ ] Basis-Layouts und Container-Komponenten erstellen
- [ ] Icon-Bibliothek einrichten (Material Design Icons)

## Issue #2: Vue Router Integration
**User Story:** Als Nutzer möchte ich nahtlos zwischen verschiedenen Bereichen der Anwendung navigieren können, damit ich effizient arbeiten und alle Funktionen schnell erreichen kann.

**Detaillierte Aufgaben:**
- [ ] Router-Konfiguration für alle Hauptseiten
- [ ] Nested Routes für Unterseiten
- [ ] Lazy Loading für optimierte Performance
- [ ] 404-Seite für nicht gefundene Routen

## Issue #3: Pinia Store-Struktur implementieren
**User Story:** Als Nutzer möchte ich, dass meine Daten und Einstellungen konsistent über alle Bereiche der Anwendung hinweg verfügbar sind und erhalten bleiben, damit ich meine Arbeit jederzeit fortsetzen kann.

**Detaillierte Aufgaben:**
- [ ] Store-Module für alle Hauptbereiche erstellen
- [ ] Actions für CRUD-Operationen
- [ ] Getters für abgeleitete Daten
- [ ] Persistierung wichtiger Daten im localStorage
- [ ] Mock-Daten für die Entwicklung

## Issue #4: Mock-Service für Gemini API erstellen
**User Story:** Als Entwickler möchte ich die KI-Funktionalität simulieren können, damit ich die Anwendung ohne Abhängigkeit von der tatsächlichen API entwickeln und testen kann.

**Detaillierte Aufgaben:**
- [ ] Service-Klasse für Gemini-API-Aufrufe
- [ ] Simulierte Antwortzeiten und Fehlerszenarien
- [ ] Konsistente Rückgabeformate
- [ ] Config für spätere Umstellung auf echte API
- [ ] Verschiedene Mock-Antworten für unterschiedliche Prompt-Typen
- [ ] Rate-Limiting und Quota-Simulation

## Issue #5: Layout-Komponenten und Dashboard-Grundgerüst
**User Story:** Als Nutzer möchte ich nach dem Login einen übersichtlichen Einstiegspunkt mit allen wichtigen Informationen und Funktionen sehen, damit ich schnell einen Überblick bekomme und mit der Arbeit beginnen kann.

**Detaillierte Aufgaben:**
- [ ] App-Layout mit Navigation und Header
- [ ] Dashboard mit Statistik-Karten und Listen
- [ ] Interaktive Navigation mit Router-Links
- [ ] Responsive Layout für alle Gerätetypen
- [ ] Loading States und Skeletons für asynchrone Daten

## Issue #6: Materialerstellungs-Komponente mit Vuetify
**User Story:** Als Lehrkraft möchte ich durch einen strukturierten Prozess geführt werden, um neue CLIL-Materialien zu erstellen, damit ich ohne technische Vorkenntnisse hochwertige Lernmaterialien generieren kann.

**Detaillierte Aufgaben:**
- [ ] Mehrstufigen Wizard implementieren
- [ ] Form-Validierung einrichten
- [ ] Generieren-Button mit Ladeanimation
- [ ] Vorschau des generierten Materials
- [ ] Speichern und weiterleiten zum Editor

## Issue #7: Rich-Text-Editor für Materialbearbeitung
**User Story:** Als Lehrkraft möchte ich generierte Materialien anpassen und verfeinern können, damit ich die KI-Ergebnisse an meine spezifischen Bedürfnisse anpassen kann.

**Detaillierte Aufgaben:**
- [ ] Editor-Komponente erstellen
- [ ] Toolbar mit Formatierungswerkzeugen
- [ ] Auto-Save-Funktion
- [ ] Integration mit Material-Store
- [ ] Responsive Design für verschiedene Geräte
- [ ] CLIL-spezifische Werkzeuge

## Issue #8: Materialien-Übersicht und Verwaltung
**User Story:** Als Lehrkraft möchte ich meine erstellten Materialien durchsuchen, filtern und verwalten können, damit ich schnell die benötigten Inhalte finde und organisiert bleibe.

**Detaillierte Aufgaben:**
- [ ] Material-Übersichtsseite mit Tabelle
- [ ] Filter- und Suchfunktionalität
- [ ] CRUD-Operationen (Löschen, Duplizieren)
- [ ] Sortieroptionen und Paginierung
- [ ] Grid- und Listen-Ansicht umschaltbar
- [ ] Integration mit Materials-Store

## Issue #9: Export-Komponente implementieren
**User Story:** Als Lehrkraft möchte ich meine erstellten Materialien in verschiedenen Formaten exportieren können, damit ich sie im Unterricht einsetzen oder mit Kollegen teilen kann.

**Detaillierte Aufgaben:**
- [ ] Export-Dialog implementieren
- [ ] Formatauswahl für PDF, DOCX, HTML
- [ ] Layout-Vorlagen für verschiedene Materialtypen
- [ ] Vorschau des exportierten Dokuments
- [ ] Integration mit simulierten Export-Diensten

## Issue #10: Vorlagen- und Prompt-Bibliothek
**User Story:** Als Lehrkraft möchte ich auf vorgefertigte Vorlagen zugreifen und diese verwenden können, damit ich Zeit spare und bewährte Strukturen für meine Materialien nutzen kann.

**Detaillierte Aufgaben:**
- [ ] Vorlagen-Übersicht mit Filteroptionen
- [ ] Detailansicht für Vorlagen
- [ ] Favoriten-Funktion und Kategorisierung
- [ ] Direkter Übergang zur Materialerstellung mit ausgewählter Vorlage
- [ ] Bewertungsmöglichkeit für Vorlagen

## Issue #11: Benutzereinstellungen und Profilseite
**User Story:** Als Nutzer möchte ich die Anwendung an meine Präferenzen anpassen können, damit ich effizienter arbeiten und ein personalisiertes Erlebnis haben kann.

**Detaillierte Aufgaben:**
- [ ] Profilbearbeitung für Benutzerdaten
- [ ] UI-Einstellungen (Theme, Sprache)
- [ ] Gemini API-Parameter-Voreinstellungen
- [ ] Exportvoreinstellungen
- [ ] Persistenz der Einstellungen im localStorage 