import Dexie, { type EntityTable } from 'dexie';

interface Lot {
  id?: number;
  lotId: string;
  material: string;
  weight: number;
  timestamp: string;
  status: 'DRAFT' | 'QUEUED_OFFLINE' | 'SYNCED';
  gps: { lat: number; lng: number };
}

interface PriceBoard {
  id?: number;
  material: string;
  minPrice: number;
  maxPrice: number;
  lastUpdated: string;
}

const db = new Dexie('ScrapPulseDB') as Dexie & {
  lots: EntityTable<Lot, 'id'>;
  prices: EntityTable<PriceBoard, 'id'>;
};

db.version(1).stores({
  lots: '++id, lotId, material, status, timestamp',
  prices: '++id, material, lastUpdated'
});

export { db };
