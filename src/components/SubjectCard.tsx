import { useState } from 'react';
import { Subject } from '@/types/grade';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateSubjectAverage, getGradeColor } from '@/lib/gradeCalculations';
import { cn } from '@/lib/utils';
import { GradeItem } from './GradeItem';
import { AddGradeDialog } from './AddGradeDialog';
import { EditSubjectDialog } from './EditSubjectDialog';

interface SubjectCardProps {
  subject: Subject;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: () => void;
}

export function SubjectCard({ subject, onUpdateSubject, onDeleteSubject }: SubjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [showEditSubject, setShowEditSubject] = useState(false);
  
  const stats = calculateSubjectAverage(subject);
  const averageColor = getGradeColor(stats.current);

  const handleAddGrade = (grade: any) => {
    onUpdateSubject({
      ...subject,
      grades: [...subject.grades, { ...grade, id: crypto.randomUUID() }]
    });
    setShowAddGrade(false);
  };

  const handleDeleteGrade = (gradeId: string) => {
    onUpdateSubject({
      ...subject,
      grades: subject.grades.filter(g => g.id !== gradeId)
    });
  };

  const handleUpdateGrade = (updatedGrade: any) => {
    onUpdateSubject({
      ...subject,
      grades: subject.grades.map(g => g.id === updatedGrade.id ? updatedGrade : g)
    });
  };

  return (
    <>
      <Card className="overflow-hidden border-2 hover:shadow-md transition-all duration-300">
        <div 
          className="p-6 cursor-pointer bg-gradient-to-r from-card to-muted/20"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${subject.color}20`, color: subject.color }}
              >
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{subject.name}</h3>
                <p className="text-sm text-muted-foreground">Coefficient {subject.coefficient}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditSubject(true);
                }}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSubject();
                }}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-background rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Minimum</p>
              <p className="text-xl font-bold text-destructive">{stats.min.toFixed(2)}</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Moyenne</p>
              <p className={cn("text-2xl font-bold", averageColor)}>{stats.current.toFixed(2)}</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Maximum</p>
              <p className="text-xl font-bold text-accent">{stats.max.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {subject.grades.length} note{subject.grades.length !== 1 ? 's' : ''}
            </Badge>
            <Button variant="ghost" size="sm">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="p-6 pt-0 space-y-3 border-t">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-muted-foreground">Notes</h4>
              <Button
                size="sm"
                onClick={() => setShowAddGrade(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une note
              </Button>
            </div>
            
            {subject.grades.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune note ajoutée pour le moment
              </p>
            ) : (
              <div className="space-y-2">
                {subject.grades.map((grade) => (
                  <GradeItem
                    key={grade.id}
                    grade={grade}
                    onDelete={() => handleDeleteGrade(grade.id)}
                    onUpdate={handleUpdateGrade}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      <AddGradeDialog
        open={showAddGrade}
        onOpenChange={setShowAddGrade}
        onAdd={handleAddGrade}
      />

      <EditSubjectDialog
        open={showEditSubject}
        onOpenChange={setShowEditSubject}
        subject={subject}
        onUpdate={onUpdateSubject}
      />
    </>
  );
}
