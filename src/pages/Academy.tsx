import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, BookOpen, Clock, Star, CheckCircle, ExternalLink, 
  X, ChevronRight, Sparkles, GraduationCap, Briefcase, 
  Languages, Palette, Code, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

// Lesson data structure
interface Lesson {
  id: string;
  titleKey: string;
  descriptionKey: string;
  category: 'language' | 'content' | 'business' | 'tutorials';
  type: 'video' | 'article';
  difficulty: 'beginner' | 'intermediate' | 'expert';
  duration: string;
  thumbnail: string;
  videoUrl?: string;
  toolsUsed: string[];
  featured?: boolean;
}

// Mock lessons data
const lessons: Lesson[] = [
  {
    id: '1',
    titleKey: 'academy.lessons.chatgptMastery.title',
    descriptionKey: 'academy.lessons.chatgptMastery.description',
    category: 'tutorials',
    type: 'video',
    difficulty: 'beginner',
    duration: '12:30',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    toolsUsed: ['ChatGPT Plus', 'Claude Pro'],
    featured: true,
  },
  {
    id: '2',
    titleKey: 'academy.lessons.aiContentCreation.title',
    descriptionKey: 'academy.lessons.aiContentCreation.description',
    category: 'content',
    type: 'video',
    difficulty: 'intermediate',
    duration: '18:45',
    thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    toolsUsed: ['Midjourney', 'Runway Gen-4'],
    featured: true,
  },
  {
    id: '3',
    titleKey: 'academy.lessons.languageLearning.title',
    descriptionKey: 'academy.lessons.languageLearning.description',
    category: 'language',
    type: 'video',
    difficulty: 'beginner',
    duration: '15:20',
    thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=400&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    toolsUsed: ['ChatGPT Plus', 'ElevenLabs'],
  },
  {
    id: '4',
    titleKey: 'academy.lessons.businessAutomation.title',
    descriptionKey: 'academy.lessons.businessAutomation.description',
    category: 'business',
    type: 'article',
    difficulty: 'expert',
    duration: '25 min',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    toolsUsed: ['ChatGPT Plus', 'Claude Pro', 'Notion AI'],
  },
  {
    id: '5',
    titleKey: 'academy.lessons.midjourneyArt.title',
    descriptionKey: 'academy.lessons.midjourneyArt.description',
    category: 'content',
    type: 'video',
    difficulty: 'intermediate',
    duration: '22:10',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    toolsUsed: ['Midjourney'],
    featured: true,
  },
  {
    id: '6',
    titleKey: 'academy.lessons.promptEngineering.title',
    descriptionKey: 'academy.lessons.promptEngineering.description',
    category: 'tutorials',
    type: 'article',
    difficulty: 'intermediate',
    duration: '18 min',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop',
    toolsUsed: ['ChatGPT Plus', 'Claude Pro'],
  },
  {
    id: '7',
    titleKey: 'academy.lessons.videoGeneration.title',
    descriptionKey: 'academy.lessons.videoGeneration.description',
    category: 'content',
    type: 'video',
    difficulty: 'expert',
    duration: '28:00',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=400&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    toolsUsed: ['Runway Gen-4', 'ElevenLabs'],
  },
  {
    id: '8',
    titleKey: 'academy.lessons.aiTranslation.title',
    descriptionKey: 'academy.lessons.aiTranslation.description',
    category: 'language',
    type: 'article',
    difficulty: 'beginner',
    duration: '10 min',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    toolsUsed: ['ChatGPT Plus', 'DeepL Pro'],
  },
];

// Tool data with official logos and brand colors
const toolData: Record<string, { price: number; color: string; glow: string; logo: string }> = {
  'ChatGPT Plus': { 
    price: 12, 
    color: '#10A37F', 
    glow: '160 84% 40%',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg'
  },
  'Claude Pro': { 
    price: 15, 
    color: '#D97757', 
    glow: '20 55% 58%',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg'
  },
  'Midjourney': { 
    price: 18, 
    color: '#7C3AED', 
    glow: '258 90% 66%',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png'
  },
  'Runway Gen-4': { 
    price: 22, 
    color: '#FF2D55', 
    glow: '349 100% 59%',
    logo: 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1615813352/vu1cjc3gidyrbivrqdip.png'
  },
  'ElevenLabs': { 
    price: 16, 
    color: '#000000', 
    glow: '0 0% 50%',
    logo: 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1673539371/hrmn0g6eozdxcjfmqpnr.png'
  },
  'Notion AI': { 
    price: 8, 
    color: '#000000', 
    glow: '0 0% 40%',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png'
  },
  'DeepL Pro': { 
    price: 10, 
    color: '#0F2B46', 
    glow: '206 100% 42%',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/DeepL_logo.svg'
  },
};

