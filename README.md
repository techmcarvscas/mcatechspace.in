# MCA-LANDING

Official Android application showcase portal for the **Department of Master of Computer Applications (MCA)**, **School of Computer Studies**, **RVS College of Arts and Science**.

## Features
- **RVS CAS Institutional Theme**: Styled with the official college palette (`#7C0201`, `#EDE9DA`, `#1B242F`, `#FAAE53`).
- **Interactive Showcase**: 3D tilted mobile hero showcase, Flagship Spotlight, alternating Published Applications directory with category filtering, and an interactive 5-step Student App Journey roadmap.
- **JSON-Powered Static CMS**:
  - Content lives in `public/data/site-config.json`, `public/data/apps.json`, and `public/data/releases.json`.
  - Secret admin console accessible via `Ctrl + Shift + M` (`PIN: MCA2025`) with local draft previews and JSON export/import.

## Development
```bash
npm install
npm run dev
npm run build
```
