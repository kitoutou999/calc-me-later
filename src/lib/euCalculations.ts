import { EU, Subject, GradeStats, Grade } from '@/types/grade';
import { calculateSubjectAverage } from './gradeCalculations';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskScore {
  score: number; // 0-100
  level: RiskLevel;
  message: string;
}

export function calculateEUAverage(eu: EU): GradeStats {
  if (eu.subjects.length === 0 && (!eu.grades || eu.grades.length === 0)) {
    return { current: 0, min: 0, max: 0, total: 0 };
  }

  let currentSum = 0;
  let minSum = 0;
  let maxSum = 0;
  let totalCoeff = 0;

  // Calculate stats for each subject
  eu.subjects.forEach((subject) => {
    const subjectStats = calculateSubjectAverage(subject);

    if (subjectStats.total > 0) {
      totalCoeff += subject.coefficient;
      currentSum += subjectStats.current * subject.coefficient;
      minSum += subjectStats.min * subject.coefficient;
      maxSum += subjectStats.max * subject.coefficient;
    }
  });

  // Add direct grades individually with their own coefficients
  if (eu.grades && eu.grades.length > 0) {
    eu.grades.forEach((grade) => {
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
  }

  return {
    current: totalCoeff > 0 ? currentSum / totalCoeff : 0,
    min: totalCoeff > 0 ? minSum / totalCoeff : 0,
    max: totalCoeff > 0 ? maxSum / totalCoeff : 0,
    total: totalCoeff
  };
}

export function calculateRiskScore(eu: EU, euStats: GradeStats): RiskScore {
  let riskScore = 0;

  // Collect all grades
  const allGrades: Grade[] = [];
  eu.subjects.forEach(subject => allGrades.push(...subject.grades));
  if (eu.grades) allGrades.push(...eu.grades);

  const totalAssessments = allGrades.length;

  // If no data, neutral risk
  if (totalAssessments === 0) {
    return { score: 50, level: 'medium', message: 'Aucune donnée' };
  }

  // Count confirmed grades
  const confirmedCount = allGrades.filter(g => g.isConfirmed).length;
  const confirmedPercentage = (confirmedCount / totalAssessments) * 100;

  // 1. Factor: Current average vs passing threshold (10/20) - MOST IMPORTANT
  const passingThreshold = 10;
  const currentAverage = euStats.current;

  if (currentAverage >= 14) {
    riskScore += 0; // Excellent, no risk from average
  } else if (currentAverage >= 12) {
    riskScore += 10; // Good, minimal risk
  } else if (currentAverage >= 10) {
    riskScore += 25; // Passing but close
  } else if (currentAverage >= 8) {
    riskScore += 50; // Below passing, high risk
  } else {
    riskScore += 70; // Very low, critical
  }

  // 2. Factor: Confirmed vs Unconfirmed grades
  // If grades are confirmed, we can trust the average more
  if (confirmedPercentage >= 80) {
    riskScore += 0; // Mostly confirmed, reliable data
  } else if (confirmedPercentage >= 50) {
    riskScore += 10; // Half confirmed, some uncertainty
  } else if (confirmedPercentage >= 20) {
    riskScore += 20; // Mostly estimates
  } else {
    riskScore += 30; // All estimates, high uncertainty
  }

  // 3. Factor: Number of assessments (impact on margin of error)
  // Only matters if we're in a borderline situation (10-12)
  if (currentAverage >= 10 && currentAverage < 12) {
    if (totalAssessments === 1) {
      riskScore += 20; // One bad grade could fail you
    } else if (totalAssessments === 2) {
      riskScore += 10; // Limited recovery options
    } else if (totalAssessments <= 4) {
      riskScore += 5; // Some recovery options
    }
    // 5+ assessments: no additional risk
  }

  // Cap at 100
  riskScore = Math.min(100, riskScore);

  // Determine level and message
  let level: RiskLevel;
  let message: string;

  if (riskScore <= 25) {
    level = 'low';
    message = 'Situation stable';
  } else if (riskScore <= 50) {
    level = 'medium';
    message = 'Attention requise';
  } else {
    level = 'high';
    message = 'Risque élevé';
  }

  // BONUS: If minimum average is >= 10, decrease risk level by one
  // This means even in the worst case scenario, the EU is passing
  if (euStats.min >= 10) {
    if (level === 'high') {
      level = 'medium';
      message = 'Validé même au pire';
    } else if (level === 'medium') {
      level = 'low';
      message = 'Validé garanti';
    }
    // If already 'low', keep it as is
  }

  return { score: riskScore, level, message };
}
