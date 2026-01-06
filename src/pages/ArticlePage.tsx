import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Clock, User, Calendar, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ArticleItem {
  id: string;
  title: string;
  snippet: string;
  category: string;
  author: string;
  readTime: string;
  thumbnail: string;
  date: string;
  content: string;
}

const allArticles: ArticleItem[] = [
  {
    id: 'a1',
    title: 'The Ultimate ChatGPT Prompt Engineering Guide',
    snippet: 'Master the art of crafting prompts that get you exactly the results you need. From basic principles to advanced techniques.',
    category: 'ChatGPT Guide',
    author: 'Sarah Chen',
    readTime: '12 min',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    date: 'Jan 5, 2026',
    content: `Prompt engineering is the art and science of communicating effectively with AI language models. As these models become more powerful, understanding how to craft the right prompts becomes increasingly valuable.

## Understanding the Basics

The foundation of good prompt engineering lies in clarity and specificity. When you communicate with ChatGPT or similar models, think of it as giving instructions to a highly capable but literal-minded assistant.

### Key Principles

**1. Be Specific**
Instead of asking "Write something about marketing," try "Write a 500-word blog post about email marketing strategies for small e-commerce businesses, focusing on cart abandonment recovery."

**2. Provide Context**
Give the AI relevant background information. The more context you provide, the better the output will align with your expectations.

**3. Use Examples**
Show the AI what you want by providing examples. This technique, known as few-shot prompting, can dramatically improve output quality.

## Advanced Techniques

### Chain of Thought Prompting
Ask the AI to "think step by step" when solving complex problems. This encourages more thorough reasoning and often leads to better results.

### Role-Based Prompting
Assign the AI a specific role or persona. For example: "You are an experienced marketing consultant with 20 years of experience in B2B software sales."

### Iterative Refinement
Don't expect perfection on the first try. Use follow-up prompts to refine and improve the output.

## Best Practices

- Start with a clear goal in mind
- Break complex tasks into smaller steps
- Experiment with different phrasings
- Save your best prompts for reuse
- Stay updated on new model capabilities

Mastering prompt engineering is an ongoing journey. As AI models evolve, so too will the techniques for getting the best results from them.`,
  },
  {
    id: 'a2',
    title: '10 Design Tips for AI-Generated Images',
    snippet: 'Elevate your AI art with these professional design principles that separate amateur work from stunning visuals.',
    category: 'Design Tips',
    author: 'Alex Rivera',
    readTime: '8 min',
    thumbnail: 'https://images.unsplash.com/photo-1686191128892-3b37add1101e?w=1200&q=80',
    date: 'Jan 4, 2026',
    content: `Creating stunning AI-generated images requires more than just typing in a prompt. Professional artists and designers have developed techniques that consistently produce exceptional results.

## 1. Master Composition

Understanding basic composition principles like the rule of thirds, leading lines, and visual hierarchy will dramatically improve your AI art.

## 2. Specify Lighting

Lighting makes or breaks an image. Be specific about your lighting conditions: "golden hour sunlight streaming through windows" or "dramatic chiaroscuro lighting."

## 3. Reference Art Styles

Name specific artists or art movements to guide the aesthetic: "in the style of Studio Ghibli" or "Art Deco geometric patterns."

## 4. Use Negative Prompts

Tell the AI what NOT to include. This helps avoid common issues like distorted hands or unwanted elements.

## 5. Control Aspect Ratios

Match your aspect ratio to your intended use. 16:9 for banners, 1:1 for social media, 9:16 for mobile.

## 6. Layer Your Descriptions

Build your prompt in layers: subject, environment, lighting, style, mood, technical specifications.

## 7. Iterate and Refine

Generate multiple versions and use the best elements from each to inform your next prompt.

## 8. Understand Color Theory

Specify color palettes: "muted earth tones," "vibrant complementary colors," or "monochromatic blue scheme."

## 9. Add Texture Details

Include texture descriptions: "weathered wood," "brushed metal," "soft velvet" to add realism.

## 10. Study Real Photography

Learn from professional photography to understand what makes images visually compelling.`,
  },
  {
    id: 'a3',
    title: 'How to Build a Side Business with AI Tools',
    snippet: 'Discover proven strategies for monetizing AI skills and building a sustainable income stream in the AI economy.',
    category: 'Business',
    author: 'Mike Johnson',
    readTime: '15 min',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
    date: 'Jan 3, 2026',
    content: `The AI revolution has created unprecedented opportunities for entrepreneurs. Whether you're looking for a side hustle or building toward a full-time business, AI tools can be your competitive advantage.

## Identifying Opportunities

### Content Creation Services
Offer AI-enhanced writing, editing, and content strategy services. Many businesses need help creating consistent, high-quality content.

### Design Services
Use AI image generation tools to offer rapid prototyping, concept art, or social media graphics creation.

### Automation Consulting
Help businesses automate repetitive tasks using AI tools and workflows.

## Building Your Offering

**Start with a Niche**
Don't try to serve everyone. Focus on a specific industry or problem where you can develop expertise.

**Create Systems**
Document your processes so you can deliver consistent results and eventually scale.

**Build a Portfolio**
Showcase your best work to attract clients. Use AI to help you create sample projects if needed.

## Pricing Strategies

- Value-based pricing for business clients
- Package deals for predictable revenue
- Retainer arrangements for ongoing work

## Marketing Your Services

Leverage the same AI tools to market your business. Create content, automate outreach, and build your personal brand.

The key is to start small, learn continuously, and scale what works.`,
  },
  {
    id: 'a4',
    title: 'Midjourney vs DALL-E 3: Complete Comparison',
    snippet: 'An in-depth analysis of the two leading AI image generators, including use cases, pricing, and output quality.',
    category: 'Tool Review',
    author: 'Emily Watson',
    readTime: '10 min',
    thumbnail: 'https://images.unsplash.com/photo-1699839426298-dcb5c87df26b?w=1200&q=80',
    date: 'Jan 2, 2026',
    content: `Choosing between Midjourney and DALL-E 3 depends on your specific needs, workflow, and creative goals. Let's break down the key differences.

## Image Quality

**Midjourney** excels at creating artistic, stylized images with a distinctive aesthetic. It's particularly strong with fantasy, concept art, and visually striking compositions.

**DALL-E 3** produces more photorealistic results and handles text in images remarkably well. It's better for practical, commercial applications.

## Ease of Use

**Midjourney** operates through Discord, which has a learning curve but offers a community-driven experience.

**DALL-E 3** integrates with ChatGPT, making it incredibly intuitive for natural language prompting.

## Pricing

Both offer different pricing tiers. Consider your volume needs and whether you require commercial usage rights.

## Best Use Cases

**Choose Midjourney for:**
- Artistic and creative projects
- Concept art and illustrations
- Unique, stylized aesthetics

**Choose DALL-E 3 for:**
- Images with text
- Photorealistic needs
- Quick iterations with natural language

## Conclusion

Many professionals use both tools, choosing the right one for each specific project.`,
  },
  {
    id: 'a5',
    title: 'AI Writing Tools for Content Marketers',
    snippet: 'The essential toolkit for modern content creators: from ideation to editing, these AI tools will transform your workflow.',
    category: 'Content Marketing',
    author: 'Jessica Park',
    readTime: '9 min',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80',
    date: 'Jan 1, 2026',
    content: `Content marketing has been transformed by AI. Here's how to build an AI-powered content workflow that maximizes quality and efficiency.

## Ideation Tools

Use AI to brainstorm topics, analyze trends, and identify content gaps. Tools like ChatGPT can generate dozens of content ideas in seconds.

## Writing Assistants

AI writing tools help with:
- First draft generation
- Overcoming writer's block
- Maintaining consistent tone
- Expanding on outlines

## Editing and Optimization

AI-powered editing tools catch errors, improve readability, and optimize for SEO.

## Best Practices

1. Use AI as a starting point, not the final product
2. Always fact-check AI-generated content
3. Add your unique voice and expertise
4. Optimize for your specific audience

The best content combines AI efficiency with human creativity and judgment.`,
  },
  {
    id: 'a6',
    title: 'Getting Started with Claude for Research',
    snippet: 'Learn how researchers are using Claude to analyze papers, synthesize findings, and accelerate discovery.',
    category: 'Research',
    author: 'Dr. James Liu',
    readTime: '11 min',
    thumbnail: 'https://images.unsplash.com/photo-1676299081847-c3b7c4c9cdb6?w=1200&q=80',
    date: 'Dec 31, 2025',
    content: `Claude has become an invaluable tool for researchers across disciplines. Its ability to process and synthesize large amounts of information makes it perfect for academic work.

## Literature Review

Claude can help summarize papers, identify key findings, and spot connections between different studies.

## Data Analysis

While Claude can't run statistical analyses directly, it can help interpret results, suggest methodologies, and identify patterns.

## Writing Support

From abstracts to discussion sections, Claude assists with academic writing while maintaining scholarly standards.

## Ethical Considerations

Always disclose AI assistance in your research methodology. Use Claude as a tool to enhance, not replace, rigorous academic work.

## Tips for Researchers

- Provide specific context about your field
- Ask for citations and verify them
- Use iterative questioning for deeper analysis
- Combine AI insights with domain expertise`,
  },
  {
    id: 'a7',
    title: 'Voice AI: The Next Frontier',
    snippet: "From ElevenLabs to OpenAI's voice features, explore how voice AI is revolutionizing content creation.",
    category: 'Trends',
    author: 'Maria Santos',
    readTime: '7 min',
    thumbnail: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?w=1200&q=80',
    date: 'Dec 30, 2025',
    content: `Voice AI technology has reached a tipping point. Natural-sounding synthetic voices are now indistinguishable from human speakers in many cases.

## Current Applications

- Podcast production and narration
- Video voiceovers
- Audiobook creation
- Customer service automation

## Leading Platforms

**ElevenLabs** offers incredibly realistic voice cloning and generation.

**OpenAI's voice features** integrate seamlessly with ChatGPT for conversational applications.

## Creative Possibilities

Content creators are using voice AI to:
- Produce content in multiple languages
- Create consistent brand voices
- Scale audio content production

## Ethical Considerations

As voice AI becomes more powerful, questions around consent, deepfakes, and authenticity become increasingly important.`,
  },
  {
    id: 'a8',
    title: 'Automating Your Workflow with AI Agents',
    snippet: 'Step-by-step guide to setting up AI agents that handle repetitive tasks and boost your productivity.',
    category: 'Automation',
    author: 'Tom Bradley',
    readTime: '14 min',
    thumbnail: 'https://images.unsplash.com/photo-1680474569854-81216b34417a?w=1200&q=80',
    date: 'Dec 29, 2025',
    content: `AI agents are the next evolution of productivity tools. Unlike simple automation, agents can make decisions, adapt to changing conditions, and handle complex multi-step workflows.

## Understanding AI Agents

An AI agent is a system that can:
- Perceive its environment
- Make decisions based on goals
- Take actions to achieve those goals
- Learn from outcomes

## Building Your First Agent

Start simple. Identify a repetitive task that follows clear rules and build an agent to handle it.

## Tools and Platforms

Several platforms make it easy to build AI agents without extensive coding knowledge.

## Best Practices

1. Start with well-defined, limited scope
2. Include human oversight for important decisions
3. Monitor and iterate on agent performance
4. Document your agent's decision-making logic

The future of work is human-AI collaboration, with agents handling routine tasks so you can focus on high-value activities.`,
  },
  {
    id: 'a9',
    title: 'The Ethics of AI-Generated Content',
    snippet: 'Navigating the complex landscape of AI ethics, copyright, and best practices for responsible AI use.',
    category: 'Ethics',
    author: 'Prof. Anna Klein',
    readTime: '13 min',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    date: 'Dec 28, 2025',
    content: `As AI-generated content becomes ubiquitous, ethical considerations become increasingly important for creators and businesses.

## Key Ethical Questions

### Transparency
Should AI-generated content be labeled? When is disclosure necessary?

### Copyright
Who owns AI-generated content? What are the implications of training data usage?

### Employment Impact
How do we balance AI efficiency with human livelihoods?

## Best Practices

1. Disclose AI usage when relevant
2. Review AI output for accuracy and bias
3. Respect intellectual property
4. Consider the human impact of automation

## Looking Forward

The ethical landscape will continue to evolve. Stay informed and engage with these discussions to help shape responsible AI development.`,
  },
  {
    id: 'a10',
    title: 'AI Tools for Small Business Owners',
    snippet: 'Budget-friendly AI solutions that can help small businesses compete with larger competitors.',
    category: 'Small Business',
    author: 'David Chen',
    readTime: '8 min',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
    date: 'Dec 27, 2025',
    content: `Small businesses can now access AI tools that were once exclusive to enterprises with large budgets.

## Essential AI Tools

### Customer Service
AI chatbots can handle common inquiries 24/7, improving customer satisfaction while reducing costs.

### Marketing
AI-powered tools help with content creation, social media management, and advertising optimization.

### Operations
Automate inventory management, scheduling, and data entry with AI assistants.

## Getting Started

1. Identify your biggest time drains
2. Research AI solutions for those specific problems
3. Start with free trials before committing
4. Train your team on new tools

## ROI Considerations

Calculate the time saved and compare it to tool costs. Most AI tools pay for themselves within months.`,
  },
  {
    id: 'a11',
    title: 'Prompt Libraries: Your Secret Weapon',
    snippet: 'How to build and organize a prompt library that saves time and improves your AI output consistency.',
    category: 'Productivity',
    author: 'Lisa Thompson',
    readTime: '6 min',
    thumbnail: 'https://images.unsplash.com/photo-1686191128892-3b37add1101e?w=1200&q=80',
    date: 'Dec 26, 2025',
    content: `A well-organized prompt library is one of the most valuable assets for anyone working with AI regularly.

## Building Your Library

### Categorize by Use Case
Organize prompts by task type: writing, analysis, coding, creative, etc.

### Version Control
Keep track of prompt iterations and what worked best.

### Include Context Notes
Document when and why each prompt works well.

## Organization Systems

- Notion databases
- Dedicated prompt management tools
- Simple spreadsheets
- Text file collections

## Sharing and Collaboration

Consider sharing effective prompts with your team to multiply productivity gains.

The time invested in building a prompt library pays dividends every time you use AI.`,
  },
  {
    id: 'a12',
    title: "AI in Education: A Teacher's Guide",
    snippet: 'Practical strategies for educators to integrate AI tools while maintaining academic integrity.',
    category: 'Education',
    author: 'Robert Williams',
    readTime: '10 min',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80',
    date: 'Dec 25, 2025',
    content: `AI is transforming education. Teachers who embrace these tools thoughtfully can enhance learning outcomes while preparing students for an AI-integrated future.

## Classroom Applications

### Personalized Learning
AI can help create individualized learning paths based on student performance.

### Administrative Tasks
Automate grading of objective assessments, attendance tracking, and report generation.

### Content Creation
Generate practice problems, discussion questions, and supplementary materials.

## Academic Integrity

Rather than banning AI, teach students:
- When AI use is appropriate
- How to cite AI assistance
- Critical evaluation of AI output
- The importance of original thinking

## Professional Development

Stay current with AI developments. Experiment with tools before introducing them to students.

The goal is to prepare students for a world where AI is ubiquitous, while maintaining the value of human learning and creativity.`,
  },
];

