export const socialLinks = {
  youtube: "https://www.youtube.com/@AiDeals.belgie",
  facebook: "https://www.facebook.com/profile.php?id=61586111130045",
  instagram: "https://www.instagram.com/aideals.be/",
  whatsapp: "",
  telegram: "",
  pinterest: "",
  twitter: "",
  tiktok: "",
};

export const supportLinks = {
  whatsapp: "",
  telegram: "",
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