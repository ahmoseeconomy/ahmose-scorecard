import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert, TrendingUp, Clock, ArrowRight, ChevronDown, Zap,
  Eye, Target, AlertCircle, CheckCircle2, Lock,
  Mail, User, BookOpen, Shield, AlertTriangle,
  Activity, Flame, Award, BarChart3
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

// ============================================================
// الثوابت والألوان
// ============================================================
const COLORS = {
  bg: '#05070a',
  bgAlt: '#080a0f',
  bgDark: '#030508',
  bgCard: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.05)',
  borderLight: 'rgba(255,255,255,0.1)',
  amber: '#f59e0b',
  amberLight: '#fbbf24',
  amberGlow: 'rgba(245,158,11,0.2)',
  amberBg: 'rgba(245,158,11,0.05)',
  amberBorder: 'rgba(245,158,11,0.2)',
  amberBorderStrong: 'rgba(245,158,11,0.4)',
  amberText: 'rgba(245,158,11,0.6)',
  text: '#ffffff',
  textMuted: '#a1a1aa',
  textDim: '#71717a',
  textDimmer: '#52525b',
  red: '#ef4444',
  redBg: 'rgba(239,68,68,0.1)',
  redBorder: 'rgba(239,68,68,0.1)',
  green: '#22c55e',
  blue: '#60a5fa',
};

// ============================================================
// نظام الأسئلة والتقييم
// ============================================================
const QUESTIONS = [
  {
    id: 1, category: 'technical',
    question: 'لو دخلك وقف النهاردة… كام شهر تقدر تعيش من مدخراتك؟',
    icon: '🏦',
    options: [
      { text: 'أقل من شهر', score: 0 },
      { text: 'من 1 لـ 3 شهور', score: 1 },
      { text: 'من 3 لـ 6 شهور', score: 2 },
      { text: 'أكتر من 6 شهور', score: 3 },
    ]
  },
  {
    id: 2, category: 'technical',
    question: 'كام مصدر دخل عندك حالياً؟',
    icon: '💰',
    options: [
      { text: 'مصدر واحد بس (وظيفة أو مشروع)', score: 0 },
      { text: 'مصدرين', score: 1 },
      { text: '3 مصادر أو أكتر', score: 3 },
    ]
  },
  {
    id: 3, category: 'technical',
    question: 'لو الأسعار زادت 50% فجأة… هتقدر تحافظ على مستوى معيشتك؟',
    icon: '📈',
    options: [
      { text: 'لا خالص، هتبقى كارثة', score: 0 },
      { text: 'هتبقى صعبة جداً بس هعدّيها', score: 1 },
      { text: 'أه، عندي خطة وبدائل', score: 3 },
    ]
  },
  {
    id: 4, category: 'technical',
    question: 'نسبة إيه من دخلك بتوفرها أو بتستثمرها شهرياً؟',
    icon: '🐷',
    options: [
      { text: 'مش بوفر خالص', score: 0 },
      { text: 'أقل من 10%', score: 1 },
      { text: 'من 10% لـ 20%', score: 2 },
      { text: 'أكتر من 20%', score: 3 },
    ]
  },
  {
    id: 5, category: 'technical',
    question: 'إيه وضع الديون والأقساط عندك؟',
    icon: '⚖️',
    options: [
      { text: 'عليّا ديون بتاخد نسبة كبيرة من دخلي', score: 0 },
      { text: 'عندي أقساط بسيطة ومتحكم فيها', score: 1 },
      { text: 'مفيش ديون خالص', score: 3 },
    ]
  },
  {
    id: 6, category: 'technical',
    question: 'هل عندك أصول حقيقية (ذهب، عقار، استثمارات)؟',
    icon: '🏠',
    options: [
      { text: 'لا، مفيش حاجة غير الراتب', score: 0 },
      { text: 'حاجة بسيطة (شوية ذهب أو وديعة)', score: 1 },
      { text: 'عندي محفظة متنوعة (عقار + ذهب + استثمار)', score: 3 },
    ]
  },
  {
    id: 7, category: 'technical',
    question: 'لو احتجت مبلغ كبير فجأة (طوارئ طبية أو عطل كبير)… هتعمل إيه؟',
    icon: '🚨',
    options: [
      { text: 'هستلف من حد أو هاخد قرض', score: 0 },
      { text: 'هبيع حاجة عندي', score: 1 },
      { text: 'عندي صندوق طوارئ جاهز لكده', score: 3 },
    ]
  },
  {
    id: 8, category: 'technical',
    question: 'هل عندك تأمين (صحي أو على الحياة)؟',
    icon: '🛡️',
    options: [
      { text: 'لا، مفيش أي تأمين', score: 0 },
      { text: 'تأمين صحي بس (من الشغل أو خاص)', score: 1 },
      { text: 'تأمين صحي + تأمين على الحياة', score: 3 },
    ]
  },
  {
    id: 9, category: 'technical',
    question: 'هل بتراجع مصاريفك وميزانيتك بانتظام؟',
    icon: '📊',
    options: [
      { text: 'لا، مش بتابع خالص', score: 0 },
      { text: 'أحياناً لما أحس إن الفلوس بتخلص بسرعة', score: 1 },
      { text: 'أه، كل شهر بعمل مراجعة', score: 3 },
    ]
  },
  {
    id: 10, category: 'technical',
    question: 'هل عندك خطة مالية واضحة للسنة الجاية؟',
    icon: '🗺️',
    options: [
      { text: 'لا، بمشي يوم بيوم', score: 0 },
      { text: 'في دماغي بس مش مكتوبة', score: 1 },
      { text: 'أه، مكتوبة ومحددة بأرقام', score: 3 },
    ]
  },
  {
    id: 11, category: 'qualifying',
    question: 'إيه أكتر حاجة بتقلقك مالياً دلوقتي؟',
    icon: '😰',
    options: [
      { text: 'التضخم وارتفاع الأسعار', score: 0 },
      { text: 'إني أفقد مصدر دخلي', score: 0 },
      { text: 'إن مدخراتي مش كفاية', score: 1 },
      { text: 'مش قلقان أوي بصراحة', score: 2 },
    ]
  },
  {
    id: 12, category: 'qualifying',
    question: 'إيه مستوى معرفتك بالادخار والاستثمار؟',
    icon: '📚',
    options: [
      { text: 'مبتدئ — مش فاهم حاجة تقريباً', score: 0 },
      { text: 'متوسط — بعرف الأساسيات', score: 1 },
      { text: 'متقدم — بستثمر فعلاً وبتابع', score: 2 },
    ]
  },
  {
    id: 13, category: 'qualifying',
    question: 'هل سبق واتعرضت لأزمة مالية حقيقية؟',
    icon: '⚡',
    options: [
      { text: 'أه، ومعرفتش أتعامل معاها', score: 0 },
      { text: 'أه، بس عديتها وتعلمت منها', score: 2 },
      { text: 'لا، لسه ما اتعرضتش', score: 1 },
    ]
  },
  {
    id: 14, category: 'qualifying',
    question: 'إيه أكتر حاجة عايز تحسنها في وضعك المالي؟',
    icon: '🎯',
    options: [
      { text: 'زيادة الدخل', score: 1 },
      { text: 'تقليل المصاريف والسيطرة عليها', score: 1 },
      { text: 'بناء مدخرات واستثمارات', score: 2 },
      { text: 'كل حاجة محتاجة تتحسن بصراحة', score: 0 },
    ]
  },
  {
    id: 15, category: 'qualifying',
    question: 'إيه الفئة العمرية بتاعتك؟',
    icon: '🎂',
    options: [
      { text: '18 - 25 سنة', score: 1 },
      { text: '26 - 35 سنة', score: 2 },
      { text: '36 - 45 سنة', score: 1 },
      { text: '46 سنة فأكتر', score: 1 },
    ]
  }
];

