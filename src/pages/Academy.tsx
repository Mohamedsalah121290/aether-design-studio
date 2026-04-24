import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, BookOpen, Clock, Star, CheckCircle, Lock,
  ChevronRight, Sparkles, GraduationCap, Filter, Loader2, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { AuthDialog } from '@/components/AuthDialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  is_free: boolean;
  price: number | null;
  thumbnail_url: string | null;
  tool_id: string | null;
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
  content_type: string;
  content_url: string | null;
  duration: string | null;
  is_preview: boolean;
}

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
  const [searchParams] = useSearchParams();
  const toolIdParam = searchParams.get('tool_id');
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [subscribedCourseIds, setSubscribedCourseIds] = useState<Set<string>>(new Set());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [playingLesson, setPlayingLesson] = useState<Lesson | null>(null);
  const courseRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

      const loadedCourses = (coursesRes.data || []) as Course[];
      setCourses(loadedCourses);

      // Deep link: auto-open course matching tool_id param
      if (toolIdParam && loadedCourses.length > 0) {
        const match = loadedCourses.find(c => c.tool_id === toolIdParam);
        if (match) {
          setSelectedCourse(match);
          // Scroll to course card after render
          setTimeout(() => {
            courseRefs.current[match.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
      }
      
      if (lessonsRes.data) {
        const grouped: Record<string, Lesson[]> = {};
        (lessonsRes.data as Lesson[]).forEach((l) => {
          if (!grouped[l.course_id]) grouped[l.course_id] = [];
          grouped[l.course_id].push(l);
        });
        setLessons(grouped);
      }

      if (user) {
        const [progressRes, subsRes] = await Promise.all([
          supabase.from('user_progress').select('lesson_id').eq('completed', true),
          supabase.from('academy_subscriptions').select('course_id').eq('status', 'active'),
        ]);
        if (progressRes.data) {
          setCompletedLessonIds(new Set(progressRes.data.map((p: any) => p.lesson_id)));
        }
        if (subsRes.data) {
          setSubscribedCourseIds(new Set(subsRes.data.map((s: any) => s.course_id)));
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
      await supabase.from('user_progress').delete().eq('lesson_id', lessonId).eq('user_id', user.id);
      setCompletedLessonIds((prev) => {
        const next = new Set(prev);
        next.delete(lessonId);
        return next;
      });
    } else {
      await supabase.from('user_progress').upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      });
      setCompletedLessonIds((prev) => new Set(prev).add(lessonId));
    }
  };

  const handleSubscribeCourse = async (course: Course) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    if (course.is_free) {
      // Free course: auto-subscribe
      const { error } = await supabase.from('academy_subscriptions').insert({
        user_id: user.id,
        course_id: course.id,
        status: 'active',
      });
      if (!error) {
        setSubscribedCourseIds(prev => new Set(prev).add(course.id));
        toast({ title: 'Enrolled!', description: `You now have full access to ${course.title}.` });
      }
    } else {
      // Paid course: for now show a toast (Stripe integration can be added later)
      toast({ title: 'Coming Soon', description: 'Paid course checkout will be available soon.' });
    }
  };

  const canAccessLesson = (course: Course, lesson: Lesson): boolean => {
    if (lesson.is_preview) return true;
    if (course.is_free && user) return true;
    return subscribedCourseIds.has(course.id);
  };

  const handleLessonClick = (course: Course, lesson: Lesson) => {
    if (!canAccessLesson(course, lesson)) {
      if (!user) {
        setShowAuthDialog(true);
      } else {
        handleSubscribeCourse(course);
      }
      return;
    }
    setPlayingLesson(lesson);
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
                const isSubscribed = subscribedCourseIds.has(course.id);
                const previewCount = courseLessons.filter(l => l.is_preview).length;

                return (
                  <motion.div
                    key={course.id}
                    ref={el => { courseRefs.current[course.id] = el; }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative bg-card rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 cursor-pointer ${toolIdParam && course.tool_id === toolIdParam ? 'border-primary/60 ring-2 ring-primary/20' : 'border-border/50 hover:border-primary/50'}`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      
                      {course.is_free ? (
                        <div className="absolute top-3 start-3 px-2 py-1 rounded-lg bg-emerald-500/90 text-white text-xs font-bold">
                          FREE
                        </div>
                      ) : course.price ? (
                        <div className="absolute top-3 start-3 px-2 py-1 rounded-lg bg-primary/90 text-white text-xs font-bold">
                          ${course.price}/mo
                        </div>
                      ) : null}

                      <div className="absolute top-3 end-3 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-white" />
                        <span className="text-xs text-white">{courseLessons.length} lessons</span>
                      </div>

                      {isSubscribed && progress === 100 && (
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
                        {isSubscribed && (
                          <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">Enrolled</Badge>
                        )}
                      </div>
                      
                      <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {course.description}
                      </p>

                      {isSubscribed && progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{progress}% complete</span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                      )}

                      {!isSubscribed && previewCount > 0 && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {previewCount} preview lesson{previewCount > 1 ? 's' : ''}
                        </p>
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
                  {subscribedCourseIds.has(selectedCourse.id) && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Enrolled</Badge>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
                <p className="text-muted-foreground mb-6">{selectedCourse.description}</p>

                {/* Subscribe CTA for non-subscribers */}
                {!subscribedCourseIds.has(selectedCourse.id) && (
                  <div className="mb-6 p-4 rounded-2xl border border-primary/20 bg-primary/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">
                          {selectedCourse.is_free ? 'Enroll for Free' : `Subscribe for $${selectedCourse.price}/mo`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Get full access to all lessons</p>
                      </div>
                      <Button onClick={() => handleSubscribeCourse(selectedCourse)} className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        {selectedCourse.is_free ? 'Enroll' : 'Subscribe'}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Lessons ({getCourseLessons(selectedCourse.id).length})
                  </h3>
                  
                  {getCourseLessons(selectedCourse.id).map((lesson, idx) => {
                    const isCompleted = completedLessonIds.has(lesson.id);
                    const hasAccess = canAccessLesson(selectedCourse, lesson);
                    const isLocked = !hasAccess;
                    
                    return (
                      <div
                        key={lesson.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                          isLocked 
                            ? 'bg-muted/10 border-border/30 opacity-70' 
                            : 'bg-muted/30 border-border/50 hover:border-primary/30'
                        }`}
                        onClick={() => handleLessonClick(selectedCourse, lesson)}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isLocked ? 'bg-muted/50 text-muted-foreground' :
                          isCompleted ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          {isLocked ? <Lock className="w-3.5 h-3.5" /> : isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                              {lesson.title}
                            </p>
                            {lesson.is_preview && (
                              <Badge className="text-[10px] bg-blue-500/20 text-blue-400 border-blue-500/30 px-1.5 py-0">Preview</Badge>
                            )}
                          </div>
                          {lesson.duration && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {lesson.duration}
                            </span>
                          )}
                        </div>
                        {hasAccess && (
                          <div className="flex items-center gap-1">
                            {lesson.content_url && (
                              <Play className="w-4 h-4 text-primary" />
                            )}
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
                        )}
                        {isLocked && (
                          <span className="text-xs text-muted-foreground">Subscribe to access</span>
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

      {/* Video Player Modal */}
      {playingLesson && (
        <Dialog open={!!playingLesson} onOpenChange={() => setPlayingLesson(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border">
            <DialogTitle className="p-4 pb-0 font-bold">{playingLesson.title}</DialogTitle>
            <DialogDescription className="px-4 text-xs text-muted-foreground">
              {playingLesson.duration && `Duration: ${playingLesson.duration}`}
            </DialogDescription>
            {playingLesson.content_url ? (
              <div className="aspect-video">
                <iframe
                  src={playingLesson.content_url}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={playingLesson.title}
                />
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-muted/30">
                <p className="text-muted-foreground">No video available for this lesson.</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      <Footer />

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        defaultMode="login"
      />
    </div>
  );
};

export default Academy;
