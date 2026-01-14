import { BrandPalette } from "../types";

export const generateFlyerImage = (title: string, format: string, palette: BrandPalette): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';

    // Dimensions
    const width = 1080;
    const height = format === 'HISTORIA' || format === 'REEL' ? 1920 : 1080; // Post 1080x1080 or 1080x1350, simplistic approach 1:1 for post

    canvas.width = width;
    canvas.height = height;

    // Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, palette.colors.bg);
    gradient.addColorStop(1, palette.colors.secondary);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative Elements (Circles)
    ctx.fillStyle = palette.colors.primary;
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.arc(width, 0, 400, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = palette.colors.accent;
    ctx.beginPath();
    ctx.arc(0, height, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Logo Area (Placeholder)
    ctx.fillStyle = palette.colors.primary;
    ctx.font = 'bold 60px Inter';
    ctx.textAlign = 'center';
    ctx.fillText("FARMACIA PASTOR", width / 2, 100);
    
    ctx.font = '40px Manrope';
    ctx.fillStyle = palette.colors.text;
    ctx.fillText("Cafayate • Salta", width / 2, 150);

    // Main Text (Title)
    ctx.fillStyle = palette.colors.primary;
    ctx.font = 'bold 80px Inter';
    
    // Simple text wrapping
    const words = title.split(' ');
    let line = '';
    let y = height / 2 - 50;
    const maxWidth = width - 100;
    const lineHeight = 90;

    for(let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, width/2, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width/2, y);

    // Footer
    ctx.fillStyle = palette.colors.accent;
    ctx.fillRect(0, height - 30, width, 30);

    return canvas.toDataURL('image/png');
};