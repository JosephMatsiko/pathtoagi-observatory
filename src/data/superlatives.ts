// The Superlatives Register — every commissioned superlative translated into a
// measurable obligation with an honest current reading. The proper form of the
// superlative is not boast; it is obligation. The mesh reads this register as
// memory and works toward it; it may update readings as evidence earns them,
// but the words themselves are the commission and stay.
import raw from './superlatives.json';

export type SuperlativeTrend = 'earning' | 'holding' | 'slipping';

export interface Superlative {
  id: string;
  word: string;
  obligation: string;
  measure: string;
  reading: string;
  trend: SuperlativeTrend;
}

export const SUPERLATIVES: Superlative[] = raw as Superlative[];
