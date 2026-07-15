/**
 * Démos des apps partenaires — de vraies captures d'écran affichées dans un
 * cadre téléphone. `src` pointe vers /public/app-screens/*. next/image optimise.
 * `hint` = légende animée superposée pour guider (facultative).
 */
export type DemoStep = { src: string; label: string; sub: string; hint?: string };

export const RESTAURANT_DEMO: DemoStep[] = [
  { src: "/app-screens/restaurant/01.PNG", label: "Créer un compte", sub: "Étape 1 — vos identifiants", hint: "Vos identifiants, ou Google / Apple" },
  { src: "/app-screens/restaurant/02.PNG", label: "Créer un compte", sub: "Étape 2 — votre restaurant", hint: "Localisez et catégorisez votre restaurant" },
  { src: "/app-screens/restaurant/03.PNG", label: "Compte en attente", sub: "Validation par AfroBite", hint: "AfroBite valide votre compte" },
  { src: "/app-screens/restaurant/04.PNG", label: "Mes plats", sub: "Votre menu", hint: "Votre menu, tout au même endroit" },
  { src: "/app-screens/restaurant/05.PNG", label: "Ajouter un plat", sub: "Bouton +", hint: "Tapez + pour ajouter un plat" },
  { src: "/app-screens/restaurant/06.PNG", label: "Détails du plat", sub: "Nom, prix, photo, catégorie", hint: "Nom, prix, photo — et c'est prêt" },
  { src: "/app-screens/restaurant/07.PNG", label: "Plat enregistré", sub: "Disponible aux commandes", hint: "Votre plat est en ligne" },
  { src: "/app-screens/restaurant/08.PNG", label: "Onglet Ajouter", sub: "Publier une vidéo", hint: "Onglet Ajouter → publier une vidéo" },
  { src: "/app-screens/restaurant/09.PNG", label: "Enregistrer la vidéo", sub: "Filmer ou galerie", hint: "Filmez le plat ou choisissez une vidéo" },
  { src: "/app-screens/restaurant/10.PNG", label: "Publier", sub: "Description, plat lié", hint: "Liez le plat et publiez" },
  { src: "/app-screens/restaurant/11.PNG", label: "Vidéo en ligne", sub: "Visible dans le feed client", hint: "Vos clients la voient dans le feed" },
];

export const DELIVERY_DEMO: DemoStep[] = [
  { src: "/app-screens/livreur/01.PNG", label: "Créer un compte livreur", sub: "Directement dans l'app", hint: "Créez votre compte en 1 minute" },
  { src: "/app-screens/livreur/02.PNG", label: "Validation en cours", sub: "Approbation par l'équipe", hint: "L'équipe valide votre dossier" },
  { src: "/app-screens/livreur/03.PNG", label: "Passer en ligne", sub: "Recevez des offres", hint: "Passez en ligne pour recevoir des offres" },
  { src: "/app-screens/livreur/04.PNG", label: "Nouvelle offre", sub: "Course sur la carte", hint: "Une nouvelle course apparaît" },
  { src: "/app-screens/livreur/05.PNG", label: "Accepter la course", sub: "Restaurant et client", hint: "Restaurant + client en un coup d'œil" },
  { src: "/app-screens/livreur/06.PNG", label: "Vers le restaurant", sub: "Navigation", hint: "Navigation jusqu'au restaurant" },
  { src: "/app-screens/livreur/07.PNG", label: "Commande récupérée", sub: "Confirmer au restaurant", hint: "Confirmez la récupération" },
  { src: "/app-screens/livreur/08.PNG", label: "Vers le client", sub: "Suivi GPS", hint: "Suivi GPS jusqu'au client" },
  { src: "/app-screens/livreur/09.PNG", label: "Livraison confirmée", sub: "Confirmation client", hint: "Livraison confirmée !" },
  { src: "/app-screens/livreur/10.PNG", label: "Gains", sub: "Historique des revenus", hint: "Suivez vos gains" },
];
