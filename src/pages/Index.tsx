import { useState, useEffect } from 'react';
import { Subject } from '@/types/grade';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { SubjectCard } from '@/components/SubjectCard';
import { AddSubjectDialog } from '@/components/AddSubjectDialog';
import { StatCard } from '@/components/StatCard';
import { calculateGeneralAverage } from '@/lib/gradeCalculations';

const STORAGE_KEY = 'grade-calculator-subjects';

const Index = () => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [showAddSubject, setShowAddSubject] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  }, [subjects]);

  const generalStats = calculateGeneralAverage(subjects);

  const handleAddSubject = (subjectData: { name: string; coefficient: number; color: string }) => {
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      ...subjectData,
      grades: []
    };
    setSubjects([...subjects, newSubject]);
    setShowAddSubject(false);
  };

  const handleUpdateSubject = (updatedSubject: Subject) => {
    setSubjects(subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s));
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects(subjects.filter(s => s.id !== subjectId));
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
        {subjects.length > 0 && (
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

        {/* Add Subject Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddSubject(true)}
            size="lg"
            className="gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Ajouter une matière
          </Button>
        </div>

        {/* Subjects List */}
        {subjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Commencez par ajouter une matière</h2>
            <p className="text-muted-foreground mb-6">
              Créez vos matières avec leurs coefficients, puis ajoutez vos notes
            </p>
            <Button onClick={() => setShowAddSubject(true)} size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Créer ma première matière
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onUpdateSubject={handleUpdateSubject}
                onDeleteSubject={() => handleDeleteSubject(subject.id)}
              />
            ))}
          </div>
        )}
      </div>

      <AddSubjectDialog
        open={showAddSubject}
        onOpenChange={setShowAddSubject}
        onAdd={handleAddSubject}
      />
    </div>
  );
};

export default Index;
