import { useState } from 'react';
import { Grade } from '@/types/grade';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, CheckCircle2, Clock } from 'lucide-react';
import { EditGradeDialog } from './EditGradeDialog';
import { cn } from '@/lib/utils';

interface GradeItemProps {
  grade: Grade;
  onDelete: () => void;
  onUpdate: (grade: Grade) => void;
}

export function GradeItem({ grade, onDelete, onUpdate }: GradeItemProps) {
  const [showEdit, setShowEdit] = useState(false);

  const gradeDisplay = grade.value.type === 'exact' 
    ? `${grade.value.value}/20`
    : `${grade.value.min}-${grade.value.max}/20`;

  return (
    <>
      <div className={cn(
        "flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors border-l-4",
        grade.isConfirmed
          ? "bg-muted/50 border-green-500"
          : "bg-muted/30 border-orange-400 opacity-70"
      )}>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-lg">{gradeDisplay}</span>
            <Badge variant="outline">Coeff. {grade.coefficient}</Badge>
            {grade.value.type === 'range' && (
              <Badge variant="secondary">Intervalle</Badge>
            )}
            {grade.isConfirmed ? (
              <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="w-3 h-3" />
                Définitive
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 border-orange-400 text-orange-600">
                <Clock className="w-3 h-3" />
                En attente
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{grade.name}</p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEdit(true)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      <EditGradeDialog
        open={showEdit}
        onOpenChange={setShowEdit}
        grade={grade}
        onUpdate={(updated) => {
          onUpdate(updated);
          setShowEdit(false);
        }}
      />
    </>
  );
}
