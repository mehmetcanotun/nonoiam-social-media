import { useState, useEffect } from "react";

const PHASES = [
  {
    id: 1,
    title: "Geliştirme Ortamı Kurulumu",
    icon: "⊡",
    duration: "1-2 saat",
    status: "ready",
    steps: [
      {
        title: "Node.js & npm kur",
        detail: "nodejs.org → LTS sürümünü indir (v20+). Terminal'de `node -v` ile kontrol et.",
        command: "node -v && npm -v",
        critical: false,
      },
      {
        title: "React Native CLI kur",
        detail: "Expo kullanacağız — daha hızlı, daha az konfigürasyon. Expo Go ile anında test.",
        command: "npx create-expo-app nonoiam --template blank",
        critical: true,
      },
      {
        title: "Android Studio kur",
        detail: "developer.android.com/studio → İndir & kur. SDK Manager'dan Android 14 (API 34) SDK'yı seç. Emulator oluştur.",
        command: null,
        critical: true,
        link: "https://developer.android.com/studio",
      },
      {
        title: "ANDROID_HOME ayarla",
        detail: "Environment Variables'a ANDROID_HOME ekle. Windows: %LOCALAPPDATA%\\Android\\Sdk, Mac: ~/Library/Android/sdk",
        command: 'export ANDROID_HOME=$HOME/Library/Android/sdk\nexport PATH=$PATH:$ANDROID_HOME/emulator\nexport PATH=$PATH:$ANDROID_HOME/platform-tools',
        critical: true,
      },
      {
        title: "EAS CLI kur (Build servisi)",
        detail: "Expo Application Services — bulutta APK/AAB build eder. Google Play'e yüklemek için şart.",
        command: "npm install -g eas-cli && eas login",
        critical: true,
      },
      {
        title: "Test et",
        detail: "Projeyi başlat, Expo Go ile telefondan veya emülatörden bağlan.",
        command: "cd nonoiam && npx expo start",
        critical: false,
      },
    ],
  },
  {
    id: 2,
    title: "Proje Yapısı & Temel Paketler",
    icon: "◫",
    duration: "2-3 saat",
    status: "ready",
    steps: [
      {
        title: "Temel paketleri kur",
        detail: "Navigation, animasyon, font, icon ve güvenli alan paketleri.",
        command: `npx expo install expo-router expo-font expo-splash-screen
npx expo install react-native-reanimated react-native-gesture-handler
npx expo install react-native-safe-area-context react-native-screens
npx expo install @react-native-async-storage/async-storage
npx expo install expo-localization`,
        critical: true,
      },
      {
        title: "Supabase SDK kur",
        detail: "Backend olarak Supabase kullanacağız — auth, database, realtime.",
        command: "npm install @supabase/supabase-js",
        critical: true,
      },
      {
        title: "Dosya yapısını oluştur",
        detail: "Aşağıdaki klasör yapısını oluştur. Her ekran ayrı component.",
        command: null,
        critical: true,
        fileTree: `nonoiam/
├── app/
│   ├── _layout.js          # Root layout
│   ├── index.js             # Landing screen
│   ├── philosophy.js        # Felsefe ekranı
│   ├── identity.js          # Kimlik seçimi
│   └── (tabs)/
│       ├── _layout.js       # Tab navigation
│       ├── feed.js           # Akış
│       ├── post.js           # Paylaşım
│       └── profile.js        # Profil
├── components/
│   ├── PostCard.js
│   ├── EmotionPicker.js
│   ├── SilentReaction.js
│   └── BrokenCircle.js
├── lib/
│   ├── supabase.js          # Supabase client
│   ├── i18n.js              # Çoklu dil sistemi
│   └── emotions.js          # Duygu config
├── constants/
│   ├── colors.js
│   └── languages/
│       ├── tr.json
│       ├── en.json
│       ├── de.json
│       ├── ja.json
│       ├── es.json
│       ├── fr.json
│       └── ar.json
├── assets/
│   ├── icon.png             # 1024x1024
│   ├── splash.png           # 1284x2778
│   └── adaptive-icon.png    # 1024x1024
├── app.json
├── eas.json
└── package.json`,
      },
      {
        title: "app.json yapılandır",
        detail: "Expo konfigürasyonu — paket adı, sürüm, splash screen, permissions.",
        command: null,
        critical: true,
        code: `{
  "expo": {
    "name": "nonoiam",
    "slug": "nonoiam",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#111113"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#111113"
      },
      "package": "com.nonoiam.app",
      "versionCode": 1,
      "permissions": []
    },
    "plugins": ["expo-router", "expo-localization"]
  }
}`,
      },
      {
        title: "eas.json yapılandır",
        detail: "Build profilleri — development, preview (test APK), production (Play Store AAB).",
        command: null,
        critical: true,
        code: `{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}`,
      },
    ],
  },
  {
    id: 3,
    title: "Supabase Backend Kurulumu",
    icon: "◈",
    duration: "2-3 saat",
    status: "ready",
    steps: [
      {
        title: "Supabase projesi oluştur",
        detail: "supabase.com → New Project → Region: Frankfurt (Avrupa). Proje adı: nonoiam. Güçlü DB şifresi belirle.",
        command: null,
        critical: true,
        link: "https://supabase.com/dashboard",
      },
      {
        title: "Veritabanı tablolarını oluştur",
        detail: "SQL Editor'da bu sorguyu çalıştır. Kullanıcılar anonim UUID ile, paylaşımlar 3 cümle sınırlı.",
        command: null,
        critical: true,
        code: `-- Kullanıcılar (anonim)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  color TEXT NOT NULL,
  tone TEXT NOT NULL CHECK (tone IN ('flat','broken','soft')),
  symbol TEXT DEFAULT '◌',
  language TEXT DEFAULT 'tr',
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Paylaşımlar
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL CHECK (char_length(text) <= 500),
  emotion TEXT NOT NULL,
  is_locked BOOLEAN DEFAULT false,
  silence_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sessiz tepkiler
CREATE TABLE reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('here','understand','metoo','pass')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Kilitli paylaşımlar (premium)
CREATE TABLE locked_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  emotion TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Günlük post limiti (max 2)
CREATE OR REPLACE FUNCTION check_daily_post_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*) FROM posts
    WHERE user_id = NEW.user_id
    AND created_at::date = CURRENT_DATE
  ) >= 2 THEN
    RAISE EXCEPTION 'Daily post limit reached (max 2)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_daily_limit
  BEFORE INSERT ON posts
  FOR EACH ROW EXECUTE FUNCTION check_daily_post_limit();`,
      },
      {
        title: "Row Level Security (RLS) aktifle",
        detail: "Her kullanıcı sadece kendi verisini görsün. Bu ZORUNLU — güvenlik için şart.",
        command: null,
        critical: true,
        code: `-- RLS aktifle
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE locked_posts ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi profilini okuyabilir/düzenleyebilir
CREATE POLICY "users_self" ON users
  FOR ALL USING (auth.uid() = id);

-- Herkes paylaşımları okuyabilir (locked olmayanları)
CREATE POLICY "posts_read" ON posts
  FOR SELECT USING (is_locked = false);

-- Kullanıcı kendi postlarını oluşturabilir
CREATE POLICY "posts_create" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tepkiler — herkes ekleyebilir, kendi tepkisini görebilir
CREATE POLICY "reactions_create" ON reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reactions_read" ON reactions
  FOR SELECT USING (true);

-- Kilitli postlar — sadece sahibi
CREATE POLICY "locked_self" ON locked_posts
  FOR ALL USING (auth.uid() = user_id);`,
      },
      {
        title: "Anonim Auth aktifle",
        detail: "Authentication → Providers → Anonymous sign-ins: Enable. Kullanıcılar kayıt olmadan UUID alacak.",
        command: null,
        critical: true,
      },
      {
        title: "Feed algoritması (Edge Function)",
        detail: "Duygusal benzerlik bazlı akış — 300-500 kişilik dönen odalar. Supabase Edge Function olarak deploy et.",
        command: null,
        critical: false,
        code: `// supabase/functions/get-feed/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  // Son paylaşımlarının duygularını al
  const { data: userPosts } = await supabase
    .from("posts")
    .select("emotion")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const emotions = userPosts?.map(p => p.emotion) || [];
  const primaryEmotion = emotions[0] || "calm";

  // Benzer duygu paylaşımlarını getir (max 500 unique user)
  const { data: feed } = await supabase
    .from("posts")
    .select("*, reactions(type)")
    .eq("is_locked", false)
    .eq("silence_mode", false)
    .order("created_at", { ascending: false })
    .limit(50);

  // Duygusal benzerlik skoru ile sırala
  const scored = (feed || []).map(post => ({
    ...post,
    score: post.emotion === primaryEmotion ? 3 :
           emotions.includes(post.emotion) ? 2 : 1
  })).sort((a, b) => b.score - a.score || 
    new Date(b.created_at) - new Date(a.created_at));

  return new Response(JSON.stringify(scored), {
    headers: { "Content-Type": "application/json" }
  });
});`,
      },
    ],
  },
  {
    id: 4,
    title: "UI → React Native Dönüşümü",
    icon: "◉",
    duration: "5-7 gün",
    status: "ready",
    steps: [
      {
        title: "Tema & Stil sistemi oluştur",
        detail: "Tüm renkler, fontlar, spacing değerleri tek dosyada. Dark mode default — nonoiam'da light mode yok.",
        command: null,
        critical: true,
        code: `// constants/theme.js
export const theme = {
  bg: '#111113',
  surface: 'rgba(255,255,255,0.02)',
  border: 'rgba(255,255,255,0.04)',
  text: {
    primary: 'rgba(255,255,255,0.65)',
    secondary: 'rgba(255,255,255,0.35)',
    muted: 'rgba(255,255,255,0.15)',
    accent: 'rgba(255,255,255,0.85)',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 36 },
  radius: { sm: 8, md: 12, lg: 16, pill: 24 },
  animation: {
    slow: 400,   // nonoiam yavaş nefes alır
    medium: 300,
    fast: 200,
  }
};`,
      },
      {
        title: "Fontları yükle",
        detail: "Cormorant Garamond (italic, felsefe) + DM Sans (UI). Google Fonts'tan .ttf indir → assets/fonts/",
        command: `npx expo install expo-font
# assets/fonts/ klasörüne kopyala:
# CormorantGaramond-Light.ttf
# CormorantGaramond-LightItalic.ttf
# DMSans-Light.ttf
# DMSans-LightItalic.ttf
# DMSans-Regular.ttf`,
        critical: true,
      },
      {
        title: "Ekranları teker teker dönüştür",
        detail: "JSX → React Native. View, Text, TouchableOpacity, Animated kullan. Her ekranı test et.",
        command: null,
        critical: true,
        checklist: [
          "Landing Screen (index.js)",
          "Philosophy Screen",
          "Identity Screen",
          "Feed Screen + PostCard component",
          "Post Screen + EmotionPicker",
          "Profile Screen + Emotion Map",
          "Tab Navigation layout",
          "Çoklu dil sistemi (i18n.js)",
          "Supabase auth entegrasyonu",
          "AsyncStorage ile onboarding durumu",
        ],
      },
      {
        title: "Animasyonlar",
        detail: "react-native-reanimated ile yavaş, nefes alan geçişler. FadeIn, SlideUp, tümü 300-400ms.",
        command: null,
        critical: false,
      },
      {
        title: "Cihazda test et",
        detail: "Expo Go ile gerçek cihazda test. Farklı ekran boyutları, RTL (Arapça), performans kontrol.",
        command: "npx expo start --android",
        critical: true,
      },
    ],
  },
  {
    id: 5,
    title: "App Icon & Store Görselleri",
    icon: "◑",
    duration: "1-2 gün",
    status: "ready",
    steps: [
      {
        title: "App Icon — Kesik Daire (1024x1024)",
        detail: "Koyu arka plan (#111113), açık gri ince çember, alt kısmında küçük boşluk. Figma veya Canva ile.",
        command: null,
        critical: true,
        specs: "1024×1024 PNG, 32-bit, şeffaflık yok (Google Play redder)",
      },
      {
        title: "Adaptive Icon (Android 8+)",
        detail: "Foreground: Kesik daire logosu (padding bırak). Background: #111113 düz renk.",
        command: null,
        critical: true,
        specs: "Foreground: 1024×1024, safe zone: merkezdeki 66% alan",
      },
      {
        title: "Feature Graphic (Play Store banner)",
        detail: "1024×500 — koyu füme zemin, ortada nonoiam logosu, altında 'no noise. i am.'",
        command: null,
        critical: true,
        specs: "1024×500 PNG veya JPG, max 1MB",
      },
      {
        title: "Ekran Görüntüleri (min 2, max 8)",
        detail: "Her ana ekrandan screenshot — Landing, Feed, Post, Profile. Telefon mockup içinde göster.",
        command: null,
        critical: true,
        specs: "Min 320px, max 3840px. En az 2 adet. 16:9 veya 9:16 oran.",
        checklist: [
          "Landing ekranı — logo + tagline",
          "Felsefe ekranı — 'Varlığın yeter'",
          "Akış ekranı — postlar + sessiz tepkiler",
          "Paylaşım ekranı — duygu seçimi + 'Bırak'",
          "Profil — duygu haritası",
        ],
      },
      {
        title: "Splash Screen",
        detail: "Uygulama açılışı — siyah zemin, ortada küçük kesik daire, yavaş fade in.",
        command: null,
        critical: false,
        specs: "1284×2778 (iPhone), 1080×1920 (Android)",
      },
    ],
  },
  {
    id: 6,
    title: "Google Play Console Hazırlık",
    icon: "◰",
    duration: "1-2 saat",
    status: "ready",
    steps: [
      {
        title: "Google Play Developer hesabı aç",
        detail: "play.google.com/console → Kayıt ol. Tek seferlik $25 ücret. Kimlik doğrulama gerekebilir (D-U-N-S veya kişisel).",
        command: null,
        critical: true,
        link: "https://play.google.com/console",
        cost: "$25 (tek seferlik)",
      },
      {
        title: "Yeni uygulama oluştur",
        detail: "Create app → App name: nonoiam → Default language: Türkçe → Free → App category: Social",
        command: null,
        critical: true,
      },
      {
        title: "Store Listing doldur (7 dil)",
        detail: "Her dil için ayrı title, short description, full description yaz. Aşağıda hazır metinler var.",
        command: null,
        critical: true,
      },
      {
        title: "Content Rating soru formunu doldur",
        detail: "IARC → Şiddet: Yok, Cinsel içerik: Yok, Uyuşturucu: Yok, Dil: Hafif (kullanıcı içeriği). Sonuç: Everyone / PEGI 3",
        command: null,
        critical: true,
      },
      {
        title: "Target Audience & Content",
        detail: "Hedef yaş: 18+ (çocuklara yönelik değil — kullanıcı üretimi içerik var). Reklam: Hayır.",
        command: null,
        critical: true,
      },
      {
        title: "Privacy Policy sayfası oluştur",
        detail: "ZORUNLU. GitHub Pages veya basit bir web sayfası. nonoiam'ın gizlilik felsefesiyle uyumlu.",
        command: null,
        critical: true,
      },
      {
        title: "Data Safety formu doldur",
        detail: "Toplanan veri: Anonim kullanıcı ID. Paylaşılmıyor. Şifreleniyor. Silinebilir.",
        command: null,
        critical: true,
      },
    ],
  },
  {
    id: 7,
    title: "Build & Yayınlama",
    icon: "◧",
    duration: "1-2 saat",
    status: "ready",
    steps: [
      {
        title: "Preview build (test APK)",
        detail: "Önce test APK'sı oluştur. Gerçek cihazda son kontrolleri yap.",
        command: "eas build --platform android --profile preview",
        critical: true,
      },
      {
        title: "Production build (AAB)",
        detail: "Google Play'e yüklenecek App Bundle. EAS bulutta imzalar.",
        command: "eas build --platform android --profile production",
        critical: true,
      },
      {
        title: "Google Play'e yükle",
        detail: "EAS Submit ile otomatik veya Console'dan manuel. İlk sürüm: Internal Testing track'i önerilir.",
        command: "eas submit --platform android --profile production",
        critical: true,
      },
      {
        title: "Internal Testing (kapalı beta)",
        detail: "İlk 20 test kullanıcısıyla internal test. 14 gün bekle (ilk uygulama incelemesi).",
        command: null,
        critical: true,
      },
      {
        title: "Closed Testing → Open Testing → Production",
        detail: "Aşamalı yayın: 1000 kişi davet kodu ile → Açık beta → Tam yayın. nonoiam sessizce büyür.",
        command: null,
        critical: false,
      },
      {
        title: "İnceleme süreci",
        detail: "Google ilk incelemede 3-7 gün sürebilir. Sonraki güncellemeler genelde 1-3 gün.",
        command: null,
        critical: false,
      },
    ],
  },
];

