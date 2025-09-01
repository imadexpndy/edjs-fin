import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, Edit, Trash2, Search, Building2, GraduationCap, Users, MapPin, Filter
} from 'lucide-react';
import { organizations, Organization, getOrganizationsByCity, getOrganizationsByTypeAndCity } from '@/data/organizations';

export default function OrganizationsManager() {
  const [organizationsList, setOrganizationsList] = useState<Organization[]>(organizations);
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>(organizations);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Organization>>({
    name: '',
    type: 'private_school',
    city: 'casablanca',
    category: ''
  });

  useEffect(() => {
    applyFilters();
  }, [searchTerm, cityFilter, typeFilter, organizationsList]);

  const applyFilters = () => {
    let filtered = [...organizationsList];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(org => 
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // City filter
    if (cityFilter !== 'all') {
      filtered = filtered.filter(org => org.city === cityFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(org => org.type === typeFilter);
    }

    setFilteredOrganizations(filtered);
  };

  const getTypeIcon = (type: Organization['type']) => {
    switch (type) {
      case 'private_school':
      case 'public_school':
        return <GraduationCap className="h-4 w-4" />;
      case 'association':
        return <Users className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: Organization['type']) => {
    const variants = {
      private_school: 'default',
      public_school: 'secondary',
      association: 'outline'
    } as const;
    
    const labels = {
      private_school: 'École Privée',
      public_school: 'École Publique',
      association: 'Association'
    };

    return (
      <Badge variant={variants[type]}>
        {getTypeIcon(type)}
        <span className="ml-1">{labels[type]}</span>
      </Badge>
    );
  };

  const getCityBadge = (city: Organization['city']) => {
    const cityLabels = {
      casablanca: 'Casablanca',
      rabat: 'Rabat'
    };

    return (
      <Badge variant="outline">
        <MapPin className="h-3 w-3 mr-1" />
        {cityLabels[city]}
      </Badge>
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (isCreating) {
        const newOrg: Organization = {
          id: `custom-${Date.now()}`,
          name: formData.name || '',
          type: formData.type || 'private_school',
          city: formData.city || 'casablanca',
          category: formData.category || ''
        };
        
        setOrganizationsList(prev => [...prev, newOrg]);
        setSelectedOrganization(newOrg);
        setIsCreating(false);
        
        toast({
          title: "Organisation créée",
          description: "La nouvelle organisation a été ajoutée avec succès"
        });
      } else if (selectedOrganization) {
        const updatedOrg: Organization = {
          ...selectedOrganization,
          ...formData
        };
        
        setOrganizationsList(prev => prev.map(org => 
          org.id === selectedOrganization.id ? updatedOrg : org
        ));
        setSelectedOrganization(updatedOrg);
        
        toast({
          title: "Organisation mise à jour",
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

  const handleDelete = async (organizationId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette organisation ?')) return;

    try {
      setOrganizationsList(prev => prev.filter(org => org.id !== organizationId));
      if (selectedOrganization?.id === organizationId) {
        setSelectedOrganization(null);
      }
      
      toast({
        title: "Organisation supprimée",
        description: "L'organisation a été supprimée avec succès"
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'organisation",
        variant: "destructive"
      });
    }
  };

  const startCreating = () => {
    setFormData({
      name: '',
      type: 'private_school',
      city: 'casablanca',
      category: ''
    });
    setIsCreating(true);
    setIsEditing(true);
    setSelectedOrganization(null);
  };

  const startEditing = (organization: Organization) => {
    setFormData(organization);
    setSelectedOrganization(organization);
    setIsEditing(true);
    setIsCreating(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setIsCreating(false);
    if (selectedOrganization) {
      setFormData(selectedOrganization);
    }
  };

  const getStatistics = () => {
    const stats = {
      total: organizationsList.length,
      casablanca: organizationsList.filter(org => org.city === 'casablanca').length,
      rabat: organizationsList.filter(org => org.city === 'rabat').length,
      privateSchools: organizationsList.filter(org => org.type === 'private_school').length,
      publicSchools: organizationsList.filter(org => org.type === 'public_school').length,
      associations: organizationsList.filter(org => org.type === 'association').length
    };
    return stats;
  };

  const stats = getStatistics();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Organisations</h1>
          <p className="text-muted-foreground">Gérez les écoles et associations partenaires</p>
        </div>
        <Button onClick={startCreating} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Organisation
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.casablanca}</p>
                <p className="text-xs text-muted-foreground">Casablanca</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.rabat}</p>
                <p className="text-xs text-muted-foreground">Rabat</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.privateSchools}</p>
                <p className="text-xs text-muted-foreground">Écoles Privées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.publicSchools}</p>
                <p className="text-xs text-muted-foreground">Écoles Publiques</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.associations}</p>
                <p className="text-xs text-muted-foreground">Associations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Organizations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Organisations ({filteredOrganizations.length})</CardTitle>
            <CardDescription>
              Liste des écoles et associations
            </CardDescription>
            
            {/* Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les villes</SelectItem>
                    <SelectItem value="casablanca">Casablanca</SelectItem>
                    <SelectItem value="rabat">Rabat</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="private_school">Écoles Privées</SelectItem>
                    <SelectItem value="public_school">Écoles Publiques</SelectItem>
                    <SelectItem value="association">Associations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {filteredOrganizations.map((organization) => (
              <div
                key={organization.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedOrganization?.id === organization.id ? 'bg-primary/10 border-primary' : ''
                }`}
                onClick={() => setSelectedOrganization(organization)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{organization.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      {getTypeBadge(organization.type)}
                      {getCityBadge(organization.city)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(organization);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(organization.id);
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

        {/* Organization Details/Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {isCreating ? 'Nouvelle Organisation' : isEditing ? 'Modifier l\'Organisation' : 'Détails de l\'Organisation'}
                </CardTitle>
                <CardDescription>
                  {isCreating ? 'Créez une nouvelle organisation' : isEditing ? 'Modifiez les informations' : 'Informations de l\'organisation sélectionnée'}
                </CardDescription>
              </div>
              {(selectedOrganization || isCreating) && (
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={cancelEditing}>
                        Annuler
                      </Button>
                      <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => startEditing(selectedOrganization!)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {(selectedOrganization || isCreating) ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom de l'organisation *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Nom de l'organisation"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Input
                      id="category"
                      value={formData.category || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Catégorie"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Type d'organisation</Label>
                    <Select
                      value={formData.type || ''}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Organization['type'] }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private_school">École Privée</SelectItem>
                        <SelectItem value="public_school">École Publique</SelectItem>
                        <SelectItem value="association">Association</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Select
                      value={formData.city || ''}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, city: value as Organization['city'] }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une ville" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casablanca">Casablanca</SelectItem>
                        <SelectItem value="rabat">Rabat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {!isEditing && selectedOrganization && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-2">Informations supplémentaires</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">ID:</span>
                        <span className="ml-2 font-mono">{selectedOrganization.id}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-2">{getTypeBadge(selectedOrganization.type)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ville:</span>
                        <span className="ml-2">{getCityBadge(selectedOrganization.city)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Catégorie:</span>
                        <span className="ml-2">{selectedOrganization.category}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="text-muted-foreground mb-4">
                  Sélectionnez une organisation pour voir les détails ou créez-en une nouvelle
                </div>
                <Button onClick={startCreating}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une organisation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
