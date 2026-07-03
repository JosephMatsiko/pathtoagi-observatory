// Incident records: the Observatory treating its own failures as first-class
// evidence objects. These are not scandal logs; they are repair handles.
import raw from './incidents.json';

export type IncidentStatus = 'open' | 'contained' | 'resolved' | 'archived';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentCategory =
  | 'provenance-error'
  | 'temporal-framing-error'
  | 'execution-gap'
  | 'language-drift'
  | 'record-integrity'
  | 'evaluation-awareness';

export interface Incident {
  id: string;
  date: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  category: IncidentCategory;
  summary: string;
  impact: string;
  resolution: string;
  nextControl: string;
  recordRefs: string[];
}

export const INCIDENT_STATUS_LABEL: Record<IncidentStatus, string> = {
  open: 'Open',
  contained: 'Contained',
  resolved: 'Resolved',
  archived: 'Archived',
};

export const INCIDENT_STATUS_COLOR: Record<IncidentStatus, string> = {
  open: 'var(--color-verdict)',
  contained: 'hsl(34 96% 60%)',
  resolved: 'var(--color-affirm)',
  archived: 'var(--color-muted)',
};

export const INCIDENTS: Incident[] = raw as Incident[];
