import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Subject } from '@/types/grade';

interface EditSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: Subject;
  onUpdate: (subject: Subject) => void;
}

const PRESET_COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', 
  '#EF4444', '#F97316', '#F59E0B', '#10B981', 
  '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6'
];

export function EditSubjectDialog({ open, onOpenChange, subject, onUpdate }: EditSubjectDialogProps) {
  const [name, setName] = useState(subject.name);
  const [coefficient, setCoefficient] = useState(subject.coefficient.toString());
  const [selectedColor, setSelectedColor] = useState(subject.color);

  useEffect(() => {
    setName(subject.name);
    setCoefficient(subject.coefficient.toString());
    setSelectedColor(subject.color);
  }, [subject]);

  const handleSubmit = () => {
    if (!name || !coefficient) return;

    onUpdate({
      ...subject,
      name,
      coefficient: parseFloat(coefficient) || 1,
      color: selectedColor
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier la matière</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject-name">Nom de la matière</Label>
            <Input
              id="subject-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Mathématiques"
            />
          </div>

          <div>
            <Label htmlFor="coefficient">Coefficient</Label>
            <Input
              id="coefficient"
              type="number"
              min="0.25"
              step="0.25"
              value={coefficient}
              onChange={(e) => setCoefficient(e.target.value)}
              placeholder="1"
            />
          </div>

          <div>
            <Label>Couleur</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-10 h-10 rounded-lg border-2 transition-all hover:scale-110"
                  style={{ 
                    backgroundColor: color,
                    borderColor: selectedColor === color ? color : 'transparent',
                    opacity: selectedColor === color ? 1 : 0.6
                  }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
