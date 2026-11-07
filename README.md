# UroMed Nexus Suite — Educational Demo

Build 05. Greek educational prototype, with surname-first patient entry, fictional AMKA, fixed date/time separators, clinical and urology/andrology history, visits and attached exam files.

**Fictional patients and synthetic documents only. Not for real medical care.** The credentials displayed on the login screen are public demo credentials, not production authentication.

- Doctor: `doctor` / `DoctorDemo!2026`
- Reception: `reception` / `ReceptionDemo!2026`
- Administration: `ADMIN` / `AdminDemo!2026`

All entered data stays in the current browser: text/metadata in localStorage and exam files in IndexedDB. No shared database, synchronization or external sending. PIN/WebAuthn are local demo mechanisms. The update keeps the existing storage key and supports older fictional records. Confirm surname and first name when editing legacy names.

Exam categories: ultrasound, CT, MRI, blood count, biochemical tests, PSA, other. Supported files: PDF, PNG, JPEG, WebP, DICOM and ZIP, up to 20 MB each / 100 MB total. DICOM/ZIP are storage/download only. Backup JSON includes the attached file bytes. Keep backups before clearing browser data.

Clinical text has no fixed character cap; browser storage capacity still applies and save errors must be checked. Official prescribing remains external through IDIKA. Clinical AI and telemedicine are not implemented.

Deploy with GitHub Pages: main branch, root folder. No build step. Public app files only; conversation archives, credentials and user backups are excluded.