const MAX_SCORE = 40;

// ============================================================
// نظام النتائج
// ============================================================
const getResultLevel = (score) => {
  const percentage = (score / MAX_SCORE) * 100;
  if (percentage <= 35) {
    return {
      level: 'danger', label: 'في خطر', labelEn: 'AT RISK',
      color: '#ef4444', colorLight: 'rgba(239,68,68,0.15)', emoji: '🔴', icon: AlertTriangle,
      title: 'وضعك المالي في منطقة الخطر',
      message: 'نتيجتك بتقول إنك مكشوف مالياً بشكل كبير. لو حصلت أي أزمة — سواء فقدان دخل أو تضخم مفاجئ أو طوارئ صحية — مفيش شبكة أمان تحميك. الموضوع مش تخويف… ده واقع لازم يتغير، والخطوة الأولى إنك عرفت.',
      tips: [
        'ابدأ فوراً بتخصيص أي مبلغ — حتى لو بسيط — كصندوق طوارئ',
        'راجع مصاريفك الشهرية وحدد أكبر 3 بنود ممكن تقللها',
        'فكّر في مصدر دخل إضافي حتى لو مؤقت',
        'اقرأ عن أساسيات الحماية المالية في أوقات الأزمات'
      ],
      bookCTA: 'الكتاب ده اتكتب علشانك بالظبط. هيوريك إزاي تحمي نفسك مالياً حتى لو بادي من الصفر.',
      // توصيات المنتجات الرقمية (تظهر لصاحب المشروع فقط في Google Sheet)
      productRecommendations: [
        { product: 'كتاب "المال في أوقات الحروب"', priority: 'عاجل', reason: 'محتاج أساسيات الحماية المالية فوراً' },
        { product: 'Template ميزانية الطوارئ (مجاني)', priority: 'عاجل', reason: 'مفيش عنده نظام تتبع مصاريف' },
        { product: 'كورس أساسيات محو الأمية المالية', priority: 'متوسط', reason: 'محتاج يبني قاعدة معرفية من الصفر' },
      ],
    };
  } else if (percentage <= 65) {
    return {
      level: 'average', label: 'متوسط', labelEn: 'MODERATE',
      color: '#f59e0b', colorLight: 'rgba(245,158,11,0.15)', emoji: '🟡', icon: Activity,
      title: 'عندك أساس… بس مش كفاية',
      message: 'إنت مش في أسوأ وضع، بس لو حصلت أزمة حقيقية هتلاقي ثغرات كتير. عندك بعض عناصر الأمان لكنها مش كفاية تحميك لو الموضوع طال. الخبر الكويس؟ إنت في مرحلة ممكن تتحسن فيها بسرعة لو اتخذت الخطوات الصح.',
      tips: [
        'ارفع نسبة الادخار تدريجياً — حتى لو 5% زيادة كل شهر',
        'ابدأ في تنويع مصادر دخلك لو معتمد على مصدر واحد',
        'فكّر في استثمار بسيط (ذهب مثلاً) كحماية من التضخم',
        'اعمل خطة مالية مكتوبة للـ 6 شهور الجايين'
      ],
      bookCTA: 'الكتاب ده هيساعدك تسد الثغرات في خطتك المالية وتتحول من "ماشي الحال" لـ "مستعد فعلاً".',
      productRecommendations: [
        { product: 'كتاب "المال في أوقات الحروب"', priority: 'عالي', reason: 'محتاج يسد ثغرات الحماية المالية' },
        { product: 'كورس الاستثمار والتنويع المالي', priority: 'عالي', reason: 'عنده أساس ومحتاج يبني عليه' },
        { product: 'ورشة عملية: بناء خطة مالية شخصية', priority: 'متوسط', reason: 'جاهز يطبق بس محتاج توجيه عملي' },
      ],
    };
  } else {
    return {
      level: 'safe', label: 'آمن', labelEn: 'SECURE',
      color: '#22c55e', colorLight: 'rgba(34,197,94,0.15)', emoji: '🟢', icon: Shield,
      title: 'وضعك المالي قوي — بس خليك يقظ',
      message: 'مبروك! إنت من القلة اللي فعلاً مستعدة مالياً. عندك أصول، خطة، ومدخرات. بس الأزمات الكبيرة بتضرب حتى المستعدين. السؤال مش "هل إنت آمن" — السؤال "هل أمانك ده هيستحمل أزمة طويلة؟"',
      tips: [
        'راجع توزيع أصولك — هل هي متنوعة كفاية؟',
        'اختبر خطتك: لو دخلك وقف 12 شهر، هل هتفضل مرتاح؟',
        'فكّر في حماية ثروتك من التضخم بأدوات استثمارية ذكية',
        'شارك معرفتك مع اللي حواليك — ده جزء من الأمان الجماعي'
      ],
      bookCTA: 'الكتاب ده فيه استراتيجيات متقدمة لحماية الثروة في أوقات الحروب والأزمات — حتى لو إنت في وضع كويس.',
      productRecommendations: [
        { product: 'استشارة شخصية (1-on-1) لحماية الثروة', priority: 'عالي', reason: 'عنده أصول ومحتاج استراتيجية حماية متقدمة' },
        { product: 'كورس متقدم: حماية الثروة في الأزمات', priority: 'متوسط', reason: 'مستواه عالي ومحتاج معرفة متخصصة' },
        { product: 'عضوية مجتمع المستثمرين (Community)', priority: 'متوسط', reason: 'مناسب لمستواه ويقدر يستفيد من النقاشات' },
        { product: 'كتاب "المال في أوقات الحروب"', priority: 'اختياري', reason: 'تكميلي — لو مقرأهوش' },
      ],
    };
  }
};

