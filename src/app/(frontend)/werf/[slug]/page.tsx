import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import React, { cache } from 'react'

import Iframe from '@/components/Iframe'

export const dynamic = 'force-dynamic' // privé portaal: nooit statisch cachen

type Args = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ vlucht?: string }>
}

const STATUS_LABELS: Record<string, string> = {
  prep: 'In voorbereiding',
  active: 'Actief',
  done: 'Afgewerkt',
}

const fmtDate = (d?: string | null) =>
  d
    ? new Intl.DateTimeFormat('nl-BE', { day: '2-digit', month: 'short', year: 'numeric' }).format(
        new Date(d),
      )
    : '—'

export default async function WerfPage({ params, searchParams }: Args) {
  const { slug } = await params
  const { vlucht } = await searchParams

  const { project, flights, user } = await queryWerf(slug)

  if (!user) {
    return (
      <Gate>
        <p className="text-sm">
          Dit is een privé werfportaal. Log in om de opvolging te bekijken.
        </p>
        <Link
          href="/admin"
          className="mt-4 inline-block border border-black px-4 py-2 font-mono text-xs uppercase tracking-wider hover:bg-black hover:text-white"
        >
          Inloggen
        </Link>
      </Gate>
    )
  }

  if (!project) notFound()

  const selected = flights.find((f) => String(f.id) === vlucht) || flights[0] || null

  return (
    <main className="min-h-screen">
      {/* Kop — werfidentiteit, sober en datasheet-achtig */}
      <header className="border-b border-neutral-300">
        <div className="container flex flex-wrap items-end justify-between gap-4 py-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
              Werfopvolging
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">{project.name}</h1>
            <p className="mt-1 text-sm text-neutral-600">
              {project.client ? `Bouwheer: ${project.client}` : null}
              {project.address ? `  ·  ${project.address}` : null}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={project.status} />
            <span className="font-mono text-xs text-neutral-500">
              {flights.length} vlucht{flights.length === 1 ? '' : 'en'}
            </span>
          </div>
        </div>
      </header>

      <div className="container grid grid-cols-1 gap-8 py-8 lg:grid-cols-[260px_1fr]">
        {/* Tijdlijn van vluchten */}
        <aside className="lg:border-r lg:border-neutral-200 lg:pr-6">
          <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            Tijdlijn
          </h2>
          <ol className="space-y-px">
            {flights.length === 0 && (
              <li className="text-sm text-neutral-500">Nog geen vluchten.</li>
            )}
            {flights.map((f) => {
              const active = selected && f.id === selected.id
              return (
                <li key={f.id}>
                  <Link
                    href={`/werf/${slug}?vlucht=${f.id}`}
                    className={`flex items-baseline justify-between gap-3 border-l-2 py-2 pl-3 pr-2 transition-colors ${
                      active
                        ? 'border-orange-500 bg-neutral-50'
                        : 'border-transparent hover:bg-neutral-50'
                    }`}
                  >
                    <span className="font-mono text-xs tabular-nums text-neutral-700">
                      {fmtDate(f.date)}
                    </span>
                    <span className="truncate text-right text-sm">{f.title || 'Vlucht'}</span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </aside>

        {/* Geselecteerde vlucht: viewer + metingen */}
        <section>
          {!selected ? (
            <p className="text-sm text-neutral-500">Selecteer een vlucht in de tijdlijn.</p>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold">{selected.title || 'Vlucht'}</h2>
                <span className="font-mono text-xs tabular-nums text-neutral-500">
                  {fmtDate(selected.date)}
                </span>
              </div>

              {selected.summary && (
                <p className="mb-6 max-w-prose text-sm text-neutral-700">{selected.summary}</p>
              )}

              <ViewerStack flight={selected} />

              {Array.isArray(selected.measurements) && selected.measurements.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                    Metingen
                  </h3>
                  <table className="w-full border-collapse text-sm">
                    <tbody>
                      {selected.measurements.map((m: any, i: number) => (
                        <tr key={i} className="border-b border-neutral-200">
                          <td className="py-2 pr-4">{m.label || '—'}</td>
                          <td className="py-2 text-right font-mono tabular-nums">
                            {m.value ?? '—'}
                          </td>
                          <td className="py-2 pl-2 font-mono text-neutral-500">{m.unit || ''}</td>
                          <td className="py-2 pl-4 text-neutral-500">{m.note || ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}

const ViewerStack: React.FC<{ flight: any }> = ({ flight }) => {
  const viewers: { label: string; url: string }[] = [
    { label: 'Orthomosaic / kaart', url: flight.orthoUrl },
    { label: '3D-model', url: flight.modelUrl },
    { label: 'Puntenwolk', url: flight.pointcloudUrl },
  ].filter((v) => Boolean(v.url))

  if (viewers.length === 0) {
    return (
      <div className="border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
        Geen viewer beschikbaar voor deze vlucht.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {viewers.map((v) => (
        <figure key={v.label} className="border border-neutral-300">
          <figcaption className="flex items-center justify-between border-b border-neutral-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-500">
            {v.label}
          </figcaption>
          <div className="pt-10">
            <Iframe embedUrl={v.url} fill height={520} className="" />
          </div>
        </figure>
      ))}
    </div>
  )
}

const StatusPill: React.FC<{ status?: string | null }> = ({ status }) => {
  const dot =
    status === 'active'
      ? 'bg-orange-500'
      : status === 'done'
        ? 'bg-emerald-600'
        : 'bg-neutral-400'
  return (
    <span className="inline-flex items-center gap-2 border border-neutral-300 px-2 py-1 font-mono text-[11px] uppercase tracking-wider">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {STATUS_LABELS[status || ''] || 'Onbekend'}
    </span>
  )
}

const Gate: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
    <div className="max-w-sm border border-neutral-300 p-8">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
        MyBuild · werfportaal
      </p>
      {children}
    </div>
  </main>
)

const queryWerf = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) return { project: null, flights: [] as any[], user: null }

  const projectRes = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: false,
    user,
    depth: 1,
  })
  const project = projectRes.docs?.[0] || null

  if (!project) return { project: null, flights: [] as any[], user }

  const flightsRes = await payload.find({
    collection: 'flights',
    where: { project: { equals: project.id } },
    sort: '-date',
    limit: 100,
    overrideAccess: false,
    user,
    depth: 0,
  })

  return { project, flights: flightsRes.docs || [], user }
})

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  return { title: `Werf · ${slug} — MyBuild`, robots: { index: false, follow: false } }
}
