import SEO from '@/components/SEO';
import { SITE_URL } from '@/lib/seo/seoMap';
import ContentHub from './ContentHub';

const BlogPage = () => {
  // JSON-LD for the blog hub: ItemList of recent posts + Blog entity.
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'AI DEALS Blog',
      url: `${SITE_URL}/blog`,
      publisher: {
        '@type': 'Organization',
        name: 'AI DEALS',
        url: SITE_URL,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      ],
    },
  ];

  return (
    <>
      <SEO page="blog" jsonLd={jsonLd} />
      <ContentHub />
    </>
  );
};

export default BlogPage;
