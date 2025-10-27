import { Subject, GradeStats, EU } from '@/types/grade';
import { calculateEUAverage } from './euCalculations';

export function calculateSubjectAverage(subject: Subject): GradeStats {
  if (subject.grades.length === 0) {
    return { current: 0, min: 0, max: 0, total: 0 };
  }

  let currentSum = 0;
  let minSum = 0;
  let maxSum = 0;
  let totalCoeff = 0;

  subject.grades.forEach((grade) => {
    totalCoeff += grade.coefficient;
    
    if (grade.value.type === 'exact') {
      const weighted = grade.value.value * grade.coefficient;
      currentSum += weighted;
      minSum += weighted;
      maxSum += weighted;
    } else {
      const avgWeighted = ((grade.value.min + grade.value.max) / 2) * grade.coefficient;
      currentSum += avgWeighted;
      minSum += grade.value.min * grade.coefficient;
      maxSum += grade.value.max * grade.coefficient;
    }
  });

  return {
    current: totalCoeff > 0 ? currentSum / totalCoeff : 0,
    min: totalCoeff > 0 ? minSum / totalCoeff : 0,
    max: totalCoeff > 0 ? maxSum / totalCoeff : 0,
    total: totalCoeff
  };
}

export function calculateGeneralAverage(eus: EU[]): GradeStats {
  if (eus.length === 0) {
    return { current: 0, min: 0, max: 0, total: 0 };
  }

  let currentSum = 0;
  let minSum = 0;
  let maxSum = 0;
  let totalCoeff = 0;

  eus.forEach((eu) => {
    const euStats = calculateEUAverage(eu);
    
    if (euStats.total > 0) {
      totalCoeff += eu.coefficient;
      currentSum += euStats.current * eu.coefficient;
      minSum += euStats.min * eu.coefficient;
      maxSum += euStats.max * eu.coefficient;
    }
  });

  return {
    current: totalCoeff > 0 ? currentSum / totalCoeff : 0,
    min: totalCoeff > 0 ? minSum / totalCoeff : 0,
    max: totalCoeff > 0 ? maxSum / totalCoeff : 0,
    total: totalCoeff
  };
}

export { calculateEUAverage } from './euCalculations';

export function getGradeColor(average: number): string {
  if (average >= 16) return 'text-accent';
  if (average >= 14) return 'text-primary';
  if (average >= 12) return 'text-blue-500';
  if (average >= 10) return 'text-warning';
  return 'text-destructive';
}
