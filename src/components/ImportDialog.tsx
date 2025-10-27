import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload } from 'lucide-react';
import { EU } from '@/types/grade';
import { importData } from '@/lib/exportCompression';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (eus: EU[]) => void;
}

export function ImportDialog({ open, onOpenChange, onImport }: ImportDialogProps) {
  const [importCode, setImportCode] = useState('');
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState<EU[] | null>(null);

  const handleValidate = () => {
    try {
      setError('');
      setPreviewData(null);

      if (!importCode.trim()) {
        setError('Veuillez coller un code d\'export');
        return;
      }

      // Use the compression library to decode
      const data = importData(importCode);

      // Validate structure
      if (!Array.isArray(data)) {
        throw new Error('Format invalide: les données doivent être un tableau');
      }

      // Basic validation of EU structure
      for (const eu of data) {
        if (!eu.id || !eu.name || typeof eu.coefficient !== 'number') {
          throw new Error('Format invalide: structure EU incorrecte');
        }
      }

      setPreviewData(data);
    } catch (err) {
      setError('Code invalide. Veuillez vérifier que vous avez copié le code complet.');
      console.error('Import error:', err);
    }
  };

  const handleImport = () => {
    if (previewData) {
      const confirmed = window.confirm(
        '⚠️ Attention : Cette action remplacera toutes vos données actuelles. Voulez-vous continuer ?'
      );

      if (confirmed) {
        onImport(previewData);
        setImportCode('');
        setPreviewData(null);
        setError('');
        onOpenChange(false);
      }
    }
  };

  const handleClose = () => {
    setImportCode('');
    setPreviewData(null);
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importer des données</DialogTitle>
          <DialogDescription>
            Collez votre code d'export ci-dessous pour restaurer vos données.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            value={importCode}
            onChange={(e) => setImportCode(e.target.value)}
            placeholder="Collez votre code d'export ici..."
            className="font-mono text-xs min-h-[200px]"
          />

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {previewData && (
            <Alert>
              <Upload className="h-4 w-4" />
              <AlertDescription>
                <strong>Aperçu des données :</strong>
                <br />
                {previewData.length} EU(s) trouvée(s)
                <br />
                {previewData.reduce((acc, eu) => acc + eu.subjects.length, 0)} matière(s) au total
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          {!previewData ? (
            <Button onClick={handleValidate}>
              Valider le code
            </Button>
          ) : (
            <Button onClick={handleImport} variant="default" className="gap-2">
              <Upload className="w-4 h-4" />
              Importer les données
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