const STORE_LISTINGS = {
  tr: {
    title: "nonoiam",
    short: "Sessiz bir sosyal ağ. Gürültü yok. Sen varsın.",
    full: `nonoiam sessiz bir sosyal ağdır.

Burada bağırılmaz. Beğenilmek zorunda değilsin. Konuşmak istemiyorsan sorun yok. Varlığın yeter.

▸ Takipçi yok, beğeni yok, paylaşım sayısı yok
▸ Kullanıcı adı yok — sadece bir renk tonu ve yazı stili
▸ Günde en fazla 2 paylaşım, en fazla 3 cümle
▸ "Paylaş" değil — "Bırak"
▸ Sessiz tepkiler: "Buradayım", "Anlıyorum", "Ben de", "Geçecek"

nonoiam seni ölçmez, sıralamaz, karşılaştırmaz. Algoritmamız popülerliğe değil, duygusal benzerliğe bakar.

Uygulamayı kapattığında sinir sistemin daha sessiz hisseder.

Reklam yok. Veri satışı yok. Karanlık desen yok.

no noise. i am.`,
  },
  en: {
    title: "nonoiam",
    short: "A silent social network. No noise. You exist.",
    full: `nonoiam is a silent social network.

No one shouts here. You don't have to be liked. If you don't want to talk, that's okay. Your existence is enough.

▸ No followers, no likes, no share counts
▸ No username — just a color tone and writing style
▸ Maximum 2 posts per day, 3 sentences each
▸ Not "Post" — "Leave it"
▸ Silent reactions: "I'm here", "I understand", "Me too", "It will pass"

nonoiam doesn't measure you, rank you, or compare you. Our algorithm looks at emotional similarity, not popularity.

When you close the app, your nervous system feels quieter.

No ads. No data selling. No dark patterns.

no noise. i am.`,
  },
  de: {
    title: "nonoiam",
    short: "Ein stilles soziales Netzwerk. Kein Lärm. Du existierst.",
    full: `nonoiam ist ein stilles soziales Netzwerk.

Hier wird nicht geschrien. Du musst nicht gemocht werden. Wenn du nicht reden willst, ist das okay. Deine Existenz reicht.

▸ Keine Follower, keine Likes, keine Teilen-Zähler
▸ Kein Nutzername — nur ein Farbton und ein Schreibstil
▸ Maximal 2 Beiträge pro Tag, je 3 Sätze
▸ Nicht "Posten" — "Loslassen"
▸ Stille Reaktionen: "Ich bin hier", "Ich verstehe", "Ich auch", "Es wird vergehen"

Keine Werbung. Kein Datenverkauf. Keine dunklen Muster.

no noise. i am.`,
  },
  ja: {
    title: "nonoiam",
    short: "静かなソーシャルネットワーク。騒音なし。あなたがいる。",
    full: `nonoiamは静かなソーシャルネットワークです。

ここでは叫ばない。好かれる必要はない。話したくなければ、それでいい。存在するだけで十分。

▸ フォロワーなし、いいねなし、シェア数なし
▸ ユーザー名なし — 色と書き方だけ
▸ 1日最大2投稿、各3文まで
▸「投稿」ではなく「手放す」
▸ 静かな反応:「ここにいる」「わかる」「私も」「過ぎていく」

広告なし。データ販売なし。ダークパターンなし。

no noise. i am.`,
  },
  es: {
    title: "nonoiam",
    short: "Una red social silenciosa. Sin ruido. Tú existes.",
    full: `nonoiam es una red social silenciosa.

Aquí no se grita. No tienes que gustarle a nadie. Si no quieres hablar, está bien. Tu existencia es suficiente.

▸ Sin seguidores, sin likes, sin contadores
▸ Sin nombre de usuario — solo un tono de color y estilo de escritura
▸ Máximo 2 publicaciones por día, 3 oraciones cada una
▸ No "Publicar" — "Soltar"
▸ Reacciones silenciosas: "Estoy aquí", "Entiendo", "Yo también", "Pasará"

Sin anuncios. Sin venta de datos. Sin patrones oscuros.

no noise. i am.`,
  },
  fr: {
    title: "nonoiam",
    short: "Un réseau social silencieux. Pas de bruit. Tu existes.",
    full: `nonoiam est un réseau social silencieux.

Ici, personne ne crie. Tu n'as pas besoin d'être aimé. Si tu ne veux pas parler, c'est bien. Ton existence suffit.

▸ Pas d'abonnés, pas de likes, pas de compteurs
▸ Pas de nom d'utilisateur — juste une teinte et un style d'écriture
▸ Maximum 2 publications par jour, 3 phrases chacune
▸ Pas "Publier" — "Lâcher"
▸ Réactions silencieuses: "Je suis là", "Je comprends", "Moi aussi", "Ça passera"

Pas de publicité. Pas de vente de données. Pas de dark patterns.

no noise. i am.`,
  },
  ar: {
    title: "nonoiam",
    short: "شبكة اجتماعية صامتة. لا ضجيج. أنت موجود.",
    full: `nonoiam شبكة اجتماعية صامتة.

هنا لا أحد يصرخ. لست مضطرًا أن تُحَب. إن لم ترد التحدث، لا بأس. وجودك يكفي.

▸ لا متابعون، لا إعجابات، لا عدّادات
▸ لا اسم مستخدم — فقط لون ونبرة كتابة
▸ حد أقصى منشورتان يوميًا، ٣ جمل لكل منها
▸ ليس "انشر" — "اتركها"
▸ ردود صامتة: "أنا هنا"، "أفهم"، "أنا أيضًا"، "سيمضي"

لا إعلانات. لا بيع بيانات. لا أنماط مظلمة.

no noise. i am.`,
  },
};

