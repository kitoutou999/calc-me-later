export type GradeValue = 
  | { type: 'exact'; value: number }
  | { type: 'range'; min: number; max: number };

export interface Grade {
  id: string;
  value: GradeValue;
  coefficient: number;
  name: string;
  isConfirmed?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  coefficient: number;
  color: string;
  grades: Grade[];
}

export interface EU {
  id: string;
  name: string;
  coefficient: number;
  color: string;
  subjects: Subject[];
  grades?: Grade[];
}

export interface GradeStats {
  current: number;
  min: number;
  max: number;
  total: number;
}
