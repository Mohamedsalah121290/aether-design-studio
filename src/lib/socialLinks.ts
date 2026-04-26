export const socialLinks = {
  youtube: "https://www.youtube.com/@AiDeals.belgie",
  facebook: "https://www.facebook.com/profile.php?id=61586111130045",
  instagram: "https://www.instagram.com/aideals.be/",
  whatsapp: "https://wa.me/32494311190",
  telegram: "https://t.me/aideals2026",
};

export const supportLinks = {
  whatsapp: "https://wa.me/32494311190",
  telegram: "https://t.me/aideals2026",
};

export const isUsableSocialLink = (href?: string | null) => {
  if (!href) return false;
  try {
    const url = new URL(href);
    return url.protocol === 'https:' && Boolean(url.hostname);
  } catch {
    return false;
  }
};