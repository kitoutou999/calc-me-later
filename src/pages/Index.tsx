import { useState, useEffect } from 'react';
import { EU } from '@/types/grade';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { EUCard } from '@/components/EUCard';
import { AddEUDialog } from '@/components/AddEUDialog';
import { StatCard } from '@/components/StatCard';
import { calculateGeneralAverage } from '@/lib/gradeCalculations';

const STORAGE_KEY = 'grade-calculator-eus';

const Index = () => {
  const [eus, setEus] = useState<EU[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [showAddEU, setShowAddEU] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eus));
  }, [eus]);

  const generalStats = calculateGeneralAverage(eus);

  const handleAddEU = (euData: { name: string; coefficient: number; color: string }) => {
    const newEU: EU = {
      id: crypto.randomUUID(),
      ...euData,
      subjects: []
    };
    setEus([...eus, newEU]);
    setShowAddEU(false);
  };

  const handleUpdateEU = (updatedEU: EU) => {
    setEus(eus.map(e => e.id === updatedEU.id ? updatedEU : e));
  };

  const handleDeleteEU = (euId: string) => {
    setEus(eus.filter(e => e.id !== euId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Calculateur de Moyenne
          </h1>
          <p className="text-muted-foreground text-lg">
            Suivez vos notes et anticipez votre moyenne générale
          </p>
        </div>

        {/* Stats Dashboard */}
        {eus.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="Moyenne Minimale"
              value={generalStats.min.toFixed(2)}
              subtitle="Scénario pessimiste"
              icon={TrendingDown}
              variant="danger"
            />
            <StatCard
              title="Moyenne Actuelle"
              value={generalStats.current.toFixed(2)}
              subtitle="Basée sur les intervalles"
              icon={Award}
              variant={generalStats.current >= 12 ? 'success' : generalStats.current >= 10 ? 'warning' : 'danger'}
            />
            <StatCard
              title="Moyenne Maximale"
              value={generalStats.max.toFixed(2)}
              subtitle="Scénario optimiste"
              icon={TrendingUp}
              variant="success"
            />
          </div>
        )}

        {/* Add EU Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddEU(true)}
            size="lg"
            className="gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Ajouter une EU
          </Button>
        </div>

        {/* EUs List */}
        {eus.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Commencez par créer une Unité d'Enseignement</h2>
            <p className="text-muted-foreground mb-6">
              Une EU peut contenir une ou plusieurs matières avec leurs notes
            </p>
            <Button onClick={() => setShowAddEU(true)} size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Créer ma première EU
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {eus.map((eu) => (
              <EUCard
                key={eu.id}
                eu={eu}
                onUpdateEU={handleUpdateEU}
                onDeleteEU={() => handleDeleteEU(eu.id)}
              />
            ))}
          </div>
        )}
      </div>

      <AddEUDialog
        open={showAddEU}
        onOpenChange={setShowAddEU}
        onAdd={handleAddEU}
      />
    </div>
  );
};

export default Index;
