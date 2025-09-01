import { supabase } from '@/integrations/supabase/client';

export const sampleSpectacles = [
  {
    title: "Casse-Noisette",
    slug: "casse-noisette",
    description: "Un conte musical magique qui transporte les enfants dans l'univers féerique de Noël. Marie reçoit un casse-noisette en cadeau qui va l'emmener dans une aventure extraordinaire au pays des jouets et des sucreries.",
    short_description: "Conte musical de Noël pour toute la famille",
    age_range: "3-12 ans",
    duration: 45,
    language: "Français",
    status: "published" as const,
    main_image_url: "assets/edjs img/Casse-Noisette_Web_007.webp",
    gallery_images: [
      "assets/edjs img/Casse-Noisette_Web_013-1024x683.webp",
      "assets/edjs img/Casse-Noisette_Web_017-1024x683.webp"
    ],
    video_url: "",
    synopsis: "Marie reçoit un casse-noisette en cadeau de Noël. La nuit venue, elle assiste à une bataille épique entre les jouets et les souris. Son casse-noisette, transformé en prince, l'emmène dans un voyage magique au royaume des sucreries où elle rencontre la Fée Dragée.",
    price_individual: 80,
    price_group: 60,
    price_school: 50,
    meta_title: "Casse-Noisette - Spectacle Musical pour Enfants | EDJS",
    meta_description: "Découvrez le spectacle Casse-Noisette, un conte musical magique pour les enfants de 3 à 12 ans. Réservez vos places pour cette aventure féerique."
  },
  {
    title: "Alice chez les Merveilles",
    slug: "alice-chez-les-merveilles",
    description: "Suivez Alice dans sa chute dans le terrier du Lapin Blanc et découvrez un monde fantastique peuplé de personnages extraordinaires. Une adaptation théâtrale du célèbre conte de Lewis Carroll.",
    short_description: "L'aventure fantastique d'Alice au pays des merveilles",
    age_range: "4-14 ans",
    duration: 50,
    language: "Français",
    status: "published" as const,
    main_image_url: "assets/images/alice-main.jpg",
    gallery_images: [],
    video_url: "",
    synopsis: "Alice s'ennuie quand soudain elle voit passer un lapin blanc qui regarde sa montre en s'exclamant qu'il est en retard. Curieuse, elle le suit et tombe dans son terrier, découvrant un monde merveilleux où elle rencontre le Chat de Cheshire, le Chapelier Fou et la Reine de Cœur.",
    price_individual: 75,
    price_group: 55,
    price_school: 45,
    meta_title: "Alice chez les Merveilles - Spectacle Théâtral | EDJS",
    meta_description: "Plongez dans l'univers fantastique d'Alice chez les Merveilles. Spectacle théâtral pour enfants de 4 à 14 ans."
  },
  {
    title: "Charlotte",
    slug: "charlotte",
    description: "L'histoire touchante de Charlotte, une petite fille qui découvre la magie de l'amitié et de la solidarité. Un spectacle émouvant qui aborde des thèmes universels avec délicatesse.",
    short_description: "Une histoire touchante sur l'amitié et la solidarité",
    age_range: "5-12 ans",
    duration: 40,
    language: "Français",
    status: "published" as const,
    main_image_url: "assets/images/charlotte-main.jpg",
    gallery_images: [],
    video_url: "",
    synopsis: "Charlotte est une petite fille solitaire qui va apprendre l'importance de l'amitié grâce à des rencontres inattendues. Une histoire qui parle au cœur des enfants et leur enseigne les valeurs de partage et d'entraide.",
    price_individual: 70,
    price_group: 50,
    price_school: 40,
    meta_title: "Charlotte - Spectacle pour Enfants | EDJS",
    meta_description: "Découvrez Charlotte, un spectacle émouvant sur l'amitié et la solidarité pour les enfants de 5 à 12 ans."
  },
  {
    title: "Le Petit Prince",
    slug: "le-petit-prince",
    description: "L'adaptation théâtrale du chef-d'œuvre d'Antoine de Saint-Exupéry. Une histoire poétique et philosophique qui touche petits et grands, explorant les thèmes de l'amitié, de l'amour et de la condition humaine.",
    short_description: "L'adaptation du chef-d'œuvre de Saint-Exupéry",
    age_range: "6-16 ans",
    duration: 55,
    language: "Français",
    status: "published" as const,
    main_image_url: "assets/images/petit-prince-main.jpg",
    gallery_images: [],
    video_url: "",
    synopsis: "Un aviateur en panne dans le désert rencontre un petit prince venu d'une autre planète. À travers leurs conversations, le petit prince raconte ses voyages et ses rencontres, offrant une réflexion profonde sur la nature humaine.",
    price_individual: 85,
    price_group: 65,
    price_school: 55,
    meta_title: "Le Petit Prince - Spectacle Théâtral | EDJS",
    meta_description: "Redécouvrez Le Petit Prince de Saint-Exupéry dans une adaptation théâtrale poétique pour toute la famille."
  },
  {
    title: "Tara sur la Lune",
    slug: "tara-sur-la-lune",
    description: "Une aventure spatiale extraordinaire avec Tara, une petite fille curieuse qui rêve d'explorer l'espace. Un spectacle qui stimule l'imagination et la curiosité scientifique des enfants.",
    short_description: "Aventure spatiale pour jeunes explorateurs",
    age_range: "4-10 ans",
    duration: 45,
    language: "Français",
    status: "published" as const,
    main_image_url: "assets/images/tara-main.jpg",
    gallery_images: [],
    video_url: "",
    synopsis: "Tara est passionnée par l'espace et les étoiles. Un jour, elle embarque dans une fusée magique qui l'emmène sur la Lune où elle vit des aventures extraordinaires et découvre les mystères de l'univers.",
    price_individual: 75,
    price_group: 55,
    price_school: 45,
    meta_title: "Tara sur la Lune - Spectacle Spatial pour Enfants | EDJS",
    meta_description: "Embarquez avec Tara dans une aventure spatiale extraordinaire. Spectacle éducatif et divertissant pour les 4-10 ans."
  },
  {
    title: "Antigone",
    slug: "antigone",
    description: "Une adaptation moderne de la tragédie grecque de Sophocle. Un spectacle qui aborde les thèmes de la justice, du courage et de la résistance, adapté pour un jeune public.",
    short_description: "Adaptation moderne de la tragédie grecque",
    age_range: "12-18 ans",
    duration: 60,
    language: "Français",
    status: "published" as const,
    main_image_url: "assets/images/antigone-main.jpg",
    gallery_images: [],
    video_url: "",
    synopsis: "Antigone défie les lois de son oncle le roi Créon pour enterrer dignement son frère. Un conflit entre loi divine et loi humaine qui questionne la notion de justice et de devoir moral.",
    price_individual: 90,
    price_group: 70,
    price_school: 60,
    meta_title: "Antigone - Tragédie Grecque Adaptée | EDJS",
    meta_description: "Découvrez Antigone, une adaptation moderne de la tragédie de Sophocle pour les adolescents et jeunes adultes."
  }
];

