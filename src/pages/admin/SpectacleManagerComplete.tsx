import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { seedRealSpectacles } from '@/utils/spectacleSeeder';
import { FileUpload } from '@/components/FileUpload';
import { testDatabaseConnection } from '@/utils/testDbConnection';
import { simpleSpectacleTest } from '@/utils/simpleSpectacleTest';
import { discoverSpectacleSchema } from '@/utils/discoverSchema';

interface SpectacleGallery {
  id: string;
  spectacle_id: string;
  image_url: string;
  caption?: string;
  display_order: number;
}
import { Plus, RefreshCw, Edit, Eye, Upload, Video, Image, Save, X, Database } from 'lucide-react';
import { toast } from 'sonner';

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
  price_group?: number;
  price_school?: number;
  main_image_url?: string;
  video_url?: string;
  synopsis?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export default function SpectacleManagerComplete() {
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
    status: 'draft' as 'draft' | 'published' | 'archived',
    main_image_url: '',
    video_url: '',
    synopsis: ''
  });

  useEffect(() => {
    fetchSpectacles();
  }, []);

  const fetchSpectacles = async () => {
    try {
      setLoading(true);
      console.log('Fetching spectacles...');
      
      // Test connection first
      const { data: testData, error: testError } = await supabase
        .from('spectacles')
        .select('count', { count: 'exact' });
      
      if (testError) {
        console.error('Database connection test failed:', testError);
        toast.error(`Connexion échouée: ${testError.message}`);
        return;
      }
      
      console.log('Database connection test successful. Count:', testData);
      
      const { data, error } = await supabase
        .from('spectacles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase fetch response:', { data, error, count: data?.length });

      if (error) {
        console.error('Supabase error:', error);
        toast.error(`Erreur de base de données: ${error.message}`);
        return;
      }
      
      console.log('Setting spectacles:', data);
      setSpectacles(data || []);
      
      if (data && data.length > 0) {
        toast.success(`${data.length} spectacle(s) chargé(s)`);
      } else {
        toast.info("Aucun spectacle trouvé dans la base de données");
      }
      
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error("Impossible de charger les spectacles");
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
      status: (spectacle.status as 'draft' | 'published' | 'archived') || 'draft',
      main_image_url: spectacle.main_image_url || '',
      video_url: spectacle.video_url || '',
      synopsis: spectacle.synopsis || ''
    });
    setEditing(false);
    setCreating(false);
  };

  const handleSave = async () => {
    try {
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
      if (selectedSpectacle) {
        // Update existing spectacle
        const { data, error } = await supabase
          .from('spectacles')
          .update({
            title: formData.title,
            description: formData.description,
            duration_minutes: formData.duration || 60,
            price: formData.price_individual || 50,
            poster_url: formData.main_image_url || '',
            is_active: formData.status === 'published'
          })
          .eq('id', selectedSpectacle.id)
          .select()
          .single();

        if (error) throw error;

        setSpectacles(prev => prev.map(s => s.id === selectedSpectacle.id ? data : s));
        setSelectedSpectacle(data);
      } else {
        // Create new spectacle
        const { data, error } = await supabase
          .from('spectacles')
          .insert([{
            title: formData.title,
            description: formData.description,
            duration_minutes: formData.duration || 60,
            price: formData.price_individual || 50,
            age_range_min: 4,
            age_range_max: 16,
            poster_url: formData.main_image_url || '',
            is_active: true
          }])
          .select()
          .single();

        if (error) throw error;

        setSpectacles(prev => [...prev, data]);
        setSelectedSpectacle(data);
      }
      
      setEditing(false);
      toast.success(selectedSpectacle ? "Spectacle mis à jour avec succès" : "Spectacle créé avec succès");
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(selectedSpectacle ? "Impossible de mettre à jour le spectacle" : "Impossible de créer le spectacle");
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

  const startEditing = () => {
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setCreating(false);
    if (selectedSpectacle) {
      handleSelectSpectacle(selectedSpectacle);
    }
  };

  const handleSeedRealData = async () => {
    try {
      setLoading(true);
      console.log('Starting import process...');
      
      const result = await seedRealSpectacles();
      console.log('Import result:', result);
      
      if (result && result.length > 0) {
        toast.success(`${result.length} spectacles importés depuis le site EDJS`);
        
        // Wait a moment then refresh
        setTimeout(async () => {
          await fetchSpectacles();
        }, 1000);
      } else {
        toast.error("Aucun spectacle n'a été importé");
      }

    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(`Erreur d'import: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Gestion des Spectacles">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Spectacles</h1>
        <div className="flex gap-2">
          <Button onClick={async () => {
            const result = await discoverSpectacleSchema();
            if (result.success) {
              toast.success(`${result.message} Colonnes: ${result.columns?.join(', ')}`);
            } else {
              toast.error(`Découverte échouée: ${result.error}`);
            }
          }} variant="outline" size="sm">
            Découvrir Schema
          </Button>
          <Button
            onClick={handleSeedRealData}
            variant="outline"
            disabled={loading}
            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          >
            <Database className="w-4 h-4 mr-2" />
            Importer du site EDJS
          </Button>
          <Button
            onClick={fetchSpectacles}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={startCreating}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Spectacle
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spectacles List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Spectacles ({spectacles.length})</CardTitle>
            <CardDescription>
              Cliquez sur un spectacle pour le modifier
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
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {spectacles.map((spectacle) => (
                  <div
                    key={spectacle.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedSpectacle?.id === spectacle.id ? 'bg-primary/10 border-primary' : ''
                    }`}
                    onClick={() => handleSelectSpectacle(spectacle)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{spectacle.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {spectacle.age_range_min || 4}-{spectacle.age_range_max || 16} ans • {spectacle.duration_minutes || spectacle.duration || 60}min
                        </p>
                        {spectacle.poster_url && (
                          <img 
                            src={spectacle.poster_url} 
                            alt={spectacle.title}
                            className="w-12 h-16 object-cover rounded mt-2"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={spectacle.is_active ? 'default' : 'secondary'}>
                            {spectacle.is_active ? 'Actif' : 'Archivé'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details/Edit Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {creating ? 'Nouveau Spectacle' : selectedSpectacle ? selectedSpectacle.title : 'Détails du Spectacle'}
              </CardTitle>
              {selectedSpectacle && !creating && (
                <div className="flex gap-2">
                  {editing ? (
                    <>
                      <Button onClick={handleSave} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button onClick={cancelEditing} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </>
                  ) : (
                    <Button onClick={startEditing} size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {(selectedSpectacle || creating) ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      disabled={!editing && !creating}
                      placeholder="Titre du spectacle"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Statut</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'draft' | 'published' | 'archived') => 
                        setFormData(prev => ({ ...prev, status: value }))}
                      disabled={!editing && !creating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Brouillon</SelectItem>
                        <SelectItem value="published">Publié</SelectItem>
                        <SelectItem value="archived">Archivé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="short_description">Description courte</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    disabled={!editing && !creating}
                    placeholder="Description courte pour les listes"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description complète</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    disabled={!editing && !creating}
                    placeholder="Description complète du spectacle"
                    rows={3}
                  />
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="age_range">Tranche d'âge</Label>
                    <Input
                      id="age_range"
                      value={formData.age_range}
                      onChange={(e) => setFormData(prev => ({ ...prev, age_range: e.target.value }))}
                      disabled={!editing && !creating}
                      placeholder="ex: 6-12 ans"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">Durée (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      disabled={!editing && !creating}
                      placeholder="60"
                    />
                  </div>

                  <div>
                    <Label htmlFor="language">Langue</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                      disabled={!editing && !creating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Français">Français</SelectItem>
                        <SelectItem value="Arabe">Arabe</SelectItem>
                        <SelectItem value="Anglais">Anglais</SelectItem>
                        <SelectItem value="Bilingue">Bilingue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tarification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price_individual">Prix individuel (DH)</Label>
                      <Input
                        id="price_individual"
                        type="number"
                        value={formData.price_individual}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_individual: parseFloat(e.target.value) || 0 }))}
                        disabled={!editing && !creating}
                        placeholder="80"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="price_group">Prix groupe (DH)</Label>
                      <Input
                        id="price_group"
                        type="number"
                        value={formData.price_group}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_group: parseFloat(e.target.value) || 0 }))}
                        disabled={!editing && !creating}
                        placeholder="70"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="price_school">Prix scolaire (DH)</Label>
                      <Input
                        id="price_school"
                        type="number"
                        value={formData.price_school}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_school: parseFloat(e.target.value) || 0 }))}
                        disabled={!editing && !creating}
                        placeholder="60"
                      />
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Médias</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FileUpload
                        type="image"
                        label="Image principale"
                        currentUrl={formData.main_image_url}
                        onUploadComplete={(url) => setFormData(prev => ({ ...prev, main_image_url: url }))}
                        onRemove={() => setFormData(prev => ({ ...prev, main_image_url: '' }))}
                        maxSize={5}
                        accept="image/*"
                      />
                    </div>
                    
                    <div>
                      <FileUpload
                        type="video"
                        label="Vidéo du spectacle"
                        currentUrl={formData.video_url}
                        onUploadComplete={(url) => setFormData(prev => ({ ...prev, video_url: url }))}
                        onRemove={() => setFormData(prev => ({ ...prev, video_url: '' }))}
                        maxSize={50}
                        accept="video/*"
                      />
                    </div>
                  </div>
                </div>

                {/* Synopsis */}
                <div>
                  <Label htmlFor="synopsis">Synopsis</Label>
                  <Textarea
                    id="synopsis"
                    value={formData.synopsis}
                    onChange={(e) => setFormData(prev => ({ ...prev, synopsis: e.target.value }))}
                    disabled={!editing && !creating}
                    placeholder="Synopsis détaillé du spectacle"
                    rows={4}
                  />
                </div>

                {(creating || editing) && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      {creating ? 'Créer' : 'Sauvegarder'}
                    </Button>
                    <Button onClick={cancelEditing} variant="outline" className="flex-1">
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  Sélectionnez un spectacle pour voir les détails ou créez-en un nouveau
                </div>
                <Button onClick={startCreating}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un spectacle
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
