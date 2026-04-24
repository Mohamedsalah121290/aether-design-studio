import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { SITE_URL, resolveSeoLang } from '@/lib/seo/seoMap';
import { getBlogPost, getBlogLocale, BLOG_POSTS } from '@/lib/seo/blogPosts';

const BlogArticlePage = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const lang = resolveSeoLang(i18n.language);
  const post = getBlogPost(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <main className="min-h-screen mesh-gradient">
        <SEO page="blog" pathOverride={`/blog/${slug}`} noIndex />
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-24 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Article not found</h1>
          <Button asChild><Link to="/blog">Back to Blog</Link></Button>
        </div>
        <Footer />
      </main>
    );
  }

  const loc = getBlogLocale(post, lang);
  const url = `${SITE_URL}/blog/${post.slug}`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: loc.title,
      description: loc.description,
      inLanguage: lang,
      author: { '@type': 'Organization', name: post.author },
      publisher: {
        '@type': 'Organization',
        name: 'AI DEALS',
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.png` },
      },
      datePublished: post.date,
      dateModified: post.date,
      image: post.thumbnail,
      mainEntityOfPage: url,
      keywords: [loc.primaryKeyword, ...loc.secondaryKeywords].join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: loc.title, item: url },
      ],
    },
  ];

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="min-h-screen mesh-gradient">
      <SEO
        page="blog"
        pathOverride={`/blog/${post.slug}`}
        image={post.thumbnail}
        ogType="article"
        titleOverride={loc.title}
        descriptionOverride={loc.description}
        keywordsOverride={[loc.primaryKeyword, ...loc.secondaryKeywords]}
        jsonLd={jsonLd}
      />
      <Navbar />

      <article className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> Blog
          </Link>

          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            {post.category}
          </span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-display font-bold leading-tight mb-4"
          >
            {loc.h1}
          </motion.h1>

          <p className="text-muted-foreground mb-8">
            {post.author} · {post.readTime} · {post.date}
          </p>

          <img
            src={post.thumbnail}
            alt={loc.title}
            className="w-full aspect-[16/9] object-cover rounded-2xl mb-10"
            loading="lazy"
          />

          <p className="text-lg leading-relaxed text-foreground mb-10">{loc.intro}</p>

          {loc.sections.map((s, i) => (
            <section key={i} className="mb-8">
              <h2 className="text-2xl font-display font-bold mb-3">{s.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{s.body}</p>
            </section>
          ))}

          <div className="glass rounded-2xl p-6 mt-12 border border-primary/30">
            <Button asChild size="lg" className="gap-2">
              <Link to="/store">{loc.cta} <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </article>

      <section className="pb-24 border-t border-border pt-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-8 text-center">Related Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r) => {
              const rl = getBlogLocale(r, lang);
              return (
                <Link key={r.slug} to={`/blog/${r.slug}`} className="block group">
                  <div className="glass rounded-2xl overflow-hidden h-full hover:border-primary/30 transition-all">
                    <img src={r.thumbnail} alt={rl.title} className="w-full aspect-[16/10] object-cover" loading="lazy" />
                    <div className="p-5">
                      <span className="text-xs text-primary font-semibold">{r.category}</span>
                      <h3 className="font-display font-bold mt-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {rl.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default BlogArticlePage;
