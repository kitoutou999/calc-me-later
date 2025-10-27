import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check } from 'lucide-react';
import { EU } from '@/types/grade';
import { exportData } from '@/lib/exportCompression';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eus: EU[];
}

export function ExportDialog({ open, onOpenChange, eus }: ExportDialogProps) {
  const [exportCode, setExportCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      // Generate compressed export code when dialog opens
      const encoded = exportData(eus);
      setExportCode(encoded);
      setCopied(false);
    }
  }, [open, eus]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Exporter mes données</DialogTitle>
          <DialogDescription>
            Copiez ce code et conservez-le précieusement. Vous pourrez l'importer plus tard pour restaurer toutes vos données.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            value={exportCode}
            readOnly
            className="font-mono text-xs min-h-[200px]"
            onClick={(e) => e.currentTarget.select()}
          />

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>📊 {eus.length} EU(s) exportée(s)</span>
            <span>•</span>
            <span>{exportCode.length} caractères</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button onClick={handleCopy} className="gap-2">
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copié !
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copier le code
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