// ============================================================
// Google Sheets Integration
// ============================================================
// 🔧 ضع رابط Google Apps Script Web App هنا بعد إعداده
const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

const sendToGoogleSheets = async (data) => {
  if (GOOGLE_SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    console.log('📋 [DEV MODE] بيانات المستخدم (Google Sheet مش متربط لسه):', data);
    return true;
  }
  try {
    await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return true;
  } catch (error) {
    console.error('خطأ في إرسال البيانات:', error);
    return false;
  }
};

const buildLeadData = (name, email, score, answers) => {
  const result = getResultLevel(score);
  const percentage = Math.round((score / MAX_SCORE) * 100);
  const technicalScore = answers.filter(a => a.category === 'technical').reduce((s, a) => s + a.score, 0);
  const qualifyingScore = answers.filter(a => a.category === 'qualifying').reduce((s, a) => s + a.score, 0);

  // استخراج الإجابات التأهيلية المهمة
  const concerns = answers.find(a => a.questionId === 11)?.answerText || '';
  const knowledgeLevel = answers.find(a => a.questionId === 12)?.answerText || '';
  const crisisExperience = answers.find(a => a.questionId === 13)?.answerText || '';
  const improvementGoal = answers.find(a => a.questionId === 14)?.answerText || '';
  const ageGroup = answers.find(a => a.questionId === 15)?.answerText || '';

  return {
    timestamp: new Date().toISOString(),
    name,
    email,
    score: percentage + '%',
    totalPoints: score + '/' + MAX_SCORE,
    classification: result.label + ' (' + result.labelEn + ')',
    technicalScore: technicalScore + '/30 (' + Math.round((technicalScore/30)*100) + '%)',
    qualifyingScore: qualifyingScore + '/10 (' + Math.round((qualifyingScore/10)*100) + '%)',
    // بيانات تأهيلية
    mainConcern: concerns,
    knowledgeLevel: knowledgeLevel,
    crisisExperience: crisisExperience,
    improvementGoal: improvementGoal,
    ageGroup: ageGroup,
    // توصيات المنتجات (لصاحب المشروع)
    recommendedProducts: result.productRecommendations.map(p => p.product + ' [' + p.priority + ']').join(' | '),
    productReason: result.productRecommendations[0]?.reason || '',
  };
};

// ============================================================
// المكونات
// ============================================================