export const seedSpectacles = async () => {
  try {
    console.log('Starting spectacles seeding...');
    
    // Check if spectacles already exist
    const { data: existingSpectacles, error: checkError } = await supabase
      .from('spectacles')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Error checking existing spectacles:', checkError);
      throw checkError;
    }
    
    if (existingSpectacles && existingSpectacles.length > 0) {
      console.log('Spectacles already exist in database');
      return { success: true, message: 'Spectacles already exist' };
    }
    
    // Insert sample spectacles
    const { data, error } = await supabase
      .from('spectacles')
      .insert(sampleSpectacles)
      .select();
    
    if (error) {
      console.error('Error seeding spectacles:', error);
      throw error;
    }
    
    console.log(`Successfully seeded ${data?.length || 0} spectacles`);
    
    // Also seed some sample sessions for each spectacle
    if (data && data.length > 0) {
      const sessions = [];
      const today = new Date();
      
      for (const spectacle of data) {
        // Add 3 sessions for each spectacle over the next month
        for (let i = 0; i < 3; i++) {
          const sessionDate = new Date(today);
          sessionDate.setDate(today.getDate() + (i * 7) + Math.floor(Math.random() * 7));
          
          sessions.push({
            spectacle_id: spectacle.id,
            session_date: sessionDate.toISOString().split('T')[0],
            session_time: i === 0 ? '14:30:00' : i === 1 ? '16:00:00' : '10:30:00',
            venue: 'Théâtre EDJS',
            venue_address: 'Casablanca, Maroc',
            capacity: 150,
            available_seats: 150,
            status: 'active'
          });
        }
      }
      
      const { error: sessionsError } = await supabase
        .from('sessions')
        .insert(sessions);
      
      if (sessionsError) {
        console.error('Error seeding sessions:', sessionsError);
      } else {
        console.log(`Successfully seeded ${sessions.length} sessions`);
      }
    }
    
    return { 
      success: true, 
      message: `Successfully seeded ${data?.length || 0} spectacles and their sessions` 
    };
    
  } catch (error: any) {
    console.error('Seeding failed:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to seed spectacles' 
    };
  }
};

export const clearSpectacles = async () => {
  try {
    // Delete all sessions first (due to foreign key constraint)
    await supabase.from('sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Delete all spectacles
    const { error } = await supabase
      .from('spectacles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (error) throw error;
    
    return { success: true, message: 'All spectacles cleared successfully' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to clear spectacles' };
  }
};
