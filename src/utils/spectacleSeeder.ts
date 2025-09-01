import { supabase } from '@/integrations/supabase/client';

// Complete spectacle data extracted from individual HTML pages
export const realSpectaclesData = [
  {
    title: "Charlotte",
    description: "L'histoire touchante de Charlotte, une petite fille qui découvre la force de l'amitié et du courage. Un spectacle émouvant sur la résilience et l'espoir qui explore les thèmes de l'amitié et de la détermination.",
    duration: 50,
    price_individual: 80,
    main_image_url: "/Users/Imad/Downloads/edjs-site1/assets/edjs img/Casse-Noisette_Web_007.webp",
    gallery_images: [
      "/Users/Imad/Downloads/edjs-site1/assets/edjs img/Casse-Noisette_Web_007.webp",
      "/Users/Imad/Downloads/edjs-site1/assets/edjs img/Casse-Noisette_Web_013-1024x683.webp",
      "/Users/Imad/Downloads/edjs-site1/assets/edjs img/Casse-Noisette_Web_017-1024x683.webp",
      "/Users/Imad/Downloads/edjs-site1/assets/edjs img/Casse-Noisette_Web_035.webp"
    ],
    age_range_min: 7,
    age_range_max: 16,
    venue: "École du Jeune Spectateur",
    dates: "12 au 20 Décembre 2025",
    category: "Familial",
    language: "Français",
    video_url: "assets/video/charlotte-trailer.mp4",
    synopsis: "Charlotte est une petite fille courageuse qui doit faire face à des défis difficiles. Grâce à l'amitié et à sa détermination, elle découvre qu'elle possède une force insoupçonnée. Ce spectacle émouvant explore les thèmes de la résilience, de l'amitié et de l'espoir. Une histoire touchante qui montre aux enfants qu'ils peuvent surmonter les obstacles avec courage et bienveillance.",
    contact_phone: "+212 5 22 98 10 85",
    contact_email: "info@edjs.ma",
    location: "Casablanca, Maroc"
  },
  {
    title: "تارا إلى القمر",
    slug: "tara-sur-la-lune",
    description: "Une aventure spatiale musicale bilingue qui emmène les enfants dans un voyage extraordinaire à travers l'espace et l'imagination. Âge: 5+ ans, Durée: 70min, Lieu: Théâtre Mohammed V",
    short_description: "Aventure spatiale musicale bilingue (5+ ans)",
    duration: 70,
    language: "Bilingue",
    status: "published" as const,
    price_individual: 90,
    price_group: 80,
    price_school: 70,
    main_image_url: "assets/img/spectacles/tara sur la lune.png",
    video_url: "",
    synopsis: "Une aventure spatiale musicale bilingue qui emmène les enfants dans un voyage extraordinaire à travers l'espace et l'imagination. Tara découvre les merveilles de l'univers dans cette production captivante. Catégorie: Musical, Lieu: Théâtre Mohammed V, Dates: Nov - Déc 2025"
  },
  {
    title: "L'Eau-Là",
    slug: "leau-la",
    description: "Un spectacle poétique et rafraîchissant porté par la voix de Zaz, explorant la beauté et l'importance de l'eau dans nos vies et notre environnement. Âge: 8-16 ans, Durée: 75min, Lieu: Théâtre Mohammed V",
    short_description: "Spectacle poétique sur l'eau (8-16 ans)",
    duration: 75,
    language: "Français",
    status: "published" as const,
    price_individual: 85,
    price_group: 75,
    price_school: 65,
    main_image_url: "assets/img/spectacles/l'eau la.png",
    video_url: "",
    synopsis: "Un spectacle poétique et rafraîchissant porté par la voix de Zaz, explorant la beauté et l'importance de l'eau dans nos vies et notre environnement. Une sensibilisation écologique à travers l'art. Catégorie: Poétique, Lieu: Centre Culturel Sidi Belyout, Dates: Jan - Fév 2026"
  },
  {
    title: "L'Enfant de l'Arbre",
    slug: "lenfant-de-larbre",
    description: "Un conte poétique sur la relation entre l'homme et la nature, racontant l'histoire d'un enfant qui grandit avec un arbre centenaire. Âge: 5-12 ans, Durée: 60min, Lieu: Théâtre Mohammed V",
    short_description: "Conte écologique poétique (5-12 ans)",
    duration: 60,
    language: "Français",
    status: "published" as const,
    price_individual: 75,
    price_group: 65,
    price_school: 55,
    main_image_url: "assets/img/spectacles/enfant de l'arbre.png",
    video_url: "",
    synopsis: "Un conte poétique sur la relation entre l'homme et la nature, racontant l'histoire d'un enfant qui grandit avec un arbre centenaire. Une fable écologique touchante. Catégorie: Conte Écologique, Lieu: Théâtre National, Dates: Mar - Avr 2026"
  },
  {
    title: "Alice chez les Merveilles",
    slug: "alice-chez-les-merveilles",
    description: "Une adaptation moderne et créative du classique de Lewis Carroll, plongeant Alice et le public dans un monde fantastique rempli de surprises. Âge: 6-14 ans, Durée: 80min, Lieu: Théâtre Mohammed V",
    short_description: "Adaptation moderne du classique de Carroll (6-14 ans)",
    duration: 80,
    language: "Français",
    status: "published" as const,
    price_individual: 95,
    price_group: 85,
    price_school: 75,
    main_image_url: "assets/img/spectacles/alice chez le .png",
    video_url: "",
    synopsis: "Une adaptation moderne et créative du classique de Lewis Carroll, plongeant Alice et le public dans un monde fantastique rempli de surprises, de personnages colorés et d'aventures extraordinaires. Catégorie: Conte Fantastique, Lieu: Opéra de Casablanca, Dates: Déc 2025"
  },
  {
    title: "الأمير الصغير",
    slug: "le-petit-prince",
    description: "L'adaptation en arabe du chef-d'œuvre de Saint-Exupéry, une histoire poétique universelle sur l'amitié, l'amour et les valeurs humaines essentielles. Âge: 6-12 ans, Durée: 75min, Lieu: Théâtre Mohammed V",
    short_description: "Le Petit Prince en arabe (6-12 ans)",
    duration: 75,
    language: "Arabe",
    status: "published" as const,
    price_individual: 85,
    price_group: 75,
    price_school: 65,
    main_image_url: "assets/img/spectacles/petite prince.png",
    video_url: "",
    synopsis: "L'adaptation en arabe du chef-d'œuvre de Saint-Exupéry, une histoire poétique universelle sur l'amitié, l'amour et les valeurs humaines essentielles. Une production bilingue touchante. Catégorie: Conte Musical Arabe, Lieu: Théâtre Mohammed V, Dates: Fév - Mar 2026"
  },
  {
    title: "Simple Comme Bonjour",
    slug: "simple-comme-bonjour",
    description: "Un spectacle joyeux et interactif de Jacques Serres, célébrant la simplicité des petits bonheurs quotidiens avec musique, chants et sourires. Âge: 3-10 ans, Durée: 45min, Lieu: Théâtre Mohammed V",
    short_description: "Spectacle musical joyeux et interactif (3-10 ans)",
    duration: 45,
    language: "Français",
    status: "published" as const,
    price_individual: 70,
    price_group: 60,
    price_school: 50,
    main_image_url: "assets/img/spectacles/simple.png",
    video_url: "",
    synopsis: "Un spectacle joyeux et interactif de Jacques Serres, célébrant la simplicité des petits bonheurs quotidiens avec musique, chants et sourires. Une ode à la joie de vivre. Catégorie: Musical, Lieu: Centre Culturel Sidi Belyout, Dates: Avr - Mai 2026"
  },
  {
    title: "Estuaires",
    slug: "estevanico",
    description: "Une pièce contemporaine explorant les rencontres entre différentes cultures, comme les eaux qui se mélangent dans un estuaire. Âge: 12-18 ans, Durée: 90min, Lieu: Théâtre Mohammed V",
    short_description: "Théâtre contemporain sur les cultures (12-18 ans)",
    duration: 90,
    language: "Français",
    status: "draft" as const,
    price_individual: 100,
    price_group: 90,
    price_school: 80,
    main_image_url: "assets/img/spectacles/estavine.png",
    video_url: "",
    synopsis: "Une pièce contemporaine explorant les rencontres entre différentes cultures, comme les eaux qui se mélangent dans un estuaire. Une réflexion sur l'identité et l'appartenance. Catégorie: Théâtre Contemporain, Lieu: Institut Français, Dates: Mai - Juin 2026"
  },
  {
    title: "Antigone",
    slug: "antigone",
    description: "La tragédie intemporelle de Sophocle adaptée pour les jeunes spectateurs. Une œuvre puissante sur la résistance, le courage et les valeurs morales face à la tyrannie. Âge: 14-18 ans, Durée: 105min, Lieu: Théâtre Mohammed V",
    short_description: "Tragédie classique adaptée (14-18 ans)",
    duration: 105,
    language: "Français",
    status: "published" as const,
    price_individual: 110,
    price_group: 100,
    price_school: 90,
    main_image_url: "assets/img/spectacles/antigone.png",
    video_url: "",
    synopsis: "La tragédie intemporelle de Sophocle adaptée pour les jeunes spectateurs. Une œuvre puissante sur la résistance, le courage et les valeurs morales face à la tyrannie. Catégorie: Tragédie Classique, Lieu: Théâtre National, Dates: Mars - Avril 2025"
  },
  {
    title: "Casse-Noisette",
    slug: "casse-noisette",
    description: "Le célèbre ballet de Tchaïkovski adapté pour les jeunes spectateurs, une féerie musicale et visuelle qui transporte les enfants dans un monde magique de Noël. Âge: 4-12 ans, Durée: 90min, Lieu: Théâtre Mohammed V",
    short_description: "Ballet de Tchaïkovski adapté (4-12 ans)",
    duration: 90,
    language: "Français",
    status: "published" as const,
    price_individual: 120,
    price_group: 110,
    price_school: 100,
    main_image_url: "assets/img/spectacles/casse-noisette.png",
    video_url: "",
    synopsis: "Le célèbre ballet de Tchaïkovski adapté pour les jeunes spectateurs, une féerie musicale et visuelle qui transporte les enfants dans un monde magique de Noël. Catégorie: Ballet Musical, Lieu: Opéra de Casablanca, Dates: Décembre 2025 - Jan 2026"
  }
];

