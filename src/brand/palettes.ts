import { BrandPalette } from '../types';

export const PALETTES: BrandPalette[] = [
    {
        name: "Farmacia Premium",
        colors: {
            primary: "#166534", // Green 800
            secondary: "#f0fdf4", // Green 50
            accent: "#ca8a04", // Yellow 600 (Goldish)
            bg: "#f8fafc", // Slate 50
            surface: "#ffffff",
            text: "#1e293b" // Slate 800
        }
    },
    {
        name: "Farmacia Moderna",
        colors: {
            primary: "#0369a1", // Sky 700
            secondary: "#e0f2fe", // Sky 50
            accent: "#0ea5e9", // Sky 500
            bg: "#f0f9ff", // Sky 50
            surface: "#ffffff",
            text: "#0f172a" // Slate 900
        }
    },
    {
        name: "Farmacia Cálida",
        colors: {
            primary: "#9f1239", // Rose 800 (Terracotta-ish)
            secondary: "#fff1f2", // Rose 50
            accent: "#be123c", // Rose 700
            bg: "#ffffb1", // Yellow 50 (very light beige)
            surface: "#ffffff",
            text: "#4a044e" // Fuchsia 950
        }
    }
];