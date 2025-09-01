import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, Calendar, Image, Video, Save, X, Upload, Clock, Users, MapPin, Database
} from 'lucide-react';
import { seedSpectacles, clearSpectacles } from '@/utils/seedSpectacles';

interface Spectacle {
  id: string;
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  age_range?: string;
  duration?: number;
  language?: string;
  status?: 'draft' | 'published' | 'archived';
  main_image_url?: string;
  gallery_images?: any[];
  video_url?: string;
  video_embed_code?: string;
  synopsis?: string;
  pedagogical_content?: string;
  technical_requirements?: string;
  price_individual?: number;
  price_group?: number;
  price_school?: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  created_by?: string;
  updated_by?: string;
}

export default function SpectacleManager() {
  const [spectacles, setSpectacles] = useState<Spectacle[]>([]);
  const [selectedSpectacle, setSelectedSpectacle] = useState<Spectacle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Spectacle>>({
    title: '',
    description: '',
    age_range_min: 3,
    age_range_max: 12,
    duration_minutes: 60,
    level_range: 'Primaire',
    price: 0,
    poster_url: '',
    is_active: true
  });

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
          description: `${error.message}`,
          variant: "destructive"
        });
        setSpectacles([]);
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
      setSpectacles([]);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    try {
      setIsSeeding(true);
      
      // Check if table exists by trying to select from it
      const { data: existingData, error: checkError } = await supabase
        .from('spectacles')
        .select('id')
        .limit(1);
      
      if (checkError) {
        toast({
          title: "Erreur de base de données",
          description: "La table 'spectacles' n'existe pas. Veuillez créer la table via les migrations Supabase d'abord.",
          variant: "destructive"
        });
        return;
      }
      
      // Complete spectacles data from existing HTML pages
      const sampleData = [
        {
          title: "Casse-Noisette",
          slug: "casse-noisette",
          description: "La féerie de Noël de Tchaïkovski. Un conte musical magique qui transporte les enfants dans l'univers féerique de Noël.",
          short_description: "La féerie de Noël de Tchaïkovski",
          age_range: "3-12 ans",
          duration: 45,
          language: "Français",
          status: "published" as const,
          price_individual: 80,
          price_group: 70,
          price_school: 60,
          main_image_url: "assets/edjs img/Casse-Noisette_Web_007.webp"
        },
        {
          title: "Alice chez les Merveilles",
          description: "Un voyage musical au pays des merveilles. Suivez Alice dans sa chute dans le terrier du Lapin Blanc et découvrez un monde fantastique peuplé de personnages extraordinaires.",
          age_range_min: 6,
          age_range_max: 16,
          duration_minutes: 45,
          level_range: "Primaire/Collège",
          price: 75,
          poster_url: "assets/images/alice-main.jpg",
          is_active: true
        },
        {
          title: "Charlotte",
          description: "Une histoire de courage et d'amitié. L'histoire touchante de Charlotte, une petite fille qui découvre la magie de l'amitié et de la solidarité.",
          age_range_min: 7,
          age_range_max: 15,
          duration_minutes: 50,
          level_range: "Primaire/Collège",
          price: 70,
          poster_url: "assets/images/charlotte-main.jpg",
          is_active: true
        },
        {
          title: "Le Petit Prince",
          description: "Un voyage poétique à travers les étoiles. L'adaptation théâtrale du chef-d'œuvre d'Antoine de Saint-Exupéry qui touche petits et grands.",
          age_range_min: 6,
          age_range_max: 18,
          duration_minutes: 55,
          level_range: "Primaire/Collège/Lycée",
          price: 85,
          poster_url: "assets/images/petit-prince-main.jpg",
          is_active: true
        },
        {
          title: "Tara sur la Lune",
          description: "Une aventure spatiale extraordinaire. Tara est passionnée par l'espace et les étoiles. Un spectacle qui stimule l'imagination et la curiosité scientifique.",
          age_range_min: 5,
          age_range_max: 12,
          duration_minutes: 45,
          level_range: "Primaire",
          price: 75,
          poster_url: "assets/images/tara-main.jpg",
          is_active: true
        },
        {
          title: "Antigone",
          description: "La tragédie de Sophocle pour les jeunes. Une adaptation moderne de la tragédie grecque qui aborde les thèmes de la justice, du courage et de la résistance.",
          age_range_min: 12,
          age_range_max: 18,
          duration_minutes: 60,
          level_range: "Collège/Lycée",
          price: 90,
          poster_url: "assets/images/antigone-main.jpg",
          is_active: true
        },
        {
          title: "Estevanico",
          description: "L'épopée du premier explorateur africain des Amériques. Un spectacle musical qui raconte l'histoire extraordinaire d'Estevanico et ses aventures.",
          age_range_min: 9,
          age_range_max: 18,
          duration_minutes: 60,
          level_range: "Collège/Lycée",
          price: 85,
          poster_url: "assets/images/estevanico-main.jpg",
          is_active: true
        },
        {
          title: "L'eau là",
          description: "Une sensibilisation poétique à l'écologie. Un spectacle musical qui aborde les enjeux environnementaux avec poésie et sensibilité.",
          age_range_min: 6,
          age_range_max: 14,
          duration_minutes: 40,
          level_range: "Primaire/Collège",
          price: 70,
          poster_url: "assets/images/leau-la-main.jpg",
          is_active: true
        },
        {
          title: "L'enfant de l'arbre",
          description: "Un conte magique sur la nature. L'histoire d'un enfant qui découvre les secrets de la forêt et l'importance de protéger la nature.",
          age_range_min: 5,
          age_range_max: 12,
          duration_minutes: 45,
          level_range: "Primaire",
          price: 70,
          poster_url: "assets/img/spectacles/enfant de l'arbre.png",
          is_active: true
        },
        {
          title: "Simple comme bonjour !",
          description: "La poésie sensible et engagée de Prévert. Un spectacle musical qui met en scène les plus beaux poèmes de Jacques Prévert avec humour et émotion.",
          age_range_min: 8,
          age_range_max: 16,
          duration_minutes: 50,
          level_range: "Primaire/Collège",
          price: 75,
          poster_url: "assets/images/prevert-main.jpg",
          is_active: true
        }
      ];

      const { data, error } = await supabase
        .from('spectacles')
        .insert(sampleData)
        .select();

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Table créée et ${data?.length || 0} spectacles ajoutés avec succès`
      });

      fetchSpectacles();
    } catch (error: any) {
      console.error('Seed error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter les spectacles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const slug = generateSlug(formData.title || '');
      const spectacleData = {
        ...formData,
        slug,
        updated_by: (await supabase.auth.getUser()).data.user?.id
      };

      if (isCreating) {
        spectacleData.created_by = (await supabase.auth.getUser()).data.user?.id;
        
        const { data, error } = await supabase
          .from('spectacles')
          .insert([spectacleData])
          .select()
          .single();

        if (error) throw error;
        
        setSpectacles(prev => [data, ...prev]);
        setSelectedSpectacle(data);
        setIsCreating(false);
        
        toast({
          title: "Spectacle créé",
          description: "Le spectacle a été créé avec succès"
        });
      } else if (selectedSpectacle) {
        const { data, error } = await supabase
          .from('spectacles')
          .update(spectacleData)
          .eq('id', selectedSpectacle.id)
          .select()
          .single();

        if (error) throw error;
        
        setSpectacles(prev => prev.map(s => s.id === selectedSpectacle.id ? data : s));
        setSelectedSpectacle(data);
        
        toast({
          title: "Spectacle mis à jour",
          description: "Les modifications ont été sauvegardées"
        });
      }
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (spectacleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce spectacle ?')) return;

    try {
      const { error } = await supabase
        .from('spectacles')
        .delete()
        .eq('id', spectacleId);

      if (error) throw error;
      
      setSpectacles(prev => prev.filter(s => s.id !== spectacleId));
      if (selectedSpectacle?.id === spectacleId) {
        setSelectedSpectacle(null);
      }
      
      toast({
        title: "Spectacle supprimé",
        description: "Le spectacle a été supprimé avec succès"
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le spectacle",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `spectacles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('spectacle-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('spectacle-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, main_image_url: publicUrl }));

      toast({
        title: "Image uploadée",
        description: "L'image a été uploadée avec succès"
      });
    } catch (error: any) {
      toast({
        title: "Erreur d'upload",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const toggleStatus = async (spectacle: Spectacle) => {
    const newStatus = spectacle.status === 'published' ? 'draft' : 'published';
    
    try {
      const { error } = await supabase
        .from('spectacles')
        .update({ 
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null
        })
        .eq('id', spectacle.id);

      if (error) throw error;
      
      setSpectacles(prev => prev.map(s => 
        s.id === spectacle.id 
          ? { ...s, status: newStatus }
          : s
      ));
      
      if (selectedSpectacle?.id === spectacle.id) {
        setSelectedSpectacle(prev => prev ? { ...prev, status: newStatus } : null);
      }
      
      toast({
        title: `Spectacle ${newStatus === 'published' ? 'publié' : 'dépublié'}`,
        description: `Le spectacle est maintenant ${newStatus === 'published' ? 'visible' : 'masqué'} sur le site`
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut",
        variant: "destructive"
      });
    }
  };

  const startCreating = () => {
    setFormData({
      title: '',
      description: '',
      short_description: '',
      age_range: '',
      duration: 60,
      language: 'Français',
      status: 'draft',
      main_image_url: '',
      gallery_images: [],
      video_url: '',
      synopsis: '',
      price_individual: 0,
      price_group: 0,
      price_school: 0
    });
    setIsCreating(true);
    setIsEditing(true);
    setSelectedSpectacle(null);
  };

  const startEditing = (spectacle: Spectacle) => {
    setFormData(spectacle);
    setSelectedSpectacle(spectacle);
    setIsEditing(true);
    setIsCreating(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setIsCreating(false);
    if (selectedSpectacle) {
      setFormData(selectedSpectacle);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      published: 'default',
      draft: 'secondary',
      archived: 'outline'
    } as const;
    
    const labels = {
      published: 'Publié',
      draft: 'Brouillon',
      archived: 'Archivé'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  if (loading && spectacles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Spectacles</h1>
        <div className="flex gap-2">
          <Button
            onClick={fetchSpectacles}
            variant="outline"
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Actualiser'}
          </Button>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Spectacle
          </Button>
          <Button
            onClick={seedDatabase}
            disabled={loading}
            variant="outline"
            className="border-green-500 text-green-600 hover:bg-green-50"
          >
            <Database className="w-4 h-4 mr-2" />
            Créer table et exemples
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
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {spectacles.map((spectacle) => (
              <div
                key={spectacle.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedSpectacle?.id === spectacle.id ? 'bg-primary/10 border-primary' : ''
                }`}
                onClick={() => setSelectedSpectacle(spectacle)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{spectacle.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {spectacle.short_description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(spectacle.status)}
                      <span className="text-xs text-muted-foreground">
                        {spectacle.duration}min
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus(spectacle);
                      }}
                    >
                      {spectacle.status === 'published' ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(spectacle);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(spectacle.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Spectacle Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {isCreating ? 'Nouveau Spectacle' : isEditing ? 'Modifier le Spectacle' : 'Détails du Spectacle'}
                </CardTitle>
                <CardDescription>
                  {isCreating ? 'Créez un nouveau spectacle' : isEditing ? 'Modifiez les informations' : 'Informations du spectacle sélectionné'}
                </CardDescription>
              </div>
              {(selectedSpectacle || isCreating) && (
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={cancelEditing}>
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                      <Button onClick={handleSave} disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => startEditing(selectedSpectacle!)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 max-h-96 overflow-y-auto">
            {(selectedSpectacle || isCreating) ? (
              <>
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informations de base</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Titre *</Label>
                      <Input
                        id="title"
                        value={formData.title || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Titre du spectacle"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age_range">Tranche d'âge</Label>
                      <Input
                        id="age_range"
                        value={formData.age_range || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, age_range: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Ex: 6-12 ans"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Durée (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                        disabled={!isEditing}
                        placeholder="60"
                      />
                    </div>
                    <div>
                      <Label htmlFor="language">Langue</Label>
                      <Select
                        value={formData.language || ''}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une langue" />
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
                  
                  <div>
                    <Label htmlFor="short_description">Description courte</Label>
                    <Textarea
                      id="short_description"
                      value={formData.short_description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Description courte pour les listes"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description complète</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Description détaillée du spectacle"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Media Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Médias
                  </h3>
                  
                  <div>
                    <Label htmlFor="main_image">Image principale</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="main_image"
                        value={formData.main_image_url || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, main_image_url: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="URL de l'image principale"
                      />
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('main-image-upload')?.click()}
                          disabled={uploading}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      )}
                      <input
                        id="main-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                      />
                    </div>
                    {formData.main_image_url && (
                      <img
                        src={formData.main_image_url}
                        alt="Aperçu"
                        className="mt-2 w-32 h-20 object-cover rounded border"
                      />
                    )}
                  </div>

                  <div>
                    <Label htmlFor="video_url">URL Vidéo</Label>
                    <Input
                      id="video_url"
                      value={formData.video_url || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tarification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price_individual">Prix Particulier (MAD)</Label>
                      <Input
                        id="price_individual"
                        type="number"
                        step="0.01"
                        value={formData.price_individual || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_individual: parseFloat(e.target.value) || 0 }))}
                        disabled={!isEditing}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price_group">Prix Groupe (MAD)</Label>
                      <Input
                        id="price_group"
                        type="number"
                        step="0.01"
                        value={formData.price_group || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_group: parseFloat(e.target.value) || 0 }))}
                        disabled={!isEditing}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price_school">Prix École (MAD)</Label>
                      <Input
                        id="price_school"
                        type="number"
                        step="0.01"
                        value={formData.price_school || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_school: parseFloat(e.target.value) || 0 }))}
                        disabled={!isEditing}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Synopsis */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Synopsis</h3>
                  <Textarea
                    value={formData.synopsis || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, synopsis: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Synopsis du spectacle"
                    rows={4}
                  />
                </div>
              </>
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
    </div>
  );
}
