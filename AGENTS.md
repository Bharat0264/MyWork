<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Multi-Agent Collaboration Rules (Codex & Antigravity)

1. **Pull and Rebase First**: Always run `git fetch origin` and `git pull --rebase origin main` before starting work. Never overwrite another agent's commits.
2. **Commit and Push Incrementally**: Commit after completing each task and push to origin immediately.
3. **Never Force Push**: Never use `git push --force` or `--force-with-lease`. Never use `git reset --hard` on shared branches. Never rewrite history.
4. **Structured Commit Messages**: Use small, focused commits with conventional prefixes (`chore`, `fix`, `perf`, `refactor`, `docs`) and tag the agent in the commit message, e.g.:
   `fix: [agent-antigravity] resolve hydration mismatch in navigation bar`
5. **Live Production is the Specification**: Keep exactly what production does and shows. No unauthorized redesigns, copy changes, or route renames.
6. **Remote Repository**: Always push to `origin` (GitHub: `https://github.com/Bharat0264/MyWork.git`). Never push to `old-origin`.
