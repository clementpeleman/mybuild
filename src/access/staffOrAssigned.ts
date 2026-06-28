import type { Access } from 'payload'

/**
 * Read access for werf-scoped data.
 * - Staff (CMS-medewerkers met `isStaff`) zien alles.
 * - Andere ingelogde gebruikers (bouwheer/werfleider) zien enkel de werven
 *   waaraan ze gekoppeld zijn via `allowedUsers`.
 * - Niet-ingelogd: geen toegang (privé klantenportaal).
 */
export const projectReadAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.isStaff) return true
  return {
    allowedUsers: {
      equals: user.id,
    },
  }
}

/**
 * Zelfde logica maar via de gekoppelde werf, voor collecties die naar een
 * `project` verwijzen (bv. vluchten).
 */
export const flightReadAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.isStaff) return true
  return {
    'project.allowedUsers': {
      equals: user.id,
    },
  }
}

/** Alleen staff mag aanmaken/wijzigen/verwijderen. */
export const staffOnly: Access = ({ req: { user } }) => Boolean(user?.isStaff)
