// The Observatory Press — the record's publishing arm. A dispatch is not
// journalism about the record; it IS the record, rendered for readers. The
// editorial charter is short and binding:
//
//   1. Every claim in a dispatch traces to a record entry (evidence, forecast,
//      revision, cycle, or experiment) named in recordRefs.
//   2. Corrections happen in the revision log, never by silent edit — a
//      published dispatch is frozen like any other artifact.
//   3. Obligations, never claims: the superlative gate applies to dispatch
//      prose exactly as it applies to readings.
//   4. No embargoes, no access, no exclusives. Everything ships to everyone
//      at once, machine-readable included.
//
// Entries live in dispatches.json so the mesh can author them under its
// publishing power; the gate validates them like any record collection.
import raw from './dispatches.json';

export type DispatchKind = 'dispatch' | 'data-release' | 'notice';

export interface Dispatch {
  slug: string;
  no: number; // issue number, monotonic
  date: string;
  kind: DispatchKind;
  title: string;
  standfirst: string; // one-paragraph summary above the fold
  body: string[]; // paragraphs, rendered as-is
  recordRefs: string[]; // ids/paths on the record this dispatch derives from
  // One record, many registers: a plain-language rendering generated from the
  // same source of truth, so the registers cannot diverge. An epistemic
  // institution only the initiated can read fails its own publication clause.
  plain?: string[];
}

export const DISPATCH_KIND_LABEL: Record<DispatchKind, string> = {
  dispatch: 'Dispatch',
  'data-release': 'Data release',
  notice: 'Notice',
};

export const DISPATCHES: Dispatch[] = raw as Dispatch[];