export async function seedRealSpectacles() {
  try {
    console.log('Starting to seed real spectacles data...');
    console.log('Supabase client initialized:', !!supabase);
    
    // Test database connection first
    const { data: testData, error: testError } = await supabase
      .from('spectacles')
      .select('count', { count: 'exact' });
    
    if (testError) {
      console.error('Database connection test failed:', testError);
      throw new Error(`Database connection failed: ${testError.message}`);
    }
    
    console.log('Database connection successful. Current spectacles count:', testData);
    
    // First, clear existing spectacles
    const { error: deleteError } = await supabase
      .from('spectacles')
      .delete()
      .gte('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (deleteError) {
      console.error('Error clearing existing spectacles:', deleteError);
      throw new Error(`Failed to clear existing data: ${deleteError.message}`);
    }
    
    console.log('Existing spectacles cleared successfully');

    // Insert spectacles one by one to handle schema issues
    const insertedSpectacles = [];
    
    for (let i = 0; i < realSpectaclesData.length; i++) {
      const spectacle = realSpectaclesData[i];
      console.log(`Inserting spectacle ${i + 1}/${realSpectaclesData.length}: ${spectacle.title}`);
      
      try {
        const { data, error } = await supabase
          .from('spectacles')
          .insert([{
            title: spectacle.title,
            description: spectacle.description,
            duration_minutes: spectacle.duration || 60,
            price: spectacle.price_individual || 50,
            age_range_min: spectacle.age_range_min || 4,
            age_range_max: spectacle.age_range_max || 16,
            poster_url: spectacle.main_image_url || '',
            is_active: true
          }])
          .select()
          .single();

        if (error) {
          console.error(`Error inserting spectacle ${spectacle.title}:`, error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          continue;
        }
        
        console.log(`Successfully inserted: ${spectacle.title}`, data);
        insertedSpectacles.push(data);
      } catch (err) {
        console.error(`Failed to insert spectacle ${spectacle.title}:`, err);
        continue;
      }
    }

    console.log(`Successfully seeded ${insertedSpectacles.length} real spectacles out of ${realSpectaclesData.length} total`);
    
    // Verify the data was inserted
    const { data: verifyData, error: verifyError } = await supabase
      .from('spectacles')
      .select('id, title')
      .order('created_at', { ascending: false });
    
    if (verifyError) {
      console.error('Error verifying inserted data:', verifyError);
    } else {
      console.log('Verification - spectacles in database:', verifyData);
    }
    
    return insertedSpectacles;
  } catch (error) {
    console.error('Failed to seed spectacles:', error);
    throw error;
  }
}