const ArticlePage = () => {
  const { i18n } = useTranslation();
  const { articleId } = useParams<{ articleId: string }>();

  const article = useMemo(() => 
    allArticles.find(a => a.id === articleId),
    [articleId]
  );

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return allArticles
      .filter(a => a.id !== article.id && a.category === article.category)
      .slice(0, 3)
      .concat(
        allArticles
          .filter(a => a.id !== article.id && a.category !== article.category)
          .slice(0, 3 - allArticles.filter(a => a.id !== article.id && a.category === article.category).length)
      );
  }, [article]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    window.scrollTo(0, 0);
  }, [i18n.language, articleId]);

  if (!article) {
    return (
      <main className="min-h-screen mesh-gradient">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-24 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/content-hub">Back to Content Hub</Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen mesh-gradient">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-12 relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/content-hub"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Content Hub
            </Link>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium">
                {article.category}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-display font-black leading-tight mb-6"
            >
              {article.title}
            </motion.h1>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.readTime} read
              </span>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-3 mb-10"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
            </motion.div>

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl overflow-hidden mb-12"
            >
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full aspect-video object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="prose prose-lg prose-invert max-w-none">
              {article.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-display font-bold mt-10 mb-4 text-foreground">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-display font-bold mt-8 mb-3 text-foreground">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <p key={index} className="font-semibold text-foreground mb-4">
                      {paragraph.replace(/\*\*/g, '')}
                    </p>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
                      {items.map((item, i) => (
                        <li key={i}>{item.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.match(/^\d+\./)) {
                  const items = paragraph.split('\n').filter(line => line.match(/^\d+\./));
                  return (
                    <ol key={index} className="list-decimal list-inside space-y-2 mb-6 text-muted-foreground">
                      {items.map((item, i) => (
                        <li key={i}>{item.replace(/^\d+\.\s*/, '')}</li>
                      ))}
                    </ol>
                  );
                }
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-6">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </motion.article>
        </div>
      </section>

      {/* Related Articles */}
      <section className="pb-24 border-t border-border pt-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
                Related Articles
              </h2>
              <p className="text-muted-foreground">
                Continue exploring expert insights
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related, index) => (
                <motion.article
                  key={related.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link to={`/article/${related.id}`} className="block">
                    <div className="glass rounded-2xl overflow-hidden h-full flex flex-col hover:border-primary/30 transition-all duration-300">
                      {/* Thumbnail */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={related.thumbnail}
                          alt={related.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold backdrop-blur-sm">
                            {related.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <span>{related.author}</span>
                          <span>•</span>
                          <span>{related.readTime}</span>
                        </div>

                        <h3 className="font-display font-bold text-base leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2 flex-grow">
                          {related.title}
                        </h3>

                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                          Read Article
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Back to Hub */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <Link to="/content-hub" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Content Hub
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ArticlePage;
