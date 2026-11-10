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

## Build 08: calendar and visit entry

The supplied appointment and visit designs now have functional HTML counterparts. Appointment views include day columns by clinic, Monday-to-Sunday week, month with counts and selectable days, list, date navigation and patient search. Empty half-hour slots populate a new appointment form; saved appointments retain existing conflict checks and lifecycle actions. The day grid covers 08:00–20:00 with an explicit separate list for appointments outside this range. Appointment length is displayed and subsequent occupied cells show a continuation; save-time overlap checks also cover exact minute times and travel between clinics. No drag-and-drop, telemedicine or staff scheduling is advertised.

Visit entry includes reason presets, free history/examination/assessment/plan, structured optional general condition, blood pressure, pulse, BMI and urological findings (abdomen, renal areas, bladder, DRE, Qmax, PVR). All examination fields initially remain unrecorded. Findings persist with drafts, final-visit revisions, JSON backups, timeline search and printable reports. Numeric fields are recorded values, not automated medical interpretation. Existing medications and laboratory results remain linked through the patient record. No automatic ICD coding, drug recommendations or voice recognition is supplied.

The repeated MRI screenshot is byte-identical to the existing reference. Stored-image viewing and manual findings are functional; automatic MRI AI analysis remains unavailable. Validation includes 28 domain/auth tests and browser checks for calendar navigation/creation/search and visit findings persistence/report/reopen, alongside earlier clinical/authentication/file-backup suites. Responsive Chromium checks do not substitute for physical Safari/iOS and Android testing.

## Build 09: approved photograph layout with live data

Reconstructed the photograph hierarchy as HTML controls rather than frozen patient text. The calendar now places filters above the central appointment grid, with a live mini-month calendar, appointment editor and quick actions in the right column. The visit screen uses a compact patient strip, date/clinic/save controls, left section navigation and arranged panels for history, objective/urology findings, stored exams, assessment/medication context and follow-up plan. Shared blue/white panel styling and sidebar active states follow the supplied designs. Smaller screens reflow the same controls; the original welcome/login artwork remains in place.

Existing storage keys and clinical fields are unchanged. All displayed patient data and counters come from local fictional records; this is not cross-device synchronization. Automated checks assert the editor/filter placement, 42 selectable mini-calendar days, follow-up field location, correct sidebar active styling, responsive layout and the previous save/report workflows. MRI AI remains an explicitly inactive reference; no automatic diagnosis or prescription generation was added.

## Build 10: original PNG frame and live regions

The exact supplied PNG files now form the visible desktop/tablet frame for the doctor: dashboard, patients, calendar, record overview, history, visit, IDIKA and imaging. Original artwork remains unmodified. Transparent, keyboard-labelled navigation regions activate the corresponding sidebar items; unavailable telemedicine/hospital areas are repurposed for implemented visit/feedback actions. The unsupported emergency-service graphic is covered by a real feedback/settings action.

Opaque HTML regions cover all baked-in patient names, results and counters in the right workspace, and the sample clinician profile in the header. These regions contain the existing live forms and locally saved fictional records. This preserves the original header/logo/sidebar artwork while replacing the data area with functional controls; it is not a claim that static pixels or the unimplemented MRI AI have become a diagnostic system. The visual frame scales from its original 1672×941 coordinates at widths of at least 1000 pixels; smaller screens retain the accessible responsive forms. Failed image loading falls back to normal navigation without changing data. Reception and ADMIN keep their role-appropriate responsive workspaces.

Browser validation includes real mouse clicks over photograph navigation, hit testing for the live search field, appointment save, original asset selection per route, exact coverage of the baked-in data area, scaling and phone fallback. Existing authentication, clinical editing, backup/attachments and 28 domain/auth tests remain passing. Data is still local to each browser, without inter-device synchronization.

## Build 11: functional interiors aligned to the photographs

Replaced the generic right-hand workspace in the photographic doctor view with separately positioned live regions matching the actual supplied photograph: dashboard tiles/panels, patient filters/table, calendar grid and right-hand editor, record summary cards, history filters/timeline/summary, distributed visit fields, IDIKA/medication/copy panels and imaging library/viewer/findings. The original content rectangles use the source 1672×941 coordinate system. The original dashboard kidney artwork, clinic icons and official IDIKA artwork remain visible where they contain no variable patient data.

Explicit opaque masks remove the original sample names, results, counters, visit fields and unsupported legal claims beneath the live regions, including gaps between panels. Runtime values come from the local fictional workspace. Moving existing DOM controls preserves form ownership, IDs, autosave, schema and backup data. New/edit patient dialogs, full clinical editing and final-visit correction retain the responsive form layout when their source photograph has no corresponding form. Small screens reflow the same moved controls; an image error preserves data and exposes the responsive layout.

Validation: 28 domain/auth tests, browser checks for live interior layout on seven photographed pages, patient lookup, all distributed visit fields in their original form, findings save/report, manual medication save and the real external IDIKA link. Also passed core/auth/backup, clinical/files, optional modules/appointment lifecycle, imaging and startup-failure suites. The desktop photo region test confirms the calendar editor's source coordinates. Automated browser viewport checks do not establish physical Windows, Safari/iOS or Android certification. AI analysis, production authentication and inter-device synchronization remain outside this demo.

