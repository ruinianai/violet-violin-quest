export type NoteId = 'G' | 'D' | 'A' | 'E';

export type ViolinNote = {
  id: NoteId;
  name: string;
  frequency: number;
};

export const notes: Record<NoteId, ViolinNote> = {
  G: { id: 'G', name: 'G', frequency: 196.0 },
  D: { id: 'D', name: 'D', frequency: 293.66 },
  A: { id: 'A', name: 'A', frequency: 440.0 },
  E: { id: 'E', name: 'E', frequency: 659.25 },
};

export const noteList = Object.values(notes);

export function centsFromTarget(detectedFrequency: number, targetFrequency: number) {
  return 1200 * Math.log2(detectedFrequency / targetFrequency);
}
