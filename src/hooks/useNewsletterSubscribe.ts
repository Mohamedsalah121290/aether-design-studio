import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useNewsletterSubscribe = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('subscribers' as any)
        .insert({ email: trimmed } as any);

      if (error) {
        if (error.code === '23505') {
          toast.info('You\'re already subscribed!');
        } else {
          toast.error('Something went wrong. Please try again.');
        }
      } else {
        toast.success('Welcome aboard! 🎉');
        setEmail('');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, loading, subscribe };
};
