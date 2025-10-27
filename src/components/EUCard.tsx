import { useState } from 'react';
import { EU } from '@/types/grade';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Plus, Trash2, Edit2, ChevronDown, ChevronUp, AlertTriangle, Shield, AlertCircle } from 'lucide-react';
import { calculateEUAverage, getGradeColor } from '@/lib/gradeCalculations';
import { calculateRiskScore } from '@/lib/euCalculations';
import { cn } from '@/lib/utils';
import { SubjectCard } from './SubjectCard';
import { AddSubjectDialog } from './AddSubjectDialog';
import { AddGradeDialog } from './AddGradeDialog';
import { GradeItem } from './GradeItem';
import { EditEUDialog } from './EditEUDialog';

interface EUCardProps {
  eu: EU;
  onUpdateEU: (eu: EU) => void;
  onDeleteEU: () => void;
}

export function EUCard({ eu, onUpdateEU, onDeleteEU }: EUCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [showEditEU, setShowEditEU] = useState(false);

  const stats = calculateEUAverage(eu);
  const averageColor = getGradeColor(stats.current);
  const riskScore = calculateRiskScore(eu, stats);

  const getRiskIcon = () => {
    switch (riskScore.level) {
      case 'low':
        return <Shield className="w-4 h-4" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getRiskColor = () => {
    switch (riskScore.level) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200';
    }
  };

  const handleAddSubject = (subjectData: any) => {
    const newSubject = {
      id: crypto.randomUUID(),
      ...subjectData,
      grades: []
    };
    onUpdateEU({
      ...eu,
      subjects: [...eu.subjects, newSubject]
    });
    setShowAddSubject(false);
  };

  const handleUpdateSubject = (updatedSubject: any) => {
    onUpdateEU({
      ...eu,
      subjects: eu.subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s)
    });
  };

  const handleDeleteSubject = (subjectId: string) => {
    onUpdateEU({
      ...eu,
      subjects: eu.subjects.filter(s => s.id !== subjectId)
    });
  };

  const handleAddGrade = (grade: any) => {
    onUpdateEU({
      ...eu,
      grades: [...(eu.grades || []), { ...grade, id: crypto.randomUUID() }]
    });
    setShowAddGrade(false);
  };

  const handleUpdateGrade = (updatedGrade: any) => {
    onUpdateEU({
      ...eu,
      grades: (eu.grades || []).map(g => g.id === updatedGrade.id ? updatedGrade : g)
    });
  };

  const handleDeleteGrade = (gradeId: string) => {
    onUpdateEU({
      ...eu,
      grades: (eu.grades || []).filter(g => g.id !== gradeId)
    });
  };

  return (
    <>
      <Card className="overflow-hidden border-2 hover:shadow-lg transition-all duration-300">
        <div 
          className="p-6 cursor-pointer bg-gradient-to-r from-card to-primary/5"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: `${eu.color}20`, color: eu.color }}
              >
                <GraduationCap className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold">{eu.name}</h2>
                  <Badge
                    variant="outline"
                    className={cn("gap-1 border", getRiskColor())}
                  >
                    {getRiskIcon()}
                    {riskScore.message}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Coefficient {eu.coefficient}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditEU(true);
                }}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteEU();
                }}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-background rounded-xl shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">Minimum</p>
              <p className="text-xl font-bold text-destructive">{stats.min.toFixed(2)}</p>
            </div>
            <div className="text-center p-4 bg-background rounded-xl shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">Moyenne</p>
              <p className={cn("text-2xl font-bold", averageColor)}>{stats.current.toFixed(2)}</p>
            </div>
            <div className="text-center p-4 bg-background rounded-xl shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">Maximum</p>
              <p className="text-xl font-bold text-accent">{stats.max.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-sm">
                {eu.subjects.length} matière{eu.subjects.length !== 1 ? 's' : ''}
              </Badge>
              {eu.grades && eu.grades.length > 0 && (
                <Badge variant="outline" className="text-sm">
                  {eu.grades.length} note{eu.grades.length !== 1 ? 's' : ''} directe{eu.grades.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="p-6 pt-0 space-y-4 border-t bg-muted/20">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-muted-foreground">Contenu</h4>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddGrade(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une note
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowAddSubject(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une matière
                </Button>
              </div>
            </div>

            {/* Direct Grades Section */}
            {eu.grades && eu.grades.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase">Notes directes</h5>
                <div className="space-y-2">
                  {eu.grades.map((grade) => (
                    <GradeItem
                      key={grade.id}
                      grade={grade}
                      onDelete={() => handleDeleteGrade(grade.id)}
                      onUpdate={handleUpdateGrade}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Subjects Section */}
            {eu.subjects.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase">Matières</h5>
                <div className="space-y-3">
                  {eu.subjects.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={subject}
                      onUpdateSubject={handleUpdateSubject}
                      onDeleteSubject={() => handleDeleteSubject(subject.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {eu.subjects.length === 0 && (!eu.grades || eu.grades.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune matière ou note ajoutée pour le moment
              </p>
            )}
          </div>
        )}
      </Card>

      <AddSubjectDialog
        open={showAddSubject}
        onOpenChange={setShowAddSubject}
        onAdd={handleAddSubject}
      />

      <AddGradeDialog
        open={showAddGrade}
        onOpenChange={setShowAddGrade}
        onAdd={handleAddGrade}
      />

      <EditEUDialog
        open={showEditEU}
        onOpenChange={setShowEditEU}
        eu={eu}
        onUpdate={onUpdateEU}
      />
    </>
  );
}
