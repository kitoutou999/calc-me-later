import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AddGradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (grade: any) => void;
}

export function AddGradeDialog({ open, onOpenChange, onAdd }: AddGradeDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'exact' | 'range'>('exact');
  const [exactValue, setExactValue] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [coefficient, setCoefficient] = useState('1');

  const handleSubmit = () => {
    if (!name || !coefficient) return;

    const gradeValue = type === 'exact'
      ? { type: 'exact' as const, value: parseFloat(exactValue) || 0 }
      : { type: 'range' as const, min: parseFloat(minValue) || 0, max: parseFloat(maxValue) || 0 };

    onAdd({
      name,
      value: gradeValue,
      coefficient: parseFloat(coefficient) || 1
    });

    // Reset form
    setName('');
    setType('exact');
    setExactValue('');
    setMinValue('');
    setMaxValue('');
    setCoefficient('1');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une note</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de l'évaluation</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Contrôle de mathématiques"
            />
          </div>

          <div>
            <Label>Type de note</Label>
            <RadioGroup value={type} onValueChange={(v) => setType(v as 'exact' | 'range')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exact" id="exact" />
                <Label htmlFor="exact">Note exacte</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="range" />
                <Label htmlFor="range">Intervalle de notes</Label>
              </div>
            </RadioGroup>
          </div>

          {type === 'exact' ? (
            <div>
              <Label htmlFor="value">Note sur 20</Label>
              <Input
                id="value"
                type="number"
                min="0"
                max="20"
                step="0.25"
                value={exactValue}
                onChange={(e) => setExactValue(e.target.value)}
                placeholder="15.5"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min">Note minimale</Label>
                <Input
                  id="min"
                  type="number"
                  min="0"
                  max="20"
                  step="0.25"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                  placeholder="12"
                />
              </div>
              <div>
                <Label htmlFor="max">Note maximale</Label>
                <Input
                  id="max"
                  type="number"
                  min="0"
                  max="20"
                  step="0.25"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                  placeholder="16"
                />
              </div>
            </div>
          )}

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
