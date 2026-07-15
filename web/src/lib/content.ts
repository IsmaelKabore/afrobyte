/**
 * Contenu éditorial réutilisable (plats du feed Découverte, etc.).
 * Centralisé pour éviter la duplication entre sections.
 */

export type Dish = {
  name: string;
  vendor: string;
  rating: string;
  time: string;
  price: string;
  video: string;
  poster: string;
  bg: string;
};

export const DISHES: Dish[] = [
  {
    name: "Riz Gras",
    vendor: "Chez Tantie Aminata",
    rating: "4.9",
    time: "22 min",
    price: "2 500 F",
    video: "/videos/riz-gras.mp4",
    poster: "/videos/riz-gras.jpg",
    bg: "radial-gradient(ellipse at 50% 60%, #d4601a 0%, #8a2e10 45%, #2a0e04 100%)",
  },
  {
    name: "Brochettes de Bœuf",
    vendor: "Chez Tantie Aminata",
    rating: "4.9",
    time: "22 min",
    price: "2 500 F",
    video: "/videos/brochettes-boeuf.mp4",
    poster: "/videos/brochettes-boeuf.jpg",
    bg: "radial-gradient(ellipse at 50% 70%, #8a4a1a 0%, #45230c 50%, #0a0504 100%)",
  },
  {
    name: "Galettes de Mil",
    vendor: "Chez Tantie Salimata",
    rating: "4.7",
    time: "15 min",
    price: "1 500 F",
    video: "/videos/galettes-mil.mp4",
    poster: "/videos/galettes-mil.jpg",
    bg: "radial-gradient(ellipse at 50% 60%, #c48a2a 0%, #6a3e10 45%, #1a0a04 100%)",
  },
  {
    name: "Bissap Glacé",
    vendor: "Kiosque Wend-Kuuni",
    rating: "4.9",
    time: "12 min",
    price: "2 000 F",
    video: "/videos/bissap-glace.mp4",
    poster: "/videos/bissap-glace.jpg",
    bg: "radial-gradient(ellipse at 50% 80%, #c43a1a 0%, #7a1a08 50%, #1a0404 100%)",
  },
];