## Build 12: readable photographic typography

Fixed the dark-theme/light-photo contrast mismatch that made workspace headings nearly white on white. Photographic workspaces now use dark navy titles (30 px), stronger 14 px build metadata and higher-contrast labels/input text. Live panel headings, body text, table text and form controls are larger; primary actions retain white text on blue/green. Original PNG pixels are unchanged. A browser check covers both theme selections, title/metadata/control colors and sizes, visit saving and tablet/phone overflow.

## Build 13: replace remaining legacy workspaces

Applied the same readable blue/white panel system to every remaining doctor, reception and ADMIN workspace: patient creation/editing, full clinical history/notes/documents, examination entry/history, settings/PIN/biometrics/backup, administration, reports/print views, statistics, feedback, workspaces and the inactive AI design view. Shared headings include consistent icons, strong navy titles, white form surfaces, readable labels and blue actions in both outer theme settings. Role permissions and local demo limitations are unchanged.

The clinical history form is now organized into three actual panels (general/family/allergies, urology/andrology/LUTS, diagnoses/medications) with one save footer. Examination entry is organized into metadata, results/notes and attachments panels. Existing DOM field IDs, form ownership, recovery and storage keys are retained. Settings, ADMIN and feedback use responsive panel columns; phone layouts stack without horizontal scrolling. The earlier photographed interior screens remain intact.

Browser validation covers the updated doctor/admin/reception interfaces, theme-independent contrast, clinical and exam saving, existing file/backup workflows, settings/admin controls, role isolation and desktop/tablet/mobile widths. These interfaces remain educational/local-only; production auth, automatic clinical AI and shared synchronization are not added by the visual redesign.


## Greek doctor testing guide

[Download the six-page Greek PDF](UroMed_Odigos_Giatrou_EL.pdf). Covers login with the public doctor demo account, fictional patients, visits, exams/imaging, external IDIKA, appointments, PDF/email drafts, backup, local storage and test feedback. No private credentials or real patient data are included.

## Build 14: presentation and examination results

Added a responsive Greek marketing page between startup and login, with working entry buttons, workflow navigation and the updated six-page doctor guide. The supplied Screen 5 and patient-management PNGs exactly match the already integrated assets, so no duplicate pages were added.

Integrated the new examination photograph with live patient-scoped categories, search, date filters, result details, attachments, imaging links, PSA chart/comparison and printable filtered reports. New and edited examinations use the existing validated editor and return to the results view after successful local save. Original sample results are masked. PSA comparison is arithmetic only and excludes incompatible units; no laboratory API or clinical AI is claimed.

Validation: 28 domain/auth tests plus browser suites for marketing/results, startup, clinical/files, core workflows, photographic navigation and grouped workspaces. Responsive checks cover desktop, tablet and phone viewport sizes, without claiming physical OS certification. Storage keys and existing fictional records are preserved.

## Build 15: clinics dashboard

Aligned Clinics with the home dashboard: blue/green clinic cards, live counts, today's appointment list and organization panel. Existing clinic-filtered calendar actions and ADMIN-managed names/hospital settings are preserved. Browser checks passed for card rendering, heading contrast, correct calendar filter and desktop/tablet/phone overflow. Storage is unchanged.

## Build 16: patient contact directory

Added a shared patient directory for doctor and reception with surname/name, AMKA, primary/secondary phone and email, accent-insensitive search, normalized phone lookup, tel/mailto links and existing edit/appointment actions. Clinical-record actions remain doctor-only. Contacts come from the same patient objects; secondary phone is optional and backwards compatible. Saving a patient with an already assigned nonempty AMKA is blocked and identifies the existing record; existing same-name confirmation remains. Browser checks passed for lookup, duplicate blocking, secondary-phone persistence, calendar links, responsive overflow and reception isolation; all 28 domain/auth tests pass. No automatic email delivery or production identity validation is added.

## Build 17: directory dashboard styling

Aligned the contact directory with Home: blue/green/purple summary cards computed from current patients, a distinct search panel, clearer column headings and alternating row surfaces. Contact actions and duplicate-AMKA checks are unchanged. Browser checks passed for search, duplicate blocking, secondary phone persistence, reception isolation and desktop/tablet/phone overflow.

## Build 18: supplied workspace screenshots

Changed the doctor home greeting to Παπαδόπουλος Βασίλειος. Unified Clinics, Directory, Reports/PDF and Access Settings using the Home dashboard's blue/green/purple cards, panel headings and spacing; directory retains the Build 17 design. Reports counters are patient-scoped, while settings cards describe existing capabilities without claiming activation. Existing forms, role guards and storage are preserved. Browser checks passed for all four pages at desktop/tablet/phone widths and the existing workspace save/access suite.

## Build 19: patient toolbar visibility

Fixed Screenshot 91's overlap between patient actions and the additional-filter region. Actions, extra-filter disclosure and search now occupy separate rows; secondary buttons have readable light-blue contrast. Expanded date filters grow above the list without clipping. Browser hit-testing passed for all three actions, expanded filter inputs, new-patient navigation and desktop/tablet/phone overflow.