const Academy = () => {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('academy-completed');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' || i18n.language === 'ur' ? 'rtl' : 'ltr';
    window.scrollTo(0, 0);
  }, [i18n.language]);

  const toggleComplete = (lessonId: string) => {
    const updated = completedLessons.includes(lessonId)
      ? completedLessons.filter(id => id !== lessonId)
      : [...completedLessons, lessonId];
    setCompletedLessons(updated);
    localStorage.setItem('academy-completed', JSON.stringify(updated));
  };

  const categories = [
    { id: 'all', labelKey: 'academy.categories.all', icon: Sparkles },
    { id: 'language', labelKey: 'academy.categories.language', icon: Languages },
    { id: 'content', labelKey: 'academy.categories.content', icon: Palette },
    { id: 'business', labelKey: 'academy.categories.business', icon: Briefcase },
    { id: 'tutorials', labelKey: 'academy.categories.tutorials', icon: Code },
  ];

  const filteredLessons = selectedCategory === 'all' 
    ? lessons 
    : lessons.filter(l => l.category === selectedCategory);

  const featuredLessons = lessons.filter(l => l.featured);
  const progressPercentage = (completedLessons.length / lessons.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'intermediate': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'expert': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-purple-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,50,200,0.15),transparent_60%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t('academy.badge')}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('academy.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-500">{t('academy.titleHighlight')}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('academy.description')}
            </p>

            {/* Progress Overview */}
            <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-start">
                <p className="text-sm text-muted-foreground">{t('academy.yourProgress')}</p>
                <p className="text-2xl font-bold">{completedLessons.length}/{lessons.length} {t('academy.lessonsCompleted')}</p>
              </div>
              <div className="w-32">
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border/50 sticky top-16 bg-background/80 backdrop-blur-xl z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 gap-2 ${selectedCategory === cat.id ? '' : 'bg-card/50 hover:bg-card'}`}
                >
                  <Icon className="w-4 h-4" />
                  {t(cat.labelKey)}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      {selectedCategory === 'all' && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              {t('academy.featured')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredLessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedLesson(lesson)}
                >
                  <div className="aspect-video relative">
                    <img 
                      src={lesson.thumbnail} 
                      alt={t(lesson.titleKey)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center">
                        {lesson.type === 'video' ? <Play className="w-6 h-6 text-white ms-1" /> : <BookOpen className="w-6 h-6 text-white" />}
                      </div>
                    </div>

                    {/* Completed badge */}
                    {completedLessons.includes(lesson.id) && (
                      <div className="absolute top-3 end-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-0 start-0 end-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`text-xs ${getDifficultyColor(lesson.difficulty)}`}>
                        {t(`academy.difficulty.${lesson.difficulty}`)}
                      </Badge>
                      <span className="text-xs text-white/70 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {lesson.duration}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white line-clamp-1">{t(lesson.titleKey)}</h3>
                    <p className="text-sm text-white/70 line-clamp-1">{t(lesson.descriptionKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bento Grid Lessons */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategory === 'all' ? t('academy.allLessons') : t(`academy.categories.${selectedCategory}`)}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 cursor-pointer"
                onClick={() => setSelectedLesson(lesson)}
              >
                {/* Thumbnail */}
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={lesson.thumbnail} 
                    alt={t(lesson.titleKey)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  
                  {/* Type indicator */}
                  <div className="absolute top-3 start-3">
                    <div className="px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm flex items-center gap-1">
                      {lesson.type === 'video' ? (
                        <Play className="w-3 h-3 text-white" />
                      ) : (
                        <BookOpen className="w-3 h-3 text-white" />
                      )}
                      <span className="text-xs text-white font-medium">
                        {lesson.type === 'video' ? t('academy.video') : t('academy.article')}
                      </span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="absolute top-3 end-3">
                    <div className="px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm flex items-center gap-1">
                      <Clock className="w-3 h-3 text-white" />
                      <span className="text-xs text-white">{lesson.duration}</span>
                    </div>
                  </div>

                  {/* Completed overlay */}
                  {completedLessons.includes(lesson.id) && (
                    <div className="absolute bottom-3 end-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`text-xs ${getDifficultyColor(lesson.difficulty)}`}>
                      {t(`academy.difficulty.${lesson.difficulty}`)}
                    </Badge>
                  </div>
                  
                  <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {t(lesson.titleKey)}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {t(lesson.descriptionKey)}
                  </p>

                  {/* Tools used preview with official logos */}
                  <div className="flex items-center gap-2">
                    {lesson.toolsUsed.slice(0, 3).map((tool) => {
                      const toolInfo = toolData[tool];
                      return (
                        <div 
                          key={tool}
                          className="w-8 h-8 rounded-lg flex items-center justify-center p-1.5 transition-all duration-300"
                          style={{ 
                            backgroundColor: `${toolInfo?.color}15`,
                            boxShadow: toolInfo ? `0 0 12px hsl(${toolInfo.glow} / 0.4), 0 0 4px hsl(${toolInfo.glow} / 0.2)` : 'none',
                            border: `1px solid ${toolInfo?.color}30`
                          }}
                          title={tool}
                        >
                          {toolInfo?.logo ? (
                            <img 
                              src={toolInfo.logo} 
                              alt={tool}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-xs font-bold" style={{ color: toolInfo?.color || '#666' }}>
                              {tool.charAt(0)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {lesson.toolsUsed.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{lesson.toolsUsed.length - 3}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video/Article Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <Dialog open={!!selectedLesson} onOpenChange={() => setSelectedLesson(null)}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border">
              <DialogTitle className="sr-only">{t(selectedLesson.titleKey)}</DialogTitle>
              <DialogDescription className="sr-only">{t(selectedLesson.descriptionKey)}</DialogDescription>
              
              {/* Video/Image area */}
              <div className="aspect-video bg-black relative">
                {selectedLesson.type === 'video' && selectedLesson.videoUrl ? (
                  <iframe
                    src={selectedLesson.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img 
                    src={selectedLesson.thumbnail} 
                    alt={t(selectedLesson.titleKey)}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Lesson details */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getDifficultyColor(selectedLesson.difficulty)}>
                        {t(`academy.difficulty.${selectedLesson.difficulty}`)}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {selectedLesson.duration}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold">{t(selectedLesson.titleKey)}</h2>
                  </div>
                  
                  <Button
                    variant={completedLessons.includes(selectedLesson.id) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleComplete(selectedLesson.id)}
                    className="flex-shrink-0"
                  >
                    <CheckCircle className="w-4 h-4 me-2" />
                    {completedLessons.includes(selectedLesson.id) 
                      ? t('academy.completed') 
                      : t('academy.markComplete')}
                  </Button>
                </div>

                <p className="text-muted-foreground mb-6">{t(selectedLesson.descriptionKey)}</p>

                {/* Tools used in this lesson */}
                <div className="bg-muted/30 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    {t('academy.toolsUsed')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedLesson.toolsUsed.map((tool) => {
                      const toolInfo = toolData[tool];
                      return (
                        <Link
                          key={tool}
                          to="/"
                          className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
                          style={{
                            boxShadow: toolInfo ? `0 0 0 0 hsl(${toolInfo.glow} / 0)` : 'none',
                          }}
                          onMouseEnter={(e) => {
                            if (toolInfo) {
                              e.currentTarget.style.boxShadow = `0 4px 20px hsl(${toolInfo.glow} / 0.3), 0 0 30px hsl(${toolInfo.glow} / 0.15)`;
                              e.currentTarget.style.borderColor = toolInfo.color;
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = '';
                          }}
                        >
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center p-2 transition-all duration-300"
                            style={{ 
                              backgroundColor: `${toolInfo?.color}15`,
                              boxShadow: toolInfo ? `0 0 16px hsl(${toolInfo.glow} / 0.5), 0 0 8px hsl(${toolInfo.glow} / 0.3)` : 'none',
                              border: `1px solid ${toolInfo?.color}40`
                            }}
                          >
                            {toolInfo?.logo ? (
                              <img 
                                src={toolInfo.logo} 
                                alt={tool}
                                className="w-full h-full object-contain drop-shadow-lg"
                                style={{
                                  filter: `drop-shadow(0 0 6px ${toolInfo.color}80)`
                                }}
                              />
                            ) : (
                              <span className="text-lg font-bold" style={{ color: toolInfo?.color || '#666' }}>
                                {tool.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{tool}</p>
                            <p className="text-xs text-muted-foreground">${toolInfo?.price}/mo</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Academy;
