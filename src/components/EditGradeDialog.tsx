import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Grade } from '@/types/grade';

interface EditGradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grade: Grade;
  onUpdate: (grade: Grade) => void;
}

export function EditGradeDialog({ open, onOpenChange, grade, onUpdate }: EditGradeDialogProps) {
  const [name, setName] = useState(grade.name);
  const [type, setType] = useState<'exact' | 'range'>(grade.value.type);
  const [exactValue, setExactValue] = useState(
    grade.value.type === 'exact' ? grade.value.value.toString() : ''
  );
  const [minValue, setMinValue] = useState(
    grade.value.type === 'range' ? grade.value.min.toString() : ''
  );
  const [maxValue, setMaxValue] = useState(
    grade.value.type === 'range' ? grade.value.max.toString() : ''
  );
  const [coefficient, setCoefficient] = useState(grade.coefficient.toString());
  const [isConfirmed, setIsConfirmed] = useState(grade.isConfirmed || false);

  useEffect(() => {
    setName(grade.name);
    setType(grade.value.type);
    setCoefficient(grade.coefficient.toString());
    setIsConfirmed(grade.isConfirmed || false);

    if (grade.value.type === 'exact') {
      setExactValue(grade.value.value.toString());
      setMinValue('');
      setMaxValue('');
    } else {
      setMinValue(grade.value.min.toString());
      setMaxValue(grade.value.max.toString());
      setExactValue('');
    }
  }, [grade]);

  // Handle type change to reset values
  useEffect(() => {
    if (type === 'exact') {
      setMinValue('');
      setMaxValue('');
    } else {
      setExactValue('');
    }
  }, [type]);

  const handleSubmit = () => {
    if (!name || !coefficient) return;

    const coeffValue = parseFloat(coefficient);
    if (isNaN(coeffValue) || coeffValue <= 0) {
      alert('Le coefficient doit être un nombre strictement positif');
      return;
    }

    let gradeValue;
    if (type === 'exact') {
      const exactVal = parseFloat(exactValue);
      if (isNaN(exactVal) || exactValue === '') {
        alert('Veuillez saisir une note valide');
        return;
      }
      gradeValue = { type: 'exact' as const, value: exactVal };
    } else {
      const minVal = parseFloat(minValue);
      const maxVal = parseFloat(maxValue);
      if (isNaN(minVal) || minValue === '' || isNaN(maxVal) || maxValue === '') {
        alert('Veuillez saisir des notes minimale et maximale valides');
        return;
      }
      if (minVal > maxVal) {
        alert('La note minimale ne peut pas être supérieure à la note maximale');
        return;
      }
      gradeValue = { type: 'range' as const, min: minVal, max: maxVal };
    }

    onUpdate({
      ...grade,
      name,
      value: gradeValue,
      coefficient: coeffValue,
      isConfirmed
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier la note</DialogTitle>
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirmed"
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
            />
            <Label
              htmlFor="confirmed"
              className="text-sm font-normal cursor-pointer"
            >
              Note définitive (validée et confirmée)
            </Label>
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
