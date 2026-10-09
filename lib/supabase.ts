import { createClient } from '@supabase/supabase-js';
import { auth } from './firebase';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  {
    accessToken: async () => {
      const user = auth.currentUser;
      if (user) {
        return await user.getIdToken();
      }
      return '';
    },
  }
);
