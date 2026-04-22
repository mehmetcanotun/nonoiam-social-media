// lib/supabase.js
// nonoiam — Supabase Client Setup
// ─────────────────────────────────

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// ⚠️ Bu değerleri kendi Supabase projenizden alın:
// Supabase Dashboard → Settings → API
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // React Native'de URL yok
  },
});

// ─── ANONIM AUTH ───
// Kullanıcı ilk kez açtığında anonim session oluştur
export async function ensureAnonymousSession() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error('Anonymous auth failed:', error.message);
      return null;
    }
    return data.session;
  }

  return session;
}

// ─── USER PROFILE ───
export async function createUserProfile(color, tone, language = 'tr') {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      color,
      tone,
      language,
    })
    .select()
    .single();

  if (error) console.error('Profile creation failed:', error.message);
  return data;
}

export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return data;
}

// ─── POSTS ───
export async function createPost(text, emotion, isLocked = false, silenceMode = false) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // 3 cümle kontrolü (client-side)
  const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 3) {
    return { error: 'Maximum 3 sentences allowed' };
  }

  if (isLocked) {
    // Kilitli paylaşım — sadece kullanıcı görür
    const { data, error } = await supabase
      .from('locked_posts')
      .insert({ user_id: user.id, text, emotion })
      .select()
      .single();
    return { data, error };
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id: user.id, text, emotion, is_locked: false, silence_mode: silenceMode })
    .select()
    .single();

  return { data, error };
}

export async function getFeed(limit = 50) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      users!inner(color, tone, symbol),
      reactions(type)
    `)
    .eq('is_locked', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data, error };
}

export async function getMyPosts() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [] };

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function getLockedPosts() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [] };

  const { data, error } = await supabase
    .from('locked_posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { data, error };
}

// ─── REACTIONS ───
export async function addReaction(postId, type) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Sadece 1 tepki per post per user (UNIQUE constraint)
  const { data, error } = await supabase
    .from('reactions')
    .upsert({
      post_id: postId,
      user_id: user.id,
      type,
    })
    .select()
    .single();

  return { data, error };
}

// ─── EMOTION STATS (Premium) ───
export async function getEmotionStats(days = 30) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [] };

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from('posts')
    .select('emotion, created_at')
    .eq('user_id', user.id)
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: false });

  if (!data) return { data: [] };

  // Duygu yüzdelerini hesapla
  const counts = {};
  data.forEach(post => {
    counts[post.emotion] = (counts[post.emotion] || 0) + 1;
  });

  const total = data.length;
  const stats = Object.entries(counts)
    .map(([emotion, count]) => ({
      emotion,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  return { data: stats, error };
}

// ─── ACCOUNT DELETION ───
export async function deleteAccount() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Tüm verileri sil (cascade ile otomatik)
  await supabase.from('locked_posts').delete().eq('user_id', user.id);
  await supabase.from('reactions').delete().eq('user_id', user.id);
  await supabase.from('posts').delete().eq('user_id', user.id);
  await supabase.from('users').delete().eq('id', user.id);

  // Session'ı kapat
  await supabase.auth.signOut();

  return { success: true };
}
