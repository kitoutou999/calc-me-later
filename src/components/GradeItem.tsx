import { useState } from 'react';
import { Grade } from '@/types/grade';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2 } from 'lucide-react';
import { EditGradeDialog } from './EditGradeDialog';

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
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg">{gradeDisplay}</span>
            <Badge variant="outline">Coeff. {grade.coefficient}</Badge>
            {grade.value.type === 'range' && (
              <Badge variant="secondary">Intervalle</Badge>
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