// ─── UI COMPONENTS ───

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      style={{
        position: "absolute", top: 8, right: 8,
        background: copied ? "rgba(122,158,126,0.2)" : "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 6, padding: "4px 10px",
        color: copied ? "rgba(122,158,126,0.8)" : "rgba(255,255,255,0.3)",
        fontSize: 11, cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        transition: "all 0.3s ease",
      }}
    >
      {copied ? "✓" : "kopya"}
    </button>
  );
}

function CodeBlock({ code, lang = "" }) {
  return (
    <div style={{ position: "relative", marginTop: 8 }}>
      {lang && (
        <span style={{
          position: "absolute", top: 8, left: 12,
          fontSize: 9, color: "rgba(255,255,255,0.2)",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}>{lang}</span>
      )}
      <CopyButton text={code} />
      <pre style={{
        background: "rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10, padding: "28px 14px 14px",
        overflowX: "auto", margin: 0,
        fontSize: 11.5, lineHeight: 1.6,
        color: "rgba(255,255,255,0.55)",
        fontFamily: "'SF Mono', 'Fira Code', monospace",
      }}>
        {code}
      </pre>
    </div>
  );
}

function StepItem({ step, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      borderBottom: "1px solid rgba(255,255,255,0.03)",
      padding: "14px 0",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          background: "none", border: "none", cursor: "pointer",
          width: "100%", textAlign: "left", padding: 0,
        }}
      >
        <span style={{
          width: 22, height: 22, borderRadius: "50%",
          border: "1px solid",
          borderColor: step.critical ? "rgba(212,200,122,0.3)" : "rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, color: step.critical ? "rgba(212,200,122,0.6)" : "rgba(255,255,255,0.25)",
          fontFamily: "'DM Sans', sans-serif",
          flexShrink: 0, marginTop: 1,
        }}>
          {index + 1}
        </span>
        <div style={{ flex: 1 }}>
          <p style={{
            margin: 0, fontSize: 13.5,
            color: "rgba(255,255,255,0.65)",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
          }}>
            {step.title}
            {step.critical && (
              <span style={{
                marginLeft: 8, fontSize: 9,
                color: "rgba(212,200,122,0.5)",
                letterSpacing: "0.08em",
              }}>ZORUNLU</span>
            )}
          </p>
          <p style={{
            margin: "4px 0 0", fontSize: 12,
            color: "rgba(255,255,255,0.3)",
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.5,
          }}>
            {step.detail}
          </p>
        </div>
        <span style={{
          color: "rgba(255,255,255,0.15)", fontSize: 12,
          transform: open ? "rotate(180deg)" : "rotate(0)",
          transition: "transform 0.3s ease",
          flexShrink: 0,
        }}>▾</span>
      </button>

      {open && (
        <div style={{
          marginTop: 12, marginLeft: 34,
          animation: "fadeIn 0.3s ease",
        }}>
          {step.command && <CodeBlock code={step.command} lang="terminal" />}
          {step.code && <CodeBlock code={step.code} lang={step.code.includes("CREATE") ? "sql" : step.code.includes("import") ? "javascript" : "json"} />}
          {step.fileTree && <CodeBlock code={step.fileTree} lang="structure" />}
          {step.specs && (
            <p style={{
              fontSize: 11, color: "rgba(176,143,98,0.6)",
              fontFamily: "'DM Sans', sans-serif",
              marginTop: 8, lineHeight: 1.5,
            }}>📐 {step.specs}</p>
          )}
          {step.link && (
            <a href={step.link} target="_blank" rel="noopener" style={{
              display: "inline-block", marginTop: 8,
              fontSize: 11, color: "rgba(123,143,162,0.7)",
              fontFamily: "'DM Sans', sans-serif",
              textDecoration: "none",
              borderBottom: "1px solid rgba(123,143,162,0.2)",
            }}>
              ↗ {step.link}
            </a>
          )}
          {step.cost && (
            <p style={{
              fontSize: 11, color: "rgba(176,112,112,0.6)",
              fontFamily: "'DM Sans', sans-serif",
              marginTop: 6,
            }}>💳 {step.cost}</p>
          )}
          {step.checklist && (
            <div style={{ marginTop: 8 }}>
              {step.checklist.map((item, i) => (
                <label key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "4px 0", cursor: "pointer",
                }}>
                  <input type="checkbox" style={{ accentColor: "#7A9E7E" }} />
                  <span style={{
                    fontSize: 12, color: "rgba(255,255,255,0.35)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>{item}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StoreListingTab({ listings }) {
  const [activeLang, setActiveLang] = useState("tr");
  const langNames = { tr: "🇹🇷", en: "🇬🇧", de: "🇩🇪", ja: "🇯🇵", es: "🇪🇸", fr: "🇫🇷", ar: "🇸🇦" };
  const listing = listings[activeLang];

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.keys(listings).map((code) => (
          <button
            key={code}
            onClick={() => setActiveLang(code)}
            style={{
              padding: "6px 12px", borderRadius: 14,
              background: activeLang === code ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)",
              border: "1px solid",
              borderColor: activeLang === code ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
              fontSize: 13, cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {langNames[code]}
          </button>
        ))}
      </div>

      <div style={{
        background: "rgba(255,255,255,0.02)",
        borderRadius: 14, padding: 20,
        border: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ marginBottom: 16 }}>
          <p style={{
            fontSize: 10, color: "rgba(255,255,255,0.2)",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.1em", marginBottom: 4,
          }}>TITLE</p>
          <p style={{
            fontSize: 18, color: "rgba(255,255,255,0.7)",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            margin: 0,
          }}>{listing.title}</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <p style={{
            fontSize: 10, color: "rgba(255,255,255,0.2)",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.1em", marginBottom: 4,
          }}>SHORT DESCRIPTION (max 80 char)</p>
          <p style={{
            fontSize: 13, color: "rgba(255,255,255,0.5)",
            fontFamily: "'DM Sans', sans-serif",
            margin: 0, lineHeight: 1.6,
            direction: activeLang === "ar" ? "rtl" : "ltr",
          }}>{listing.short}</p>
          <p style={{
            fontSize: 10, color: listing.short.length > 80 ? "rgba(176,88,88,0.6)" : "rgba(255,255,255,0.15)",
            marginTop: 4,
          }}>{listing.short.length}/80</p>
        </div>

        <div>
          <p style={{
            fontSize: 10, color: "rgba(255,255,255,0.2)",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.1em", marginBottom: 4,
          }}>FULL DESCRIPTION (max 4000 char)</p>
          <pre style={{
            fontSize: 12, color: "rgba(255,255,255,0.4)",
            fontFamily: "'DM Sans', sans-serif",
            margin: 0, lineHeight: 1.7,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            direction: activeLang === "ar" ? "rtl" : "ltr",
          }}>{listing.full}</pre>
          <p style={{
            fontSize: 10, color: "rgba(255,255,255,0.15)",
            marginTop: 8,
          }}>{listing.full.length}/4000</p>
        </div>

        <CopyButton text={`Title: ${listing.title}\n\nShort: ${listing.short}\n\nFull:\n${listing.full}`} />
      </div>
    </div>
  );
}

// ─── MAIN APP ───
export default function RoadmapApp() {
  const [activePhase, setActivePhase] = useState(1);
  const [tab, setTab] = useState("roadmap"); // roadmap | listings | checklist
  const [progress, setProgress] = useState({});

  const totalSteps = PHASES.reduce((sum, p) => sum + p.steps.length, 0);
  const completedSteps = Object.values(progress).filter(Boolean).length;
  const pct = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111113",
      color: "rgba(255,255,255,0.7)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "28px 24px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <path d="M 20 2 A 18 18 0 1 1 14 36.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
          <span style={{
            fontSize: 22, fontWeight: 200, letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.75)",
          }}>nonoiam</span>
          <span style={{
            marginLeft: "auto",
            fontSize: 10, color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.08em",
          }}>GOOGLE PLAY ROADMAP</span>
        </div>

        {/* Progress */}
        <div style={{ marginTop: 16 }}>
          <div style={{
            display: "flex", justifyContent: "space-between", marginBottom: 6,
          }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em" }}>
              İlerleme
            </span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
              {completedSteps}/{totalSteps}
            </span>
          </div>
          <div style={{
            height: 3, borderRadius: 2,
            background: "rgba(255,255,255,0.04)",
          }}>
            <div style={{
              width: `${pct}%`, height: "100%", borderRadius: 2,
              background: "rgba(122,158,126,0.4)",
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 16 }}>
          {[
            { key: "roadmap", label: "Yol Haritası" },
            { key: "listings", label: "Store Metinleri" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "7px 16px", borderRadius: 16,
                background: tab === t.key ? "rgba(255,255,255,0.06)" : "transparent",
                border: "1px solid",
                borderColor: tab === t.key ? "rgba(255,255,255,0.1)" : "transparent",
                color: tab === t.key ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
                fontSize: 12, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.3s ease",
                letterSpacing: "0.04em",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "0 24px 60px" }}>
        {tab === "roadmap" && (
          <div>
            {/* Phase selector */}
            <div style={{
              display: "flex", gap: 6, padding: "20px 0",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
            }}>
              {PHASES.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  style={{
                    padding: "10px 16px", borderRadius: 12,
                    background: activePhase === phase.id ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.01)",
                    border: "1px solid",
                    borderColor: activePhase === phase.id ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                    textAlign: "left",
                    minWidth: 110,
                  }}
                >
                  <span style={{
                    display: "block", fontSize: 16,
                    color: activePhase === phase.id ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)",
                    marginBottom: 4,
                  }}>{phase.icon}</span>
                  <span style={{
                    display: "block", fontSize: 11,
                    color: activePhase === phase.id ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "0.03em",
                    lineHeight: 1.3,
                  }}>{phase.title}</span>
                  <span style={{
                    display: "block", fontSize: 10,
                    color: "rgba(255,255,255,0.12)",
                    marginTop: 4,
                  }}>{phase.duration}</span>
                </button>
              ))}
            </div>

            {/* Active phase content */}
            {PHASES.filter((p) => p.id === activePhase).map((phase) => (
              <div key={phase.id} style={{ animation: "fadeIn 0.4s ease" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  marginBottom: 20, paddingBottom: 14,
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <span style={{ fontSize: 24, color: "rgba(255,255,255,0.3)" }}>{phase.icon}</span>
                  <div>
                    <h2 style={{
                      fontSize: 16, fontWeight: 300,
                      color: "rgba(255,255,255,0.65)",
                      letterSpacing: "0.04em",
                    }}>{phase.title}</h2>
                    <p style={{
                      fontSize: 11, color: "rgba(255,255,255,0.2)",
                      marginTop: 2,
                    }}>Tahmini süre: {phase.duration} — {phase.steps.length} adım</p>
                  </div>
                </div>

                {phase.steps.map((step, i) => (
                  <StepItem key={i} step={step} index={i} />
                ))}
              </div>
            ))}
          </div>
        )}

        {tab === "listings" && (
          <div style={{ paddingTop: 20 }}>
            <p style={{
              fontSize: 13, color: "rgba(255,255,255,0.35)",
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              marginBottom: 20, lineHeight: 1.6,
            }}>
              Google Play Console → Store Listing → her dil için ayrı ayrı gir.
            </p>
            <StoreListingTab listings={STORE_LISTINGS} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(to top, #111113 70%, transparent)",
        padding: "16px 24px 20px",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 13, fontStyle: "italic",
          color: "rgba(255,255,255,0.15)",
          letterSpacing: "0.06em",
        }}>
          nonoiam hızlı büyümez. ama gelen gitmez.
        </p>
      </div>
    </div>
  );
}
