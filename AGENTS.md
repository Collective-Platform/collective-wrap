# Contribution total updates

For routine updates to the displayed contribution total, edit
`src/components/LandingCard.tsx`.

- Update `OFFLINE_CONTRIBUTION` by the requested RM amount. It is added to the
  live `stats.totalRaised` amount returned by the giving API.
- Update the adjacent “as of” date comment to match the reported date.
- Only update `OFFLINE_CONTRIBUTORS` when the request also specifies a change
  to the number of offline contributors.

After changing the total, run `pnpm run build` to verify the site still builds.
