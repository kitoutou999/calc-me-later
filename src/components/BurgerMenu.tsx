import { useState } from 'react';
import { Menu, Moon, Sun, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme-provider';
import { EU } from '@/types/grade';
import { ExportDialog } from './ExportDialog';
import { ImportDialog } from './ImportDialog';

interface BurgerMenuProps {
  eus: EU[];
  onImport: (eus: EU[]) => void;
}

export function BurgerMenu({ eus, onImport }: BurgerMenuProps) {
  const { theme, setTheme } = useTheme();
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Menu className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={toggleTheme}>
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4 mr-2" />
                Mode sombre
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 mr-2" />
                Mode clair
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setShowExport(true)}>
            <Download className="w-4 h-4 mr-2" />
            Exporter mes données
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setShowImport(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Importer des données
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ExportDialog
        open={showExport}
        onOpenChange={setShowExport}
        eus={eus}
      />

      <ImportDialog
        open={showImport}
        onOpenChange={setShowImport}
        onImport={onImport}
      />
    </>
  );
}