// --- Landing Page ---
const LandingPage = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        padding: '16px 24px',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${COLORS.border}`,
        background: 'rgba(5,7,10,0.7)'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(245,158,11,0.1)', border: `1px solid ${COLORS.amberBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
            }}>
              <img src="logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/100?text=A"; }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 20, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em', color: '#fff' }}>اقتصاد أحمس</span>
              <span style={{ fontSize: 10, color: COLORS.amber, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Ahmose Economy</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: '#d4d4d4' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.amber, display: 'inline-block' }}></span>
            اللي مستعد… بيكمل
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '128px 24px 80px', position: 'relative'
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 70%)'
        }} />
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, marginBottom: 32,
          lineHeight: 1.2, letterSpacing: '-0.02em',
          background: 'linear-gradient(to bottom, #fff 30%, #a1a1aa 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', padding: '10px 0'
        }}>
          لو دخلك وقف بكرة...<br />
          <span style={{ WebkitTextFillColor: COLORS.amber }}>هتعيش كام يوم؟</span>
        </h1>
        <p style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: COLORS.textMuted, marginBottom: 48, maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.7 }}>
          مش سؤال افتراضي. ده اختبار هيكشف إذا كنت آمن… أو على حافة الانهيار.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <button onClick={onStart} style={{
            background: COLORS.amber, color: '#000', fontWeight: 700,
            padding: '20px 40px', borderRadius: 9999, fontSize: 20, border: 'none', cursor: 'pointer',
            boxShadow: `0 0 40px ${COLORS.amberGlow}`, transition: 'all 0.2s',
            position: 'relative'
          }}
          onMouseOver={e => { e.target.style.background = COLORS.amberLight; e.target.style.transform = 'scale(1.05)'; }}
          onMouseOut={e => { e.target.style.background = COLORS.amber; e.target.style.transform = 'scale(1)'; }}>
            ابدأ الاختبار الآن
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: COLORS.textDim }}>
            <Clock size={16} /><span>3 دقائق فقط • النتيجة فورًا</span>
          </div>
        </div>
        <div style={{ marginTop: 96, color: COLORS.amberText, fontStyle: 'italic', borderTop: `1px solid ${COLORS.border}`, paddingTop: 32, maxWidth: 450, margin: '96px auto 0' }}>
          "أغلب الناس فاكرين إنهم في الأمان… لحد ما يكتشفوا العكس."
        </div>
      </section>

      {/* قسم المواجهة */}
      <section style={{
        padding: '80px 24px', textAlign: 'center',
        background: COLORS.bgAlt,
        borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <ShieldAlert size={48} style={{ color: COLORS.amber, margin: '0 auto 24px', opacity: 0.8, display: 'block' }} />
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, marginBottom: 32, color: '#fff' }}>خلينا نبقى صريحين…</h2>
          <p style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#d4d4d4', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
            إنت مش محتاج تحفيز.<br />
            <span style={{ color: '#fff', fontWeight: 700 }}>إنت محتاج حقيقة.</span><br /><br />
            هل فلوسك تحميك…<br />
            ولا مجرد إحساس مؤقت بالأمان؟<br /><br />
            <span style={{ color: COLORS.amber, fontWeight: 700 }}>لأن أول ما الدخل يختفي… كل حاجة بتبان.</span>
          </p>
        </div>
      </section>

      {/* كسر الوهم */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: COLORS.bg }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, marginBottom: 64, color: '#fff' }}>أغلب الناس عايشة في وهم مالي</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {[{ title: "راتب ثابت", desc: "لا يعني الأمان المطلق" },
              { title: "مدخرات قليلة", desc: "ليست حماية كافية" },
              { title: "إحساس 'اهي ماشيه'", desc: "خدعة نفسية خطيرة" }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: 32, border: `1px solid ${COLORS.border}`, background: COLORS.bgCard,
                borderRadius: 16, textAlign: 'center', transition: 'border-color 0.3s'
              }}>
                <div style={{ color: COLORS.amber, marginBottom: 16, fontWeight: 700, fontSize: 20 }}>{item.title}</div>
                <p style={{ color: COLORS.textMuted, fontWeight: 300 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 64, fontSize: 20, color: COLORS.textMuted }}>الحقيقة؟ ناس كتير بتقع… وهي فاكرة نفسها ثابتة.</p>
        </div>
      </section>

      {/* النظام */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: `linear-gradient(to bottom, ${COLORS.bg}, #0a0d14)` }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, marginBottom: 32, color: '#fff' }}>علشان كده النظام ده اتبنى</h2>
          <p style={{ color: COLORS.textMuted, marginBottom: 64, fontSize: 18 }}>مش علشان يطمنك… لكن علشان يوضح الحقيقة.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, textAlign: 'right' }}>
            {[{ icon: <Target style={{ color: COLORS.amber }} />, text: "قدرتك على الصمود" },
              { icon: <Zap style={{ color: COLORS.amber }} />, text: "اعتمادك على مصدر دخل واحد" },
              { icon: <Eye style={{ color: COLORS.amber }} />, text: "نقاط الضعف الخفية" },
              { icon: <TrendingUp style={{ color: COLORS.amber }} />, text: "مدى استعدادك الحقيقي" }
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: 24,
                background: COLORS.bgCard, borderRadius: 12, border: `1px solid ${COLORS.border}`
              }}>
                <div style={{ background: COLORS.bgCard, padding: 12, borderRadius: 8 }}>{item.icon}</div>
                <span style={{ fontSize: 18, fontWeight: 500, color: '#fff' }}>{item.text}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 80, padding: 40, border: `2px solid ${COLORS.amberBorder}`,
            borderRadius: 24, background: COLORS.amberBg, textAlign: 'center'
          }}>
            <p style={{ color: COLORS.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 14 }}>وفي النهاية… بيديك رقم واحد:</p>
            <h3 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: COLORS.amber, letterSpacing: '-0.02em' }}>'درجة جاهزيتك المالية'</h3>
          </div>
        </div>
      </section>

      {/* تحفيز الفضول */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: COLORS.bg }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, marginBottom: 48, color: '#fff' }}>تقدر تتحمل تعرف نتيجتك؟</h2>
          <div style={{ color: '#d4d4d4', fontSize: 20, lineHeight: 1.8 }}>
            <p style={{ marginBottom: 24 }}>ناس كتير دخلت وهي مطمنة… وخرجت وهي مصدومة.</p>
            <p style={{ marginBottom: 24 }}>وناس تانية… اكتشفت مشاكل أكبر بكتير من اللي كانت شايفاها.</p>
            <p style={{ color: '#fff', fontWeight: 700, paddingTop: 32, borderTop: `1px solid ${COLORS.borderLight}`, marginBottom: 24 }}>السؤال مش سهل… لكن لازم يتسأل:</p>
            <p style={{ fontSize: 28, color: COLORS.amber, fontWeight: 700 }}>إنت فين بالظبط؟</p>
          </div>
        </div>
      </section>

      {/* 3 خطوات */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: COLORS.bgAlt }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, marginBottom: 80, color: '#fff' }}>3 خطوات بسيطة… و الحقيقة هتظهر</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, position: 'relative' }}>
            {[{ num: "01", text: "جاوب على أسئلة عن واقعك الحقيقي" },
              { num: "02", text: "شوف نتيجتك فورًا (بدون تجميل)" },
              { num: "03", text: "اعرف إيه لازم يتصلح فورًا" }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', background: COLORS.amber, color: '#000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 24, marginBottom: 24,
                  boxShadow: `0 0 20px ${COLORS.amberGlow}`
                }}>{item.num}</div>
                <p style={{ fontSize: 18, fontWeight: 500, color: '#d4d4d4' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الحقيقة القاسية */}
      <section style={{
        padding: '80px 24px', textAlign: 'center',
        background: COLORS.redBg,
        borderTop: `1px solid ${COLORS.redBorder}`, borderBottom: `1px solid ${COLORS.redBorder}`
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <AlertCircle size={64} style={{ color: COLORS.red, margin: '0 auto 32px', opacity: 0.8, display: 'block' }} />
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, marginBottom: 32, color: '#fecaca' }}>الأزمات مش بتستأذن</h2>
          <p style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: COLORS.textMuted, lineHeight: 1.8 }}>
            مفيش إنذار قبل ما الدخل يوقف<br />
            مفيش تحذير قبل ما الأسعار تضرب<br /><br />
            <span style={{ color: '#fff', fontWeight: 700 }}>اللي مستعد… بيكمل</span><br />
            واللي مش مستعد… بيتفاجئ<br /><br />
            <span style={{ color: '#f87171', fontSize: 28, fontWeight: 900 }}>إنت انهي واحد؟</span>
          </p>
        </div>
      </section>

      {/* الاختيار */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: COLORS.amberBg }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, marginBottom: 48, color: '#fff' }}>قدامك اختيار بسيط</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
            <div style={{
              padding: 32, border: `1px solid ${COLORS.border}`, borderRadius: 16,
              background: 'rgba(5,7,10,0.5)', opacity: 0.6, filter: 'grayscale(1)', textAlign: 'center'
            }}>
              <h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#fff' }}>تفضل مستني…</h4>
              <p style={{ fontSize: 14, color: COLORS.textMuted }}>لحد ما الظروف تجبرك تعرف الحقيقة.</p>
            </div>
            <div style={{
              padding: 32, border: `2px solid ${COLORS.amberBorderStrong}`, borderRadius: 16,
              background: 'rgba(245,158,11,0.1)', transform: 'scale(1.05)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)', textAlign: 'center'
            }}>
              <CheckCircle2 size={32} style={{ color: COLORS.amber, margin: '0 auto 16px', display: 'block' }} />
              <h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#fff' }}>تفهم وضعك…</h4>
              <p style={{ fontSize: 14, color: COLORS.textMuted }}>وتبدأ تصلحه النهاردة قبل بكرة.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '80px 24px 160px', textAlign: 'center', position: 'relative', background: COLORS.bg }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)' }}></div>
        <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: 48, letterSpacing: '-0.02em', color: '#fff' }}>
          اعرف الحقيقة… <span style={{ color: COLORS.amber }}>دلوقتي</span>
        </h2>
        <button onClick={onStart} style={{
          background: COLORS.amber, color: '#000', fontWeight: 900,
          padding: '24px 64px', borderRadius: 9999, fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          border: 'none', cursor: 'pointer', boxShadow: `0 0 60px ${COLORS.amberGlow}`, transition: 'all 0.2s',
          display: 'inline-flex', alignItems: 'center', gap: 16
        }}
        onMouseOver={e => { e.currentTarget.style.background = COLORS.amberLight; }}
        onMouseOut={e => { e.currentTarget.style.background = COLORS.amber; }}>
          ابدأ الاختبار
          <ArrowRight size={28} />
        </button>
        <p style={{ marginTop: 32, color: COLORS.textDim, fontWeight: 500 }}>3 دقائق… ممكن تغير كل حاجة</p>
      </section>

      {/* Footer */}
      <footer style={{
        background: COLORS.bgDark, padding: '80px 24px',
        borderTop: `1px solid ${COLORS.border}`, textAlign: 'center'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(245,158,11,0.1)', border: `1px solid ${COLORS.amberBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 16
          }}>
            <img src="logo.jpg" alt="Logo Footer" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)', opacity: 0.8 }}
              onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/100?text=A"; }} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 4, letterSpacing: '-0.05em', textTransform: 'uppercase', color: '#fff' }}>Ahmose Economy</div>
          <div style={{ color: COLORS.amber, fontSize: 12, letterSpacing: '0.15em', marginBottom: 48 }}>CLARITY BEFORE CRISIS • اقتصاد أحمس</div>
          <div style={{ display: 'flex', gap: 32, fontSize: 14, color: COLORS.textDim, marginBottom: 48, textDecoration: 'underline', textUnderlineOffset: 4 }}>
            <a href="#" style={{ color: COLORS.textDim }}>Privacy Policy</a>
            <a href="#" style={{ color: COLORS.textDim }}>Terms of Service</a>
          </div>
          <div style={{ maxWidth: 600, color: COLORS.textDimmer, fontSize: 12, lineHeight: 1.7, borderTop: `1px solid ${COLORS.border}`, paddingTop: 48 }}>
            <p style={{ marginBottom: 16 }}><strong>تنويه المسؤولية:</strong> هذا النظام هو أداة تحليلية تهدف لزيادة مستوى الوعي بالجاهزية المالية الشخصية. النتائج المقدمة هي تقييمات استرشادية فقط ولا تشكل نصيحة مالية أو استثمارية احترافية.</p>
            <p>باستخدامك لهذا النظام، فإنك تقر بأن "اقتصاد أحمس" غير مسؤول عن أي قرارات مالية أو خسائر. ننصح دائماً بمراجعة مستشار مالي متخصص.</p>
          </div>
        </div>
      </footer>

      {/* Sticky CTA */}
      <div style={{
        position: 'fixed', bottom: 0, width: '100%', padding: 16, zIndex: 60,
        transition: 'all 0.5s', transform: scrolled ? 'translateY(0)' : 'translateY(100%)'
      }}>
        <div style={{
          maxWidth: 420, margin: '0 auto',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid rgba(245,158,11,0.3)`, padding: 8, borderRadius: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          <div style={{ paddingRight: 24, textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: COLORS.amber, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, lineHeight: 1, marginBottom: 4, textAlign: 'center' }}>اقتصاد أحمس</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>ابدأ الاختبار الآن</div>
          </div>
          <button onClick={onStart} style={{
            background: COLORS.amber, color: '#000', fontWeight: 700,
            padding: '12px 32px', borderRadius: 9999, fontSize: 14, border: 'none', cursor: 'pointer'
          }}>اكتشف الحقيقة</button>
        </div>
      </div>
    </>
  );
};

// --- Quiz Screen ---
const QuizScreen = ({ onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [animating, setAnimating] = useState(false);

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;
  const isTechnical = question.category === 'technical';

  const handleSelect = (optionIndex) => {
    if (animating) return;
    setSelectedOption(optionIndex);
    setAnimating(true);

    const newAnswers = [...answers, {
      questionId: question.id, category: question.category,
      selectedOption: optionIndex, score: question.options[optionIndex].score,
      answerText: question.options[optionIndex].text
    }];

    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setAnswers(newAnswers);
        setCurrentQ(currentQ + 1);
        setSelectedOption(null);
        setAnimating(false);
      } else {
        const totalScore = newAnswers.reduce((sum, a) => sum + a.score, 0);
        onComplete(totalScore, newAnswers);
      }
    }, 400);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(5,7,10,0.95)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${COLORS.border}`, padding: '16px 24px'
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: COLORS.amber, fontWeight: 700, fontSize: 14 }}>{currentQ + 1}</span>
              <span style={{ color: COLORS.textDim, fontSize: 14 }}>/ {QUESTIONS.length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                {isTechnical ? 'تقييم فني' : 'سؤال تأهيلي'}
              </span>
              <span style={{ fontSize: 18 }}>{question.icon}</span>
            </div>
          </div>
          {/* Progress Bar */}
          <div style={{ width: '100%', background: COLORS.bgCard, borderRadius: 9999, height: 8, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 9999, transition: 'width 0.5s ease-out',
              width: `${progress}%`, background: `linear-gradient(90deg, ${COLORS.amber}, #eab308)`
            }} />
          </div>
        </div>
      </div>

      {/* Question */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ maxWidth: 600, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>{question.icon}</div>
            <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', fontWeight: 700, lineHeight: 1.6, color: '#fff' }}>{question.question}</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {question.options.map((option, idx) => (
              <button key={idx} onClick={() => handleSelect(idx)}
                style={{
                  width: '100%', textAlign: 'right', padding: '20px 24px', borderRadius: 16,
                  border: `2px solid ${selectedOption === idx ? COLORS.amber : COLORS.borderLight}`,
                  background: selectedOption === idx ? 'rgba(245,158,11,0.1)' : COLORS.bgCard,
                  cursor: 'pointer', transition: 'all 0.3s',
                  transform: selectedOption === idx ? 'scale(1.02)' : 'scale(1)',
                  display: 'flex', alignItems: 'center', gap: 16
                }}
                onMouseOver={e => { if (selectedOption !== idx) { e.currentTarget.style.borderColor = COLORS.amberBorderStrong; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}}
                onMouseOut={e => { if (selectedOption !== idx) { e.currentTarget.style.borderColor = COLORS.borderLight; e.currentTarget.style.background = COLORS.bgCard; }}}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: `2px solid ${selectedOption === idx ? COLORS.amber : 'rgba(255,255,255,0.2)'}`,
                  background: selectedOption === idx ? COLORS.amber : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {selectedOption === idx && <CheckCircle2 size={18} style={{ color: '#000' }} />}
                </div>
                <span style={{ fontSize: 18, fontWeight: 500, color: selectedOption === idx ? '#fff' : '#d4d4d4', transition: 'color 0.3s' }}>
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Lead Gate ---
const LeadGate = ({ score, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const result = getResultLevel(score);
  const percentage = Math.round((score / MAX_SCORE) * 100);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('من فضلك اكتب اسمك'); return; }
    if (!email.trim() || !email.includes('@')) { setError('من فضلك اكتب إيميل صحيح'); return; }
    setLoading(true); setError('');
    setTimeout(() => onSubmit(name, email), 1500);
  };

  const inputStyle = {
    width: '100%', background: COLORS.bgCard, border: `1px solid ${COLORS.borderLight}`,
    borderRadius: 12, padding: '16px 48px 16px 16px', color: '#fff', fontSize: 16,
    outline: 'none', textAlign: 'right', boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: COLORS.bg }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 9999,
            border: `1px solid ${result.color}40`, background: result.colorLight, marginBottom: 24
          }}>
            <span style={{ fontSize: 18 }}>{result.emoji}</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: result.color }}>{result.label}</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: 16, color: '#fff' }}>نتيجتك جاهزة!</h2>
          <p style={{ color: COLORS.textMuted, fontSize: 18 }}>سجّل بياناتك علشان تشوف تحليلك الكامل والنصائح المخصصة ليك.</p>
        </div>

        {/* النتيجة المخفية */}
        <div style={{
          marginBottom: 40, padding: 24, borderRadius: 16,
          border: `1px solid ${COLORS.borderLight}`, background: COLORS.bgCard,
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ color: COLORS.textMuted, fontSize: 14 }}>درجة الجاهزية المالية</span>
            <span style={{ fontWeight: 700, fontSize: 24, color: result.color }}>{percentage}%</span>
          </div>
          <div style={{ width: '100%', background: COLORS.borderLight, borderRadius: 9999, height: 12 }}>
            <div style={{ height: '100%', borderRadius: 9999, background: result.color, width: `${percentage}%`, transition: 'width 1s' }} />
          </div>
          <div style={{
            position: 'absolute', inset: 0,
            backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
            background: 'rgba(5,7,10,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.amber }}>
              <Lock size={20} />
              <span style={{ fontWeight: 700, fontSize: 14 }}>سجّل لتشوف النتيجة الكاملة</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <User size={20} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: COLORS.textDim }} />
            <input type="text" placeholder="اسمك الأول" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ position: 'relative' }}>
            <Mail size={20} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: COLORS.textDim }} />
            <input type="email" placeholder="الإيميل بتاعك" value={email} onChange={(e) => setEmail(e.target.value)} style={{...inputStyle, direction: 'ltr', textAlign: 'right'}} />
          </div>
          {error && <p style={{ color: COLORS.red, fontSize: 14, textAlign: 'center' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{
            width: '100%', background: loading ? '#92400e' : COLORS.amber, color: '#000',
            fontWeight: 900, padding: '16px 0', borderRadius: 12, fontSize: 20,
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s'
          }}>
            {loading ? '⏳ جاري التحليل...' : 'اعرف نتيجتك الكاملة'}
          </button>
          <p style={{ textAlign: 'center', color: COLORS.textDimmer, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Lock size={12} /> بياناتك آمنة ومش هنشاركها مع أي حد
          </p>
        </form>
      </div>
    </div>
  );
};

// --- Results Page ---
const ResultsPage = ({ score, answers, userName }) => {
  const [showTips, setShowTips] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const result = getResultLevel(score);
  const percentage = Math.round((score / MAX_SCORE) * 100);
  const ResultIcon = result.icon;

  useEffect(() => {
    setTimeout(() => setShowTips(true), 1500);
    setTimeout(() => setShowCTA(true), 2500);
    window.scrollTo(0, 0);
  }, []);

  const chartData = [{ name: 'score', value: percentage, fill: result.color }];

  const technicalAnswers = answers.filter(a => a.category === 'technical');
  const technicalScore = technicalAnswers.reduce((sum, a) => sum + a.score, 0);
  const technicalPct = Math.round((technicalScore / 30) * 100);

  const qualifyingAnswers = answers.filter(a => a.category === 'qualifying');
  const qualifyingScore = qualifyingAnswers.reduce((sum, a) => sum + a.score, 0);
  const qualifyingPct = Math.round((qualifyingScore / 10) * 100);

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, paddingBottom: 128 }}>
      {/* Header */}
      <div style={{ background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}`, padding: '16px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(245,158,11,0.1)', border: `1px solid ${COLORS.amberBorder}`,
              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <img src="logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/100?text=A"; }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>اقتصاد أحمس</span>
          </div>
          <span style={{ fontSize: 10, color: COLORS.amber, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>تقرير الجاهزية المالية</span>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px 0' }}>
        {/* ترحيب */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ color: COLORS.textMuted, marginBottom: 8 }}>مرحباً {userName} 👋</p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, marginBottom: 16, color: '#fff' }}>تقرير جاهزيتك المالية</h1>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 9999,
            border: `1px solid ${result.color}50`, background: result.colorLight
          }}>
            <ResultIcon size={18} style={{ color: result.color }} />
            <span style={{ fontWeight: 700, color: result.color }}>{result.label}</span>
            <span style={{ color: COLORS.textMuted, fontSize: 12 }}>({result.labelEn})</span>
          </div>
        </div>

        {/* Score + Chart */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, marginBottom: 48 }}>
          {/* Chart */}
          <div style={{
            background: COLORS.bgCard, border: `1px solid ${COLORS.borderLight}`,
            borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ position: 'relative', width: 220, height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={12}
                  data={chartData} startAngle={90} endAngle={-270}>
                  <RadialBar background clockWise dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 56, fontWeight: 900, color: result.color }}>{percentage}%</span>
                <span style={{ color: COLORS.textDim, fontSize: 14, marginTop: 4 }}>من 100%</span>
              </div>
            </div>
            <p style={{ textAlign: 'center', color: COLORS.textMuted, marginTop: 16, fontSize: 14 }}>درجة الجاهزية المالية الإجمالية</p>
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Technical */}
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.borderLight}`, borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BarChart3 size={18} style={{ color: COLORS.amber }} />
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>الجاهزية الفنية</span>
                </div>
                <span style={{ fontWeight: 700, color: COLORS.amber }}>{technicalPct}%</span>
              </div>
              <div style={{ width: '100%', background: COLORS.borderLight, borderRadius: 9999, height: 8 }}>
                <div style={{ height: '100%', borderRadius: 9999, background: COLORS.amber, width: `${technicalPct}%`, transition: 'width 1s' }} />
              </div>
              <p style={{ color: COLORS.textDim, fontSize: 12, marginTop: 8 }}>{technicalScore} من 30 نقطة</p>
            </div>

            {/* Qualifying */}
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.borderLight}`, borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Award size={18} style={{ color: COLORS.blue }} />
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>الوعي والاستعداد</span>
                </div>
                <span style={{ fontWeight: 700, color: COLORS.blue }}>{qualifyingPct}%</span>
              </div>
              <div style={{ width: '100%', background: COLORS.borderLight, borderRadius: 9999, height: 8 }}>
                <div style={{ height: '100%', borderRadius: 9999, background: COLORS.blue, width: `${qualifyingPct}%`, transition: 'width 1s' }} />
              </div>
              <p style={{ color: COLORS.textDim, fontSize: 12, marginTop: 8 }}>{qualifyingScore} من 10 نقطة</p>
            </div>

            {/* Comparison */}
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.borderLight}`, borderRadius: 16, padding: 16, textAlign: 'center' }}>
              <p style={{ color: COLORS.textDim, fontSize: 12, marginBottom: 4 }}>نتيجتك مقارنة بباقي الناس</p>
              <p style={{ fontSize: 14 }}>
                {percentage <= 35 && <span style={{ color: '#f87171', fontWeight: 700 }}>أقل من 70% من الناس — محتاج تتحرك فوراً</span>}
                {percentage > 35 && percentage <= 65 && <span style={{ color: COLORS.amber, fontWeight: 700 }}>في المتوسط — عندك فرصة كبيرة للتحسن</span>}
                {percentage > 65 && <span style={{ color: COLORS.green, fontWeight: 700 }}>أحسن من 80% من الناس — خليك يقظ</span>}
              </p>
            </div>
          </div>
        </div>

        {/* التشخيص */}
        <div style={{
          marginBottom: 48, padding: 32, borderRadius: 24,
          border: `2px solid ${result.color}30`, background: result.colorLight
        }}>
          <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 700, marginBottom: 16, color: result.color, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ResultIcon size={28} style={{ color: result.color }} />
            {result.title}
          </h2>
          <p style={{ color: '#d4d4d4', fontSize: 18, lineHeight: 1.8 }}>{result.message}</p>
        </div>

        {/* النصائح */}
        <div style={{ marginBottom: 48, opacity: showTips ? 1 : 0, transform: showTips ? 'translateY(0)' : 'translateY(32px)', transition: 'all 0.7s' }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Flame size={24} style={{ color: COLORS.amber }} />
            خطوات عملية ليك
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {result.tips.map((tip, idx) => (
              <div key={idx} style={{
                display: 'flex', gap: 16, padding: 20,
                background: COLORS.bgCard, border: `1px solid ${COLORS.borderLight}`, borderRadius: 12
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(245,158,11,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4
                }}>
                  <span style={{ color: COLORS.amber, fontWeight: 700, fontSize: 14 }}>{idx + 1}</span>
                </div>
                <p style={{ color: '#d4d4d4', fontSize: 18, lineHeight: 1.6 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA للكتاب */}
        <div style={{ opacity: showCTA ? 1 : 0, transform: showCTA ? 'translateY(0)' : 'translateY(32px)', transition: 'all 0.7s' }}>
          <div style={{
            position: 'relative', padding: '32px 32px 40px', borderRadius: 24,
            border: `2px solid rgba(245,158,11,0.3)`,
            background: 'linear-gradient(to bottom, rgba(245,158,11,0.1), rgba(245,158,11,0.05))',
            textAlign: 'center', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, transparent, ${COLORS.amber}, transparent)` }}></div>
            <BookOpen size={48} style={{ color: COLORS.amber, margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.8rem)', fontWeight: 900, marginBottom: 16, color: '#fff' }}>المال في أوقات الحروب</h3>
            <p style={{ color: '#d4d4d4', fontSize: 18, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.7 }}>{result.bookCTA}</p>
            <a href="https://money-war.ahmoseeconomy.com/" target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                background: COLORS.amber, color: '#000', fontWeight: 900,
                padding: '20px 48px', borderRadius: 9999, fontSize: 20,
                textDecoration: 'none', boxShadow: `0 0 40px ${COLORS.amberGlow}`,
                transition: 'all 0.2s'
              }}>
              احصل على الكتاب الآن
              <ArrowRight size={22} />
            </a>
            <p style={{ marginTop: 24, color: COLORS.textDim, fontSize: 14 }}>الخطوة الأولى في تأمين مستقبلك المالي</p>
          </div>
        </div>

        {/* Share */}
        <div style={{ marginTop: 48, textAlign: 'center', paddingBottom: 48 }}>
          <p style={{ color: COLORS.textDim, marginBottom: 16, fontSize: 14 }}>شارك النتيجة مع صحابك — خليهم يعرفوا وضعهم هما كمان</p>
          <button onClick={() => {
            const text = `لسه عملت اختبار الجاهزية المالية من اقتصاد أحمس 🏦\nنتيجتي: ${percentage}% (${result.label})\n\nاعرف نتيجتك إنت كمان 👇\nhttps://score.cheamr.com`;
            if (navigator.share) { navigator.share({ text }); }
            else { navigator.clipboard.writeText(text); alert('تم نسخ النص! شاركه مع صحابك'); }
          }} style={{
            padding: '12px 32px', border: `1px solid rgba(255,255,255,0.2)`,
            borderRadius: 9999, fontSize: 14, fontWeight: 700,
            background: 'transparent', color: '#fff', cursor: 'pointer'
          }}>📤 شارك نتيجتك</button>
        </div>
      </div>

      {/* Sticky Book CTA */}
      <div style={{ position: 'fixed', bottom: 0, width: '100%', padding: 16, zIndex: 50 }}>
        <div style={{ maxWidth: 420, margin: '0 auto' }}>
          <a href="https://money-war.ahmoseeconomy.com/" target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: COLORS.amber, color: '#000', borderRadius: 9999,
              padding: '12px 24px', fontWeight: 700, textDecoration: 'none',
              boxShadow: `0 0 30px rgba(245,158,11,0.3)`
            }}>
            <span>احصل على الكتاب</span>
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Main App
// ============================================================
const App = () => {
  const [view, setView] = useState('landing');
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userName, setUserName] = useState('');

  const startQuiz = () => { setView('quiz'); window.scrollTo(0, 0); };

  const handleQuizComplete = (totalScore, allAnswers) => {
    setScore(totalScore); setAnswers(allAnswers);
    setView('leadgate'); window.scrollTo(0, 0);
  };

  const handleLeadSubmit = async (name, email) => {
    setUserName(name);
    // بناء بيانات العميل الكاملة وإرسالها لـ Google Sheets
    const leadData = buildLeadData(name, email, score, answers);
    console.log('📋 Lead Data:', leadData);
    await sendToGoogleSheets(leadData);
    setView('results'); window.scrollTo(0, 0);
  };

  return (
    <div dir="rtl" style={{
      minHeight: '100vh', background: COLORS.bg, color: '#fff',
      fontFamily: "'Cairo', 'Segoe UI', sans-serif",
      overflowX: 'hidden'
    }}>
      {/* الخطوط محملة في index.html */}
      {view === 'landing' && <LandingPage onStart={startQuiz} />}
      {view === 'quiz' && <QuizScreen onComplete={handleQuizComplete} />}
      {view === 'leadgate' && <LeadGate score={score} onSubmit={handleLeadSubmit} />}
      {view === 'results' && <ResultsPage score={score} answers={answers} userName={userName} />}
    </div>
  );
};

export default App;