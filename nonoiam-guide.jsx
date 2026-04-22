import { useState } from "react";

const STEPS = [
  {
    id: "vscode-open",
    phase: "VS Code",
    title: "VS Code'da Projeyi Aç",
    substeps: [
      {
        text: "VS Code'u aç",
        detail: "Masaüstünde veya Start Menu'de 'Visual Studio Code' yaz, aç.",
      },
      {
        text: "File → Open Folder tıkla",
        detail: "Sol üst köşede File menüsüne tıkla, sonra 'Open Folder...' seç.",
      },
      {
        text: "Proje klasörünü seç",
        detail: "Şu yola git:\nC:\\Users\\Mehmet Can\\Projects\\nonoiam\nKlasörü seç ve 'Select Folder' tıkla.",
        path: "C:\\Users\\Mehmet Can\\Projects\\nonoiam",
      },
      {
        text: "Sol tarafta dosya ağacını gör",
        detail: "Sol panelde app/, components/, lib/, assets/ klasörlerini görmelisin. Bu projenin iskelet yapısı.",
      },
    ],
  },
  {
    id: "vscode-terminal",
    phase: "VS Code",
    title: "VS Code Terminali Aç",
    substeps: [
      {
        text: "Terminal aç",
        detail: "Klavyede Ctrl + ` (backtick - Tab tuşunun üstündeki tuş) bas.\nVeya üst menüden: Terminal → New Terminal",
        shortcut: "Ctrl + `",
      },
      {
        text: "Doğru klasörde olduğunu kontrol et",
        detail: "Terminal'de şunu görmelisin:\nC:\\Users\\Mehmet Can\\Projects\\nonoiam>\n\nGörmüyorsan şunu yaz:",
        command: "cd C:\\Users\\Mehmet Can\\Projects\\nonoiam",
      },
    ],
  },
  {
    id: "fix-deps",
    phase: "VS Code Terminal",
    title: "Eksik Paketleri Kur",
    substeps: [
      {
        text: "npm ayarını değiştir (bir kerelik)",
        detail: "Bu komut npm'e 'versiyon çakışmalarını görmezden gel' der. Bir kere çalıştırman yeter, kalıcı.",
        command: "npm config set legacy-peer-deps true",
      },
      {
        text: "Expo Router kur",
        detail: "Sayfa geçişleri için gerekli. Biraz bekle, 'added X packages' yazısını gör.",
        command: "npx expo install expo-router expo-font expo-splash-screen",
      },
      {
        text: "Animasyon paketleri kur",
        detail: "nonoiam'ın yavaş, nefes alan animasyonları için gerekli.",
        command: "npx expo install react-native-reanimated react-native-gesture-handler",
      },
      {
        text: "Ekran ve güvenlik paketleri kur",
        detail: "Ekran boyutu uyumu ve güvenli alan (notch/çentik) desteği.",
        command: "npx expo install react-native-safe-area-context react-native-screens",
      },
      {
        text: "Depolama ve dil paketleri kur",
        detail: "AsyncStorage: kullanıcı verilerini cihazda saklar. Localization: telefon dilini algılar.",
        command: "npx expo install @react-native-async-storage/async-storage expo-localization",
      },
      {
        text: "Kontrol et - hata var mı?",
        detail: "Her komuttan sonra kırmızı 'npm error' yazısı olmamalı. Sarı 'npm warn' olabilir — onlar sorun değil.\n\nHata varsa çıktıyı kopyala, Claude'a gönder.",
        command: null,
      },
    ],
  },
  {
    id: "test-expo",
    phase: "VS Code Terminal",
    title: "Projeyi İlk Kez Çalıştır",
    substeps: [
      {
        text: "Expo'yu başlat",
        detail: "Bu komut projeyi başlatır. Terminal'de QR kod ve seçenekler çıkacak.",
        command: "npx expo start",
      },
      {
        text: "Telefonda test et (en kolay yol)",
        detail: "1. Telefonuna Play Store'dan 'Expo Go' uygulamasını indir\n2. Telefon ve bilgisayar AYNI WiFi ağında olmalı\n3. Expo Go'yu aç, QR kodu tara\n4. Boş beyaz ekran görürsen — HER ŞEY ÇALIŞIYOR!",
      },
      {
        text: "VEYA Android Emulator'da test et",
        detail: "Terminal'de 'a' tuşuna bas — Android emulator'ü açar.\n(Android Studio emulator'ü önceden ayarlanmış olmalı — sonraki adımda anlatıyorum)",
        shortcut: "a tuşuna bas",
      },
      {
        text: "Durdurmak için",
        detail: "Terminal'de Ctrl + C bas. Proje durur.",
        shortcut: "Ctrl + C",
      },
    ],
  },
  {
    id: "android-studio-sdk",
    phase: "Android Studio",
    title: "Android Studio SDK Ayarları",
    substeps: [
      {
        text: "Android Studio'yu aç",
        detail: "Masaüstünde veya Start Menu'de 'Android Studio' yaz, aç. İlk açılışta 'Welcome' ekranı gelir.",
      },
      {
        text: "More Actions → SDK Manager aç",
        detail: "Welcome ekranında ortadaki 'More Actions' dropdown'una tıkla, sonra 'SDK Manager' seç.\n\nVeya üst menü: File → Settings → Appearance & Behavior → System Settings → Android SDK",
      },
      {
        text: "SDK Platforms sekmesinde Android 14 seç",
        detail: "SDK Platforms sekmesine tıkla.\n'Android 14.0 (\"UpsideDownCake\")' satırındaki checkbox'ı işaretle.\nAPI Level: 34 olmalı.\n\nZaten işaretliyse bir şey yapmana gerek yok.",
      },
      {
        text: "SDK Tools sekmesini kontrol et",
        detail: "SDK Tools sekmesine geç. Şunların işaretli olduğundan emin ol:\n\n• Android SDK Build-Tools\n• Android SDK Platform-Tools\n• Android Emulator\n• Android SDK Command-line Tools\n\nEksik varsa işaretle.",
      },
      {
        text: "Apply → OK tıkla",
        detail: "Sağ alttaki 'Apply' butonuna tıkla. İndirme başlarsa bekle (birkaç dakika sürebilir). Bitince 'OK' tıkla.",
      },
    ],
  },
  {
    id: "android-studio-emulator",
    phase: "Android Studio",
    title: "Android Emulator Oluştur",
    substeps: [
      {
        text: "More Actions → Virtual Device Manager aç",
        detail: "Welcome ekranında 'More Actions' → 'Virtual Device Manager' tıkla.\n\nVeya üst menü: Tools → Device Manager",
      },
      {
        text: "Create Device tıkla",
        detail: "Sol üstteki '+' veya 'Create Device' butonuna tıkla.",
      },
      {
        text: "Telefon modeli seç",
        detail: "Category: Phone olmalı.\nÖnerilen: 'Pixel 7' veya 'Pixel 8' seç.\nNext tıkla.",
      },
      {
        text: "Sistem imajı seç",
        detail: "Release Name: 'UpsideDownCake' (API 34) seç.\nYanında 'Download' yazıyorsa tıkla, indir (1-2 GB, biraz bekle).\nİndirildikten sonra seç ve Next tıkla.",
      },
      {
        text: "Finish tıkla",
        detail: "İsim olarak 'Pixel 7 API 34' gibi bir şey yazar. Değiştirmene gerek yok.\nFinish tıkla.",
      },
      {
        text: "Emulator'ü başlat",
        detail: "Device Manager'da yeni cihazının yanındaki ▶ (oynat) butonuna tıkla.\nAndroid telefon ekranı açılacak. İlk açılış 1-2 dakika sürer.",
      },
    ],
  },
  {
    id: "test-on-emulator",
    phase: "VS Code + Emulator",
    title: "Emulator'de Uygulamayı Çalıştır",
    substeps: [
      {
        text: "Emulator'ün açık olduğundan emin ol",
        detail: "Android Studio'da emulator çalışıyor olmalı (Android ana ekranını görmeli).",
      },
      {
        text: "VS Code terminaline dön",
        detail: "VS Code'a geç (Alt+Tab). Terminal'de proje klasöründe ol.",
      },
      {
        text: "Expo'yu başlat",
        detail: "Eğer zaten çalışıyorsa bu adımı atla. Çalışmıyorsa:",
        command: "npx expo start",
      },
      {
        text: "'a' tuşuna bas",
        detail: "Terminal'de 'a' bas. Expo, açık olan emulator'ü bulur ve uygulamayı yükler.\nİlk seferde 'Expo Go' uygulamasını emulator'e otomatik kurar.\n\nBeyaz ekran veya 'Open up App.js to start working on your app!' yazısını görürsen — BAŞARILI!",
        shortcut: "a",
      },
    ],
  },
  {
    id: "supabase-setup",
    phase: "Tarayıcı (Chrome)",
    title: "Supabase Projesi Oluştur",
    substeps: [
      {
        text: "supabase.com'a git",
        detail: "Tarayıcıda supabase.com adresine git. 'Start your project' veya 'Sign Up' tıkla.",
        link: "https://supabase.com",
      },
      {
        text: "GitHub ile kayıt ol (en kolay)",
        detail: "GitHub hesabın varsa 'Continue with GitHub' tıkla.\nYoksa email ile kayıt ol.",
      },
      {
        text: "New Project tıkla",
        detail: "Dashboard'a girince 'New Project' butonuna tıkla.",
      },
      {
        text: "Proje bilgilerini gir",
        detail: "Name: nonoiam\nDatabase Password: güçlü bir şifre gir (not al!)\nRegion: Central EU (Frankfurt) — Türkiye'ye en yakını\nPlan: Free\n\n'Create New Project' tıkla. 1-2 dakika bekle.",
      },
      {
        text: "API anahtarlarını al",
        detail: "Proje oluşturulduktan sonra:\nSol menü → Settings (dişli ikon) → API\n\nŞu iki değeri kopyala:\n• Project URL (https://xxxxx.supabase.co)\n• anon public key (eyJhbG... ile başlayan uzun metin)\n\nBunları bir yere not al — birazdan kullanacağız.",
      },
    ],
  },
  {
    id: "supabase-tables",
    phase: "Supabase Dashboard",
    title: "Veritabanı Tablolarını Oluştur",
    substeps: [
      {
        text: "SQL Editor'ı aç",
        detail: "Supabase Dashboard'da sol menüden 'SQL Editor' tıkla (veritabanı ikonu).",
      },
      {
        text: "Yeni sorgu oluştur",
        detail: "'New Query' veya '+' butonuna tıkla. Boş bir editör açılacak.",
      },
      {
        text: "Aşağıdaki SQL'i yapıştır ve çalıştır",
        detail: "Editöre yapıştır, sonra sağ alttaki 'Run' (yeşil buton) veya Ctrl+Enter bas.",
        command: `-- NONOIAM VERITABANI
-- Bu SQL'i Supabase SQL Editor'a yapistir ve Run tikla

-- 1. Kullanicilar tablosu
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  color TEXT NOT NULL,
  tone TEXT NOT NULL CHECK (tone IN ('flat','broken','soft')),
  symbol TEXT DEFAULT '◌',
  language TEXT DEFAULT 'tr',
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Paylasimlar tablosu
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL CHECK (char_length(text) <= 500),
  emotion TEXT NOT NULL,
  is_locked BOOLEAN DEFAULT false,
  silence_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Sessiz tepkiler tablosu
CREATE TABLE reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('here','understand','metoo','pass')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- 4. Kilitli paylasimlar (premium)
CREATE TABLE locked_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  emotion TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Gunluk post limiti (max 2)
CREATE OR REPLACE FUNCTION check_daily_post_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*) FROM posts
    WHERE user_id = NEW.user_id
    AND created_at::date = CURRENT_DATE
  ) >= 2 THEN
    RAISE EXCEPTION 'Gunluk limit doldu (max 2)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_daily_limit
  BEFORE INSERT ON posts
  FOR EACH ROW EXECUTE FUNCTION check_daily_post_limit();`,
      },
      {
        text: "'Success' mesajını gör",
        detail: "Alt kısımda yeşil 'Success. No rows returned' yazmalı.\nKırmızı hata varsa, SQL'i tekrar kontrol et ve Claude'a gönder.",
      },
    ],
  },
  {
    id: "supabase-rls",
    phase: "Supabase Dashboard",
    title: "Güvenlik Kurallarını (RLS) Aktifle",
    substeps: [
      {
        text: "Yeni SQL sorgusu aç",
        detail: "SQL Editor'da tekrar 'New Query' veya '+' tıkla.",
      },
      {
        text: "Bu SQL'i yapıştır ve çalıştır",
        detail: "Bu kurallar her kullanıcının sadece kendi verisini görmesini sağlar. ZORUNLU!",
        command: `-- GUVENLIK KURALLARI (RLS)
-- Bu SQL'i Supabase SQL Editor'a yapistir ve Run tikla

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE locked_posts ENABLE ROW LEVEL SECURITY;

-- Kullanici kendi profilini okuyabilir/duzenleyebilir
CREATE POLICY "users_self" ON users
  FOR ALL USING (auth.uid() = id);

-- Herkes paylasimlari okuyabilir (kilitli olmayanlar)
CREATE POLICY "posts_read" ON posts
  FOR SELECT USING (is_locked = false);

-- Kullanici kendi postlarini olusturabilir
CREATE POLICY "posts_create" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tepkiler
CREATE POLICY "reactions_create" ON reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reactions_read" ON reactions
  FOR SELECT USING (true);

-- Kilitli postlar sadece sahibi
CREATE POLICY "locked_self" ON locked_posts
  FOR ALL USING (auth.uid() = user_id);`,
      },
      {
        text: "Success mesajını gör",
        detail: "Yine yeşil 'Success' yazısı çıkmalı.",
      },
    ],
  },
  {
    id: "supabase-auth",
    phase: "Supabase Dashboard",
    title: "Anonim Giriş Aktifle",
    substeps: [
      {
        text: "Authentication sayfasına git",
        detail: "Sol menüde 'Authentication' (kişi ikonu) tıkla.",
      },
      {
        text: "Providers sekmesine git",
        detail: "Üstteki sekmelerden 'Providers' tıkla.",
      },
      {
        text: "Anonymous Sign-ins'i aç",
        detail: "Listede 'Anonymous Sign-ins' bul.\nYanındaki toggle'ı AÇ (yeşil olmalı).\n\nBu sayede kullanıcılar email/şifre girmeden anonim UUID alacak.",
      },
      {
        text: "Save tıkla",
        detail: "Değişikliği kaydet.",
      },
    ],
  },
  {
    id: "connect-supabase",
    phase: "VS Code",
    title: "Supabase'i Projeye Bağla",
    substeps: [
      {
        text: "VS Code'a dön",
        detail: "Alt+Tab ile VS Code'a geç.",
      },
      {
        text: "lib/supabase.js dosyasını aç",
        detail: "Sol panelde lib klasörüne tıkla.\nİçindeki supabase.js dosyasına tıkla (veya yoksa oluştur).\n\nDosya Explorer'da: lib klasörüne sağ tıkla → New File → supabase.js",
      },
      {
        text: "Supabase client kodunu yapıştır",
        detail: "Daha önce sana verdiğim supabase-client.js dosyasının içeriğini buraya yapıştır.\n\nÖNEMLİ: İki yeri kendi değerlerinle değiştir:",
        command: `// lib/supabase.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// BURAYA KENDİ DEĞERLERİNİ YAZ:
const SUPABASE_URL = 'https://XXXXX.supabase.co';     // Settings > API > Project URL
const SUPABASE_ANON_KEY = 'eyJhbG.....';               // Settings > API > anon public

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});`,
      },
      {
        text: "Kaydet",
        detail: "Ctrl + S ile kaydet. Dosya adının yanındaki beyaz nokta kaybolursa kaydedilmiş demektir.",
        shortcut: "Ctrl + S",
      },
    ],
  },
  {
    id: "done",
    phase: "Tamamlandı",
    title: "Altyapı Hazır!",
    substeps: [
      {
        text: "Ne yaptık?",
        detail: "• VS Code'da projeyi açtık\n• Tüm paketleri kurduk\n• Android emulator'ü ayarladık\n• Supabase veritabanını oluşturduk\n• Güvenlik kurallarını aktifledik\n• Anonim auth'u açtık\n• Supabase'i projeye bağladık",
      },
      {
        text: "Sırada ne var?",
        detail: "Şimdi ekranları kodlama zamanı!\n\nClaude'a gel ve şunu de:\n'Ekranları kodlamaya başlayalım — Landing screen'den başla'\n\nBen sana her ekranın React Native kodunu tek tek vereceğim.",
      },
    ],
  },
];

