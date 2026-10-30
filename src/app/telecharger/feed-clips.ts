/**
 * Vidéos du téléphone de /telecharger : de vraies vidéos de restaurants AfroBite
 * (Firestore `videos` + plat + restaurant, relevés le 30/10/2026), découpées et
 * compressées (MP4 H.264 540 px, sans son, faststart) dans public/videos/feed/.
 *
 * Les textes suivent l'écran Découvertes de l'app (lib/user/widgets/video_player_item.dart) :
 * - description = celle du plat, sinon la légende de la vidéo ;
 * - délai = « préparation – préparation + 10 min » (pas de zone de livraison) ;
 * - note affichée seulement si le restaurant en a une ;
 * - prix client = prix resto + 5 %, arrondi aux 100 F supérieurs (PricingService).
 */
export type FeedClip = {
  restaurant: string;
  logo: string;
  rating: number | null;
  description: string;
  eta: string;
  likes: number;
  comments: number;
  shares: number;
  dish: string;
  price: string;
  dishImage: string;
  video: string;
  poster: string;
  /** Durée du clip (le feed avance à la fin de la vidéo ; sert de filet si elle ne démarre pas). */
  durationMs: number;
};

const DIR = "/videos/feed";

export const FEED_CLIPS: FeedClip[] = [
  {
    restaurant: "Baguette du Faso",
    logo: `${DIR}/baguette-du-faso-logo.jpg`,
    rating: null,
    description:
      "Un généreux assortiment de grillades et de délices croustillants, composé de deux brochettes de poulet marinées et grillées, deux brochettes de bœuf savoureuses, du poulet crispy doré et croustillant, des boulettes de viande délicatement assaisonnées et des frites bien dorées.",
    eta: "30-40 min",
    likes: 1,
    comments: 0,
    shares: 0,
    dish: "Plateau Mix grille",
    price: "18400 F",
    dishImage: `${DIR}/baguette-du-faso-mix-grille-plat.jpg`,
    video: `${DIR}/baguette-du-faso-mix-grille.mp4`,
    poster: `${DIR}/baguette-du-faso-mix-grille.jpg`,
    durationMs: 6000,
  },
  {
    restaurant: "Miss Thé",
    logo: `${DIR}/miss-the-logo.jpg`,
    rating: 3.8,
    description: "Bubble Tea bien glacé",
    eta: "20-30 min",
    likes: 11,
    comments: 0,
    shares: 0,
    dish: "Bubble Tea",
    price: "1600 F",
    dishImage: `${DIR}/miss-the-bubble-tea-plat.jpg`,
    video: `${DIR}/miss-the-bubble-tea.mp4`,
    poster: `${DIR}/miss-the-bubble-tea.jpg`,
    durationMs: 5000,
  },
  {
    restaurant: "Deen's Grill",
    logo: `${DIR}/deens-grill-logo.jpg`,
    rating: 4.7,
    description: "Pizza généreusement garnie de saucisson, jambon, fromage, sauce tomate et olives noires.",
    eta: "30-40 min",
    likes: 11,
    comments: 0,
    shares: 0,
    dish: "Pizza roi",
    price: "5300 F",
    dishImage: `${DIR}/deens-grill-pizza-roi-plat.jpg`,
    video: `${DIR}/deens-grill-pizza-roi.mp4`,
    poster: `${DIR}/deens-grill-pizza-roi.jpg`,
    durationMs: 6000,
  },
];
