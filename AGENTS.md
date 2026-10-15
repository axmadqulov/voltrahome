<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- App state (auth, devices, bills, notifications, prefs) lives in `src/lib/store.tsx` (React Context + localStorage) — demo app with no backend.
- Device/payment calls go through `src/services/api.ts` mock services — swap in real IoT/payment APIs there without touching pages.
- `/dashboard` layout is `ssr: false` and guards via localStorage session in `beforeLoad` — session only exists client-side.
- Shared UI lives in `src/components/app/`; route files must not import from other route files (breaks code splitting).
