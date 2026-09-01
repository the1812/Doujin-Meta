---
name: add-doujin-album-data
description: Add or update album entries in this Doujin-Meta repository from external release pages such as Dizzylab or Bandcamp. Use when a user asks to add a new album under public/data, mirror an external album page into metadata.json, download a cover image, or follow the repository's existing album metadata conventions.
---

# Add Doujin Album Data

## Goal

Create a new `public/data/<album name>/` entry that matches this repository's existing local-json metadata style, uses verified source-page information, and includes a usable `cover.jpg` or `cover.png`.

## Workflow

1. Inspect nearby examples first.
   - Search `public/data` for the label, artist, catalog number, and source site ID.
   - Preserve the established compact style: shared album fields appear on the first track, later tracks omit repeated album-level fields unless they differ.

2. Verify the external source directly.
   - Prefer the exact URL or ID supplied by the user over search snippets.
   - If search results or cached snippets disagree with the page, treat the live page as authoritative and call out the mismatch if it affected the work.
   - On Dizzylab, capture at least: album title, label/album artist, release year/date, tags/genre, track titles, track artists/composers, source ID, and cover URL.
   - Do not infer a different album from adjacent recommendations, label pages, or stale search results.

3. Create the data folder.
   - Use the exact album title as the folder name unless Windows-forbidden characters must be removed.
   - Put files under `public/data/<album title>/`.
   - Add `metadata.json` and `cover.jpg` or `cover.png`.

4. Write `metadata.json`.
   - Use JSON array syntax.
   - First track should normally include:
     - `title`
     - `artists` if the displayed performing artist differs from composer or the existing local style uses artists
     - `composers` for track creators when source data shows track artist/creator
     - `album`
     - `albumOrder` for the catalog or source catalog number when present
     - `albumArtists`
     - `genres`
     - `year`
     - `extraData.links.dizzylab` or other supported link IDs
   - Later tracks should include only changed or track-specific fields.
   - For remixes, follow the existing pattern: set `artists` to remix artist plus original artist when useful, and set `composers` to the original composer when known.

5. Download the cover from the source page.
   - Use the source page's full-resolution cover URL when visible.
   - Keep the file below roughly 2 MB when practical, matching `CONTRIBUTING.md`.
   - Use the extension that matches the downloaded file.

6. Validate.
   - Parse the new `metadata.json` with a JSON parser, for example:
     ```powershell
     Get-Content 'public\data\<album>\metadata.json' | ConvertFrom-Json
     ```
   - Confirm cover file exists and has nonzero size.
   - Run `pnpm run type-check` when practical. If sandboxed Corepack/pnpm access fails with `EPERM`, rerun with normal permissions.
   - Validate this skill with UTF-8 mode on Windows if any skill file contains Chinese or other non-ASCII text:
     ```powershell
     python -X utf8 'C:\Users\Laevateinn\.codex\skills\.system\skill-creator\scripts\quick_validate.py' '.agents\skills\add-doujin-album-data'
     ```
     The validator imports `yaml`, so install `PyYAML` for the active Python first if needed:
     ```powershell
     python -m pip install PyYAML
     ```
   - Check `git status --short` and make sure only the intended album folder was added or changed.

## Dizzylab Notes

- `extraData.links.dizzylab` stores only the album ID, not the full URL.
- Dizzylab URLs render as `https://www.dizzylab.net/d/<id>`.
- The page title and `<h1>` may be more reliable than search-result titles when an ID has recently changed or caches are stale.
- The cover often appears in HTML as `https://cdn.dizzylab.net/media/cover/<id>.jpg`, but read the page instead of assuming the extension.
