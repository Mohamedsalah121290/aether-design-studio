import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, BookOpen, Clock, Star, CheckCircle, 
  ChevronRight, Sparkles, GraduationCap, Filter, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  is_free: boolean;
  thumbnail_url: string | null;
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
  content_type: string;
  content_url: string | null;
  duration: string | null;
}

// Category thumbnails
const categoryThumbnails: Record<string, string> = {
  'ai-text': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
  'ai-image': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
  'ai-video': 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=400&fit=crop',
  'ai-audio': 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop',
  'general': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop',
};

const Academy = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' || i18n.language === 'ur' ? 'rtl' : 'ltr';
    window.scrollTo(0, 0);
  }, [i18n.language]);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, lessonsRes] = await Promise.all([
        supabase.from('courses').select('*').eq('is_published', true).order('created_at'),
        supabase.from('lessons').select('*').order('sort_order'),
      ]);

      if (coursesRes.data) setCourses(coursesRes.data);
      
      if (lessonsRes.data) {
        const grouped: Record<string, Lesson[]> = {};
        lessonsRes.data.forEach((l) => {
          if (!grouped[l.course_id]) grouped[l.course_id] = [];
          grouped[l.course_id].push(l);
        });
        setLessons(grouped);
      }

      // Fetch user progress if logged in
      if (user) {
        const { data: progress } = await supabase
          .from('user_progress')
          .select('lesson_id')
          .eq('completed', true);
        if (progress) {
          setCompletedLessonIds(new Set(progress.map((p) => p.lesson_id)));
        }
      }
    } catch (err) {
      console.error('Error fetching academy data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLessonComplete = async (lessonId: string) => {
    if (!user) return;
    const isCompleted = completedLessonIds.has(lessonId);

    if (isCompleted) {
      // Remove progress
      await supabase.from('user_progress').delete().eq('lesson_id', lessonId).eq('user_id', user.id);
      setCompletedLessonIds((prev) => {
        const next = new Set(prev);
        next.delete(lessonId);
        return next;
      });
    } else {
      // Add progress
      await supabase.from('user_progress').upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      });
      setCompletedLessonIds((prev) => new Set(prev).add(lessonId));
    }
  };

  const allCategories = ['all', ...Array.from(new Set(courses.map((c) => c.category)))];
  const filteredCourses = selectedCategory === 'all' ? courses : courses.filter((c) => c.category === selectedCategory);

  const totalLessons = Object.values(lessons).flat().length;
  const progressPercentage = totalLessons > 0 ? (completedLessonIds.size / totalLessons) * 100 : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'intermediate': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'advanced': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCourseLessons = (courseId: string) => lessons[courseId] || [];
  const getCourseProgress = (courseId: string) => {
    const cls = getCourseLessons(courseId);
    if (cls.length === 0) return 0;
    const completed = cls.filter((l) => completedLessonIds.has(l.id)).length;
    return Math.round((completed / cls.length) * 100);
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

            {user && (
              <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="text-start">
                  <p className="text-sm text-muted-foreground">{t('academy.yourProgress')}</p>
                  <p className="text-2xl font-bold">{completedLessonIds.size}/{totalLessons} {t('academy.lessonsCompleted')}</p>
                </div>
                <div className="w-32">
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border/50 sticky top-16 bg-background/80 backdrop-blur-xl z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            {allCategories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 capitalize ${selectedCategory === cat ? '' : 'bg-card/50 hover:bg-card'}`}
              >
                {cat === 'all' ? t('academy.categories.all', { defaultValue: 'All' }) : cat.replace('-', ' ')}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course, index) => {
                const courseLessons = getCourseLessons(course.id);
                const progress = getCourseProgress(course.id);
                const thumbnail = course.thumbnail_url || categoryThumbnails[course.category] || categoryThumbnails['general'];

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 cursor-pointer"
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      
                      {course.is_free && (
                        <div className="absolute top-3 start-3 px-2 py-1 rounded-lg bg-emerald-500/90 text-white text-xs font-bold">
                          FREE
                        </div>
                      )}

                      <div className="absolute top-3 end-3 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-white" />
                        <span className="text-xs text-white">{courseLessons.length} lessons</span>
                      </div>

                      {progress === 100 && (
                        <div className="absolute bottom-3 end-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`text-xs ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground capitalize">{course.category.replace('-', ' ')}</span>
                      </div>
                      
                      <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {course.description}
                      </p>

                      {user && progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{progress}% complete</span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No courses available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card border-border max-h-[85vh] overflow-y-auto">
              <DialogTitle className="sr-only">{selectedCourse.title}</DialogTitle>
              <DialogDescription className="sr-only">{selectedCourse.description}</DialogDescription>
              
              <div className="aspect-video relative">
                <img
                  src={selectedCourse.thumbnail_url || categoryThumbnails[selectedCourse.category] || categoryThumbnails['general']}
                  alt={selectedCourse.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>

              <div className="p-6 -mt-12 relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getDifficultyColor(selectedCourse.difficulty)}>
                    {selectedCourse.difficulty}
                  </Badge>
                  {selectedCourse.is_free && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Free</Badge>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
                <p className="text-muted-foreground mb-6">{selectedCourse.description}</p>

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Lessons ({getCourseLessons(selectedCourse.id).length})
                  </h3>
                  
                  {getCourseLessons(selectedCourse.id).map((lesson, idx) => {
                    const isCompleted = completedLessonIds.has(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCompleted ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            {lesson.title}
                          </p>
                          {lesson.duration && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {lesson.duration}
                            </span>
                          )}
                        </div>
                        {user && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLessonComplete(lesson.id);
                            }}
                            className={isCompleted ? 'text-emerald-400' : 'text-muted-foreground'}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
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