function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  if (!text) return null;
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 2000);
      }}
      style={{
        position: "absolute", top: 6, right: 6,
        background: ok ? "rgba(122,158,126,0.15)" : "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 5, padding: "3px 10px",
        color: ok ? "#7a9e7e" : "rgba(255,255,255,0.3)",
        fontSize: 10, cursor: "pointer",
        fontFamily: "monospace",
      }}
    >
      {ok ? "kopyalandi!" : "kopyala"}
    </button>
  );
}

function SubStep({ sub, num }) {
  const [done, setDone] = useState(false);
  return (
    <div
      style={{
        padding: "14px 0",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        opacity: done ? 0.4 : 1,
        transition: "opacity 0.4s ease",
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <button
          onClick={() => setDone(!done)}
          style={{
            width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
            border: done ? "2px solid #7a9e7e" : "2px solid rgba(255,255,255,0.12)",
            background: done ? "rgba(122,158,126,0.15)" : "transparent",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 11, marginTop: 1,
            color: done ? "#7a9e7e" : "rgba(255,255,255,0.2)",
            transition: "all 0.3s ease",
          }}
        >
          {done ? "✓" : num}
        </button>
        <div style={{ flex: 1 }}>
          <p style={{
            margin: 0, fontSize: 14, fontWeight: 500,
            color: done ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.8)",
            fontFamily: "'DM Sans', sans-serif",
            textDecoration: done ? "line-through" : "none",
          }}>
            {sub.text}
          </p>
          <p style={{
            margin: "6px 0 0", fontSize: 12.5,
            color: "rgba(255,255,255,0.35)",
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.7, whiteSpace: "pre-wrap",
          }}>
            {sub.detail}
          </p>
          {sub.shortcut && (
            <span style={{
              display: "inline-block", marginTop: 6,
              padding: "3px 10px", borderRadius: 5,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 12, color: "rgba(212,200,122,0.7)",
              fontFamily: "monospace",
            }}>
              {sub.shortcut}
            </span>
          )}
          {sub.command && (
            <div style={{ position: "relative", marginTop: 8 }}>
              <CopyBtn text={sub.command} />
              <pre style={{
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8, padding: "10px 12px",
                paddingRight: 70,
                fontSize: 11.5, lineHeight: 1.6,
                color: "rgba(255,255,255,0.55)",
                fontFamily: "'SF Mono','Fira Code','Consolas',monospace",
                overflowX: "auto", margin: 0,
                whiteSpace: "pre-wrap", wordBreak: "break-all",
              }}>
                {sub.command}
              </pre>
            </div>
          )}
          {sub.path && (
            <div style={{
              marginTop: 6, padding: "6px 10px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: 6, fontSize: 12,
              fontFamily: "monospace",
              color: "rgba(255,255,255,0.4)",
            }}>
              {sub.path}
            </div>
          )}
          {sub.link && (
            <a href={sub.link} target="_blank" rel="noopener" style={{
              display: "inline-block", marginTop: 6,
              fontSize: 12, color: "rgba(123,143,162,0.7)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(123,143,162,0.2)",
            }}>
              {sub.link}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Guide() {
  const [activeStep, setActiveStep] = useState(0);
  const step = STEPS[activeStep];

  const phases = [...new Set(STEPS.map(s => s.phase))];
  const phaseColors = {
    "VS Code": "#4dacf7",
    "VS Code Terminal": "#4dacf7",
    "Android Studio": "#a4c639",
    "Tarayıcı (Chrome)": "#f7a44d",
    "Supabase Dashboard": "#3ecf8e",
    "VS Code + Emulator": "#4dacf7",
    "Tamamlandı": "#7a9e7e",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111113",
      fontFamily: "'DM Sans', sans-serif",
      color: "rgba(255,255,255,0.7)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "20px 20px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(17,17,19,0.95)",
        backdropFilter: "blur(10px)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
        }}>
          <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
            <path d="M 20 2 A 18 18 0 1 1 14 36.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 16, fontWeight: 300, letterSpacing: "0.08em", color: "rgba(255,255,255,0.6)" }}>
            nonoiam
          </span>
          <span style={{
            marginLeft: "auto", fontSize: 9, letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.15)", textTransform: "uppercase",
          }}>
            Adim Adim Rehber
          </span>
        </div>

        {/* Progress */}
        <div style={{
          display: "flex", gap: 2, marginBottom: 12,
        }}>
          {STEPS.map((s, i) => (
            <div
              key={i}
              style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= activeStep ? (phaseColors[s.phase] || "#666") + "66" : "rgba(255,255,255,0.04)",
                transition: "background 0.3s ease",
                cursor: "pointer",
              }}
              onClick={() => setActiveStep(i)}
            />
          ))}
        </div>

        {/* Step selector */}
        <div style={{
          display: "flex", gap: 4, overflowX: "auto",
          paddingBottom: 4,
          WebkitOverflowScrolling: "touch",
        }}>
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              style={{
                padding: "6px 12px", borderRadius: 12, flexShrink: 0,
                background: i === activeStep ? "rgba(255,255,255,0.06)" : "transparent",
                border: "1px solid",
                borderColor: i === activeStep ? "rgba(255,255,255,0.1)" : "transparent",
                cursor: "pointer", fontSize: 11,
                color: i === activeStep ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 80px", maxWidth: 640, margin: "0 auto" }}>
        {/* Phase badge */}
        <div style={{
          display: "inline-block",
          padding: "4px 12px", borderRadius: 10,
          background: (phaseColors[step.phase] || "#666") + "15",
          border: `1px solid ${(phaseColors[step.phase] || "#666")}25`,
          marginBottom: 12,
        }}>
          <span style={{
            fontSize: 11, fontWeight: 500, letterSpacing: "0.06em",
            color: phaseColors[step.phase] || "#666",
          }}>
            {step.phase}
          </span>
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 20, fontWeight: 400, letterSpacing: "0.02em",
          color: "rgba(255,255,255,0.8)", marginBottom: 4,
        }}>
          {step.title}
        </h2>
        <p style={{
          fontSize: 12, color: "rgba(255,255,255,0.2)", marginBottom: 20,
        }}>
          Adim {activeStep + 1} / {STEPS.length} — {step.substeps.length} alt adim
        </p>

        {/* Substeps */}
        {step.substeps.map((sub, i) => (
          <SubStep key={`${activeStep}-${i}`} sub={sub} num={i + 1} />
        ))}

        {/* Navigation */}
        <div style={{
          display: "flex", gap: 10, marginTop: 28,
          justifyContent: "space-between",
        }}>
          <button
            onClick={() => activeStep > 0 && setActiveStep(activeStep - 1)}
            style={{
              padding: "10px 20px", borderRadius: 14,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: activeStep > 0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)",
              fontSize: 13, cursor: activeStep > 0 ? "pointer" : "default",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Onceki
          </button>
          <button
            onClick={() => activeStep < STEPS.length - 1 && setActiveStep(activeStep + 1)}
            style={{
              padding: "10px 24px", borderRadius: 14,
              background: activeStep < STEPS.length - 1 ? "rgba(255,255,255,0.06)" : "rgba(122,158,126,0.15)",
              border: "1px solid",
              borderColor: activeStep < STEPS.length - 1 ? "rgba(255,255,255,0.1)" : "rgba(122,158,126,0.3)",
              color: activeStep < STEPS.length - 1 ? "rgba(255,255,255,0.6)" : "#7a9e7e",
              fontSize: 13, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
            }}
          >
            {activeStep < STEPS.length - 1 ? "Sonraki" : "Tamamlandi!"}
          </button>
        </div>
      </div>
    </div>
  );
}
