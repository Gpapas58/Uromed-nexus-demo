# UroMed Nexus Suite — Educational Demo

Build 06. Greek educational prototype, with surname-first patient entry, fictional AMKA, fixed date/time separators, clinical and urology/andrology history, visits and attached exam files.

**Fictional patients and synthetic documents only. Not for real medical care.** The credentials displayed on the login screen are public demo credentials, not production authentication.

- Doctor: `doctor` / `DoctorDemo!2026`
- Reception: `reception` / `ReceptionDemo!2026`
- Administration: `ADMIN` / `AdminDemo!2026`

All entered data stays in the current browser: text/metadata in localStorage and exam files in IndexedDB. No shared database, synchronization or external sending. PIN/WebAuthn are local demo mechanisms. The update keeps the existing storage key and supports older fictional records. Confirm surname and first name when editing legacy names.

Exam categories: ultrasound, CT, MRI, blood count, biochemical tests, PSA, other. Supported files: PDF, PNG, JPEG, WebP, DICOM and ZIP, up to 20 MB each / 100 MB total. DICOM/ZIP are storage/download only. Backup JSON includes the attached file bytes. Keep backups before clearing browser data.

Clinical text has no fixed character cap; browser storage capacity still applies and save errors must be checked. Official prescribing remains external through IDIKA. Clinical AI and telemedicine are not implemented.

Deploy with GitHub Pages: main branch, root folder. No build step. Public app files only; conversation archives, credentials and user backups are excluded.


## Welcome screen

The welcome page displays the original user-provided PNG (welcome-bg.png), unchanged, using object-fit: contain so all text and side icons remain visible. The loading bar and v1.0.0 label belong to the supplied artwork; the current application build is stated separately below. Clicking the image or Continue opens login. Continue to login directly or open the retained marketing page. No simulated loading progress or forced wait.


## Medical login screen

The login screen uses the supplied medical design as artwork (login-screen.png) with actual HTML form controls over the central card. Password, local PIN and optional platform WebAuthn remain functional. Username can be remembered by explicit checkbox; passwords and authentication sessions are not saved by that option. Demo credentials/help are available from a dialog. Security labels accurately describe local demo storage, not an encrypted clinical database. Responsive layouts were checked at 1672, 1440, 1024 and 390 pixels.


## Build 06: Imaging workspace

Doctor navigation now includes Imaging: patient-scoped imaging list, PNG/JPEG/WebP viewer from IndexedDB, zoom/fit/fullscreen, comparison with another examination of the same patient, and manual findings/conclusion/comparison notes. Existing exam attachments, backup and patient IDs are retained. Previous manual findings are recorded locally when changed. X-ray and other imaging categories were added. Font sizes and touch targets are increased; only implemented viewer tools are shown. DICOM/PDF/ZIP remain downloadable storage files, not diagnostic viewers.

The CT AI screen is a separate **inactive design reference**. It displays the supplied static mockup with a clear label: no analysis runs, confidence scores/measurements are fictional, and nothing is imported into clinical records. Clinical image analysis requires a separately validated system. The original imaging mockup is also available as a design reference, separate from stored patient images.


## Functional startup progress

The welcome screen now overlays a real four-stage progress element on the supplied artwork. Stages correspond to welcome image decoding, application module loading, local workspace validation/migration, and opening the exam attachment store. There is no artificial loading timer. Continue becomes available after the checks complete. An unavailable image or attachment store is reported as a warning; a module or workspace failure blocks startup with retry and, when available, raw-data recovery export. Existing workspace keys are unchanged. The entry module is bootstrap.js.


## Build 07: shared clinical workspace

Approved blue/white visual language with a dark left sidebar and a real dashboard. Clinic cards, today's schedule and visit totals are calculated from local records, with the hospital shown only when enabled. Patient table includes search, status/clinic/date filters, favourites, pagination, selected-row administrative CSV export and surname-first editing. The patient overview shows actual clinical fields, saved attachments, visits and a PSA trend only for explicit finite ng/mL results. Timeline filters visits, exams/documents, imaging, appointments and saved profile/notes updates; filtered history can be printed/PDF.

The IDIKA screen opens https://www.e-prescription.gr/ externally, with noopener/noreferrer and no patient parameters or automatic data transfer. Internal medication text is saved in the patient profile, never issued as a prescription. Prescription copies can be manually attached as an examination/document category, included in normal backup/restore. Reports list final visits for preview, print/PDF and existing optional email draft. CT and MRI AI screens are inactive design references; no AI medical results are generated.

Compatibility targets: Windows 11 browsers, Android 13+ browsers, Safari on iOS/iPadOS 16+. Automated Chromium checks cover desktop/tablet/mobile widths 1366, 1024, 768 and 390 pixels and the core workflows. These are not physical Windows/Android/iOS or Safari tests. Platform biometrics, full screen, downloads and printing depend on device/browser support; password/PIN and image-viewer fallbacks remain available. Local data is separate on each device, not synchronized.

Validation: 25 domain/authentication tests plus browser suites for startup failures, clinical editing, files/backup, imaging, patient table/timeline, IDIKA and role separation. Use only fictional data; this remains an educational prototype without production authentication or clinical certification.
