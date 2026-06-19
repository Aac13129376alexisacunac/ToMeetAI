/**
 * Types for AcomodaAI application
 */

export interface Guest {
  id: string;
  name: string;
  diet?: string;     // e.g. "Vegano", "Vegetariano", "Celíaco", "Sin restricciones"
  conflictTags: string[]; // List of names this person dislikes / has conflicts with
  affinityTags: string[]; // List of names this person wants to be seated with
  attributes: string[]; // e.g., "Hablador", "Tímido", "Gracioso", "Jefa"
  rawText: string;
}

export interface Table {
  id: string;
  name: string;
  guests: Guest[];
  harmonyScore: number; // 0-100%
  achievedAffinities: string[];
  resolvedConflicts: string[];
}
