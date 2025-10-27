import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (subject: { name: string; coefficient: number; color: string }) => void;
}

const PRESET_COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', 
  '#EF4444', '#F97316', '#F59E0B', '#10B981', 
  '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6'
];

export function AddSubjectDialog({ open, onOpenChange, onAdd }: AddSubjectDialogProps) {
  const [name, setName] = useState('');
  const [coefficient, setCoefficient] = useState('1');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleSubmit = () => {
    if (!name || !coefficient) return;

    onAdd({
      name,
      coefficient: parseFloat(coefficient) || 1,
      color: selectedColor
    });

    // Reset form
    setName('');
    setCoefficient('1');
    setSelectedColor(PRESET_COLORS[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une matière</DialogTitle>
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
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
