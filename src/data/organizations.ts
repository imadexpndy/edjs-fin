export interface Organization {
  id: string;
  name: string;
  type: 'private_school' | 'public_school' | 'association';
  city: 'casablanca' | 'rabat';
  category: string;
}

export const organizations: Organization[] = [
  // Écoles Privées - Casablanca
  { id: 'leon-africain-anfa', name: 'LEON L\'AFRICAIN - ANFA', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'leon-africain-velodrome', name: 'LEON L\'AFRICAIN - VELODROME (Rue Oum Kelthoum)', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'al-jabr-junior-bouskoura', name: 'AL JABR JUNIOR BOUSKOURA', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'al-jabr-international', name: 'AL JABR INTERNATIONAL', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'al-jabr-massalik', name: 'AL JABR MASSALIK', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'ecole-bilal', name: 'Ecole BILAL', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'ecole-moliere', name: 'Ecole Molière', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'gs-residence', name: 'Groupe Scolaire la Résidence', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'ecole-laymoune', name: 'Ecole LAYMOUNE', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'ecole-al-bassma', name: 'Ecole AL BASSMA', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'ecole-mansour', name: 'Ecole MANSOUR', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'ecole-iris', name: 'Ecole IRIS', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'ecole-sanawate', name: 'Ecole SANAWATE', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'ecole-mansour-ii', name: 'Ecole MANSOUR II', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'ecole-el-yakada', name: 'Ecole EL YAKADA', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'ecole-la-cigogne', name: 'Ecole LA CIGOGNE', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'ecole-el-amal', name: 'Ecole EL AMAL', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'ecole-la-martinique', name: 'Ecole LA MARTINIQUE', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'ecole-la-palmeraie', name: 'Ecole LA PALMERAIE', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'gs-les-oliviers', name: 'Groupe scolaire LES OLIVIERS', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'gs-victoria', name: 'Groupe scolaire VICTORIA', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'gs-bernoux', name: 'Groupe scolaire BERNOUX', type: 'private_school', city: 'casablanca', category: 'École Privée' },
  { id: 'gs-eddy', name: 'Groupe scolaire EDDY', type: 'private_school', city: 'casablanca', category: 'École Privée' },

  // Écoles Privées - Rabat
  { id: 'albert-camus', name: 'ALBERT CAMUS', type: 'private_school', city: 'rabat', category: 'École Privée' },
  { id: 'lycee-descartes', name: 'LYCEE DESCARTES', type: 'private_school', city: 'rabat', category: 'École Privée' },
  { id: 'paul-cezanne', name: 'PAUL CEZANNE', type: 'private_school', city: 'rabat', category: 'École Privée' },
  { id: 'andre-malraux', name: 'ANDRE MALRAUX', type: 'private_school', city: 'rabat', category: 'École Privée' },
  { id: 'leon-africain-rabat', name: 'LEON L\'AFRICAIN', type: 'private_school', city: 'rabat', category: 'École Privée' },
  { id: 'gs-rivera', name: 'Groupe scolaire RIVERA', type: 'private_school', city: 'rabat', category: 'École Privée' },
  { id: 'gs-jana', name: 'Groupe scolaire JANA', type: 'private_school', city: 'rabat', category: 'École Privée' },

  // Écoles Publiques - Casablanca
  { id: 'ibnou-abbad', name: 'IBNOU ABBAD', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'omar-ibnou-khattab', name: 'OMAR IBNOU KHATTAB', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'ibn-el-mouaqit', name: 'IBN EL MOUAQIT', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'al-fath', name: 'AL FATH', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'oum-el-qods', name: 'OUM EL QODS', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'al-massira', name: 'AL MASSIRA', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'anoual', name: 'ANOUAL', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'my-ismail', name: 'MY ISMAIL', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'ibnou-al-baytar', name: 'IBNOU AL BAYTAR', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'zerktouni', name: 'ZERKTOUNI', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'sidi-belyout', name: 'SIDI BELYOUT', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'al-jouahiri', name: 'AL JOUAHIRI', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'anas-ibnou-malik', name: 'ANAS IBNOU MALIK', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'ibnou-al-haytem', name: 'IBNOU AL HAYTEM', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'allal-fassi', name: 'ALLAL FASSI', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'ibnou-khaldoun', name: 'IBNOU KHALDOUN', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'ouled-ziane', name: 'OULED ZIANE', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'my-driss', name: 'MY DRISS', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'ouafik', name: 'OUAFIK', type: 'public_school', city: 'casablanca', category: 'École Publique' },
  { id: 'abou-chouaib-doukkali', name: 'ABOU CHOUAIB DOUKKALI', type: 'public_school', city: 'casablanca', category: 'École Publique' },

  // Associations - Casablanca
  { id: 'fondation-zakoura', name: 'Fondation Zakoura', type: 'association', city: 'casablanca', category: 'Association' },
  { id: 'heure-joyeuse', name: 'Heure Joyeuse', type: 'association', city: 'casablanca', category: 'Association' },
  { id: 'mama-tabiaa', name: 'Mama Tabiaa', type: 'association', city: 'casablanca', category: 'Association' },
  { id: 'fondation-marocaine-prescolaire', name: 'Fondation Marocaine du Préscolaire', type: 'association', city: 'casablanca', category: 'Association' },
  { id: 'tibu-afrika', name: 'Tibu Afrika', type: 'association', city: 'casablanca', category: 'Association' },
  { id: 'association-al-karam', name: 'Association Al Karam', type: 'association', city: 'casablanca', category: 'Association' },
  { id: 'association-ecoles-pour-tous', name: 'Association Les Écoles pour Tous', type: 'association', city: 'casablanca', category: 'Association' },
  { id: 'association-anouar', name: 'Association Anouar', type: 'association', city: 'casablanca', category: 'Association' },

  // Associations - Rabat
  { id: 'centre-lalla-meriem', name: 'Centre Lalla Meriem', type: 'association', city: 'rabat', category: 'Association' },
];

export const getOrganizationsByCity = (city: 'casablanca' | 'rabat') => {
  return organizations.filter(org => org.city === city);
};

export const getOrganizationsByTypeAndCity = (type: Organization['type'], city: 'casablanca' | 'rabat') => {
  return organizations.filter(org => org.type === type && org.city === city);
};

export const getOrganizationById = (id: string) => {
  return organizations.find(org => org.id === id);
};
