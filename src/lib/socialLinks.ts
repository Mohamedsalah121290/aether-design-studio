export const socialLinks = {
  youtube: "https://www.youtube.com/@AiDeals.belgie",
  facebook: "https://www.facebook.com/profile.php?id=61586111130045",
  instagram: "https://www.instagram.com/aideals.be/",
  whatsapp: "https://wa.me/32494311190",
  telegram: "https://t.me/aideals2026",
  pinterest: "https://www.pinterest.com/aideals2026/",
  twitter: "",
  tiktok: "https://www.tiktok.com/@aideals.be?lang=en",
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

export const getChatToBuyLinks = (productName: string, productUrl: string) => {
  const message = encodeURIComponent(`Hi I want to buy ${productName} - ${productUrl}`);
  const whatsapp = isUsableSocialLink(supportLinks.whatsapp) ? `${supportLinks.whatsapp}?text=${message}` : '';
  const telegram = isUsableSocialLink(supportLinks.telegram) ? `${supportLinks.telegram}?text=${message}` : '';
  return { whatsapp, telegram };
};