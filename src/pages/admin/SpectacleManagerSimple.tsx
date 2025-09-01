import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, RefreshCw, Edit, Eye, Upload, Video, Image } from 'lucide-react';

interface Spectacle {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  short_description?: string;
  age_range?: string;
  duration?: number;
  language?: string;
  status?: 'draft' | 'published' | 'archived';
  price_individual?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Allow additional fields from database
}

export default function SpectacleManagerSimple() {
  const [spectacles, setSpectacles] = useState<Spectacle[]>([]);
  const [selectedSpectacle, setSelectedSpectacle] = useState<Spectacle | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    age_range: '',
    duration: 0,
    price_individual: 0,
    price_group: 0,
    price_school: 0,
    language: 'Français',
    status: 'draft' as const,
    main_image_url: '',
    video_url: '',
    synopsis: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSpectacles();
  }, []);

  const fetchSpectacles = async () => {
    try {
      setLoading(true);
      console.log('Fetching spectacles...');
      
      const { data, error } = await supabase
        .from('spectacles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "Erreur de base de données",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      console.log('Setting spectacles:', data);
      setSpectacles(data || []);
      
      toast({
        title: "Spectacles chargés",
        description: `${data?.length || 0} spectacle(s) trouvé(s)`
      });
      
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les spectacles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSpectacle = (spectacle: Spectacle) => {
    setSelectedSpectacle(spectacle);
    setFormData({
      title: spectacle.title || '',
      description: spectacle.description || '',
      short_description: spectacle.short_description || '',
      age_range: spectacle.age_range || '',
      duration: spectacle.duration || 0,
      price_individual: spectacle.price_individual || 0,
      price_group: spectacle.price_group || 0,
      price_school: spectacle.price_school || 0,
      language: spectacle.language || 'Français',
      status: spectacle.status || 'draft',
      main_image_url: spectacle.main_image_url || '',
      video_url: spectacle.video_url || '',
      synopsis: spectacle.synopsis || ''
    });
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      if (creating) {
        const { data, error } = await supabase
          .from('spectacles')
          .insert([{
            ...formData,
            slug: slug
          }])
          .select()
          .single();

        if (error) throw error;

        setSpectacles(prev => [data, ...prev]);
        setSelectedSpectacle(data);
        setCreating(false);
      } else if (selectedSpectacle) {
        const { data, error } = await supabase
          .from('spectacles')
          .update({
            ...formData,
            slug: slug
          })
          .eq('id', selectedSpectacle.id)
          .select()
          .single();

        if (error) throw error;

        setSpectacles(prev => prev.map(s => s.id === selectedSpectacle.id ? data : s));
        setSelectedSpectacle(data);
      }
      
      setEditing(false);
      toast({
        title: creating ? "Spectacle créé" : "Spectacle mis à jour",
        description: creating ? "Le spectacle a été créé avec succès." : "Les modifications ont été sauvegardées."
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const startCreating = () => {
    setCreating(true);
    setEditing(true);
    setSelectedSpectacle(null);
    setFormData({
      title: '',
      description: '',
      short_description: '',
      age_range: '',
      duration: 0,
      price_individual: 0,
      price_group: 0,
      price_school: 0,
      language: 'Français',
      status: 'draft',
      main_image_url: '',
      video_url: '',
      synopsis: ''
    });
  };

  return (
    <DashboardLayout title="Gestion des Spectacles">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Spectacles</h1>
        <div className="flex gap-2">
          <Button
            onClick={fetchSpectacles}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {loading ? 'Chargement...' : 'Actualiser'}
          </Button>
          <Button
            onClick={startCreating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Spectacle
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spectacles List */}
        <Card>
          <CardHeader>
            <CardTitle>Spectacles ({spectacles.length})</CardTitle>
            <CardDescription>
              Liste de tous les spectacles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : spectacles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun spectacle trouvé
              </div>
            ) : (
              <div className="space-y-2">
                {spectacles.map((spectacle) => (
                  <div
                    key={spectacle.id}
                    className="p-3 border rounded-lg"
                  >
                    <h3 className="font-medium">{spectacle.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {spectacle.age_range} • {spectacle.duration}min
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {spectacle.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Form */}
        {creating && (
          <Card>
            <CardHeader>
              <CardTitle>Nouveau Spectacle</CardTitle>
              <CardDescription>
                Créer un nouveau spectacle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={newSpectacle.title}
                  onChange={(e) => setNewSpectacle(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre du spectacle"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSpectacle.description}
                  onChange={(e) => setNewSpectacle(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description du spectacle"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="age_range">Tranche d'âge</Label>
                <Input
                  id="age_range"
                  value={newSpectacle.age_range}
                  onChange={(e) => setNewSpectacle(prev => ({ ...prev, age_range: e.target.value }))}
                  placeholder="ex: 6-12 ans"
                />
              </div>
              
              <div>
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newSpectacle.duration}
                  onChange={(e) => setNewSpectacle(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  placeholder="60"
                />
              </div>
              
              <div>
                <Label htmlFor="price">Prix individuel (DH)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newSpectacle.price_individual}
                  onChange={(e) => setNewSpectacle(prev => ({ ...prev, price_individual: parseFloat(e.target.value) || 0 }))}
                  placeholder="80"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={createSpectacle} className="flex-1">
                  Créer
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCreating(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
