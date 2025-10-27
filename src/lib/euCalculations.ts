import { EU, Subject, GradeStats } from '@/types/grade';
import { calculateSubjectAverage } from './gradeCalculations';

export function calculateEUAverage(eu: EU): GradeStats {
  if (eu.subjects.length === 0) {
    return { current: 0, min: 0, max: 0, total: 0 };
  }

  let currentSum = 0;
  let minSum = 0;
  let maxSum = 0;
  let totalCoeff = 0;

  eu.subjects.forEach((subject) => {
    const subjectStats = calculateSubjectAverage(subject);
    
    if (subjectStats.total > 0) {
      totalCoeff += subject.coefficient;
      currentSum += subjectStats.current * subject.coefficient;
      minSum += subjectStats.min * subject.coefficient;
      maxSum += subjectStats.max * subject.coefficient;
    }
  });

  return {
    current: totalCoeff > 0 ? currentSum / totalCoeff : 0,
    min: totalCoeff > 0 ? minSum / totalCoeff : 0,
    max: totalCoeff > 0 ? maxSum / totalCoeff : 0,
    total: totalCoeff
  };
}

export function calculateGeneralAverageFromEUs(eus: EU[]): GradeStats {
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
