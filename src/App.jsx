import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ShieldAlert, TrendingUp, Clock, ArrowRight, ChevronDown, Zap,
  Eye, Target, AlertCircle, CheckCircle2, Lock,
  Mail, User, BookOpen, Shield, AlertTriangle,
  Activity, Flame, Award, BarChart3, X, Link2, Send
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
  },
  {
    id: 16, category: 'qualifying',
    question: 'سؤال إحصائي أخير (اختياري): إيه فئة الدخل الشهري الأقرب ليك بالدولار؟',
    icon: '💵',
    options: [
      { text: 'أقل من 500 دولار', score: 0 },
      { text: 'من 500 لـ 1500 دولار', score: 0 },
      { text: 'من 1500 لـ 3000 دولار', score: 0 },
      { text: 'من 3000 لـ 5000 دولار', score: 0 },
      { text: 'أكتر من 5000 دولار', score: 0 },
      { text: 'أفضل ما أجاوب', score: 0 },
    ]
  }
];

const MAX_SCORE = 40;

// ============================================================
// Google Analytics helper
// ============================================================
const trackEvent = (eventName, params = {}) => {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      const isTg = !!(window.Telegram?.WebApp?.initData);
      window.gtag('event', eventName, { source: isTg ? 'telegram' : 'web', ...params });
    }
  } catch (e) { /* no-op */ }
};

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
// Google Form Integration (Leads → Google Sheet)
// ============================================================
// الفورم بيكتب مباشرة في شيت: "Ahmose Scorecard Leads"
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScUT5yrSE1RBR0krR01Bi3m3246vUJXrNQw1ZLDKdUDPwRU5A/formResponse';

// Ahmes Economy Smart Conversion API
const AHMES_API_URL = 'https://quiz.ahmoseeconomy.com/api/quiz-submit';
const GOOGLE_FORM_ENTRIES = {
  name: 'entry.1227689264',
  email: 'entry.1346113016',
  country: 'entry.622869477',
  phone: 'entry.1324327027',
  details: 'entry.454930785',
};

// ============================================================
// Countries list (for LeadGate combobox)
// ============================================================
// الاسم بالعربي للعرض، والاسم بالإنجليزي للبحث (autocomplete)
const COUNTRIES = [
  { code: 'EG', name: 'Egypt', nameAr: 'مصر', dial: '+20', flag: '🇪🇬' },
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'السعودية', dial: '+966', flag: '🇸🇦' },
  { code: 'AE', name: 'United Arab Emirates', nameAr: 'الإمارات', dial: '+971', flag: '🇦🇪' },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', dial: '+965', flag: '🇰🇼' },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر', dial: '+974', flag: '🇶🇦' },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', dial: '+973', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', nameAr: 'عُمان', dial: '+968', flag: '🇴🇲' },
  { code: 'JO', name: 'Jordan', nameAr: 'الأردن', dial: '+962', flag: '🇯🇴' },
  { code: 'LB', name: 'Lebanon', nameAr: 'لبنان', dial: '+961', flag: '🇱🇧' },
  { code: 'SY', name: 'Syria', nameAr: 'سوريا', dial: '+963', flag: '🇸🇾' },
  { code: 'IQ', name: 'Iraq', nameAr: 'العراق', dial: '+964', flag: '🇮🇶' },
  { code: 'PS', name: 'Palestine', nameAr: 'فلسطين', dial: '+970', flag: '🇵🇸' },
  { code: 'YE', name: 'Yemen', nameAr: 'اليمن', dial: '+967', flag: '🇾🇪' },
  { code: 'LY', name: 'Libya', nameAr: 'ليبيا', dial: '+218', flag: '🇱🇾' },
  { code: 'TN', name: 'Tunisia', nameAr: 'تونس', dial: '+216', flag: '🇹🇳' },
  { code: 'DZ', name: 'Algeria', nameAr: 'الجزائر', dial: '+213', flag: '🇩🇿' },
  { code: 'MA', name: 'Morocco', nameAr: 'المغرب', dial: '+212', flag: '🇲🇦' },
  { code: 'SD', name: 'Sudan', nameAr: 'السودان', dial: '+249', flag: '🇸🇩' },
  { code: 'MR', name: 'Mauritania', nameAr: 'موريتانيا', dial: '+222', flag: '🇲🇷' },
  { code: 'SO', name: 'Somalia', nameAr: 'الصومال', dial: '+252', flag: '🇸🇴' },
  { code: 'DJ', name: 'Djibouti', nameAr: 'جيبوتي', dial: '+253', flag: '🇩🇯' },
  { code: 'KM', name: 'Comoros', nameAr: 'جزر القمر', dial: '+269', flag: '🇰🇲' },
  { code: 'TR', name: 'Turkey', nameAr: 'تركيا', dial: '+90', flag: '🇹🇷' },
  { code: 'IR', name: 'Iran', nameAr: 'إيران', dial: '+98', flag: '🇮🇷' },
  { code: 'IL', name: 'Israel', nameAr: 'إسرائيل', dial: '+972', flag: '🇮🇱' },
  { code: 'US', name: 'United States', nameAr: 'أمريكا', dial: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', nameAr: 'كندا', dial: '+1', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', nameAr: 'بريطانيا', dial: '+44', flag: '🇬🇧' },
  { code: 'IE', name: 'Ireland', nameAr: 'أيرلندا', dial: '+353', flag: '🇮🇪' },
  { code: 'FR', name: 'France', nameAr: 'فرنسا', dial: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', nameAr: 'ألمانيا', dial: '+49', flag: '🇩🇪' },
  { code: 'IT', name: 'Italy', nameAr: 'إيطاليا', dial: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', nameAr: 'إسبانيا', dial: '+34', flag: '🇪🇸' },
  { code: 'PT', name: 'Portugal', nameAr: 'البرتغال', dial: '+351', flag: '🇵🇹' },
  { code: 'NL', name: 'Netherlands', nameAr: 'هولندا', dial: '+31', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', nameAr: 'بلجيكا', dial: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', nameAr: 'سويسرا', dial: '+41', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', nameAr: 'النمسا', dial: '+43', flag: '🇦🇹' },
  { code: 'SE', name: 'Sweden', nameAr: 'السويد', dial: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', nameAr: 'النرويج', dial: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', nameAr: 'الدنمارك', dial: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', nameAr: 'فنلندا', dial: '+358', flag: '🇫🇮' },
  { code: 'IS', name: 'Iceland', nameAr: 'آيسلندا', dial: '+354', flag: '🇮🇸' },
  { code: 'GR', name: 'Greece', nameAr: 'اليونان', dial: '+30', flag: '🇬🇷' },
  { code: 'PL', name: 'Poland', nameAr: 'بولندا', dial: '+48', flag: '🇵🇱' },
  { code: 'CZ', name: 'Czech Republic', nameAr: 'التشيك', dial: '+420', flag: '🇨🇿' },
  { code: 'RO', name: 'Romania', nameAr: 'رومانيا', dial: '+40', flag: '🇷🇴' },
  { code: 'HU', name: 'Hungary', nameAr: 'المجر', dial: '+36', flag: '🇭🇺' },
  { code: 'UA', name: 'Ukraine', nameAr: 'أوكرانيا', dial: '+380', flag: '🇺🇦' },
  { code: 'RU', name: 'Russia', nameAr: 'روسيا', dial: '+7', flag: '🇷🇺' },
  { code: 'BY', name: 'Belarus', nameAr: 'بيلاروسيا', dial: '+375', flag: '🇧🇾' },
  { code: 'KZ', name: 'Kazakhstan', nameAr: 'كازاخستان', dial: '+7', flag: '🇰🇿' },
  { code: 'UZ', name: 'Uzbekistan', nameAr: 'أوزبكستان', dial: '+998', flag: '🇺🇿' },
  { code: 'AZ', name: 'Azerbaijan', nameAr: 'أذربيجان', dial: '+994', flag: '🇦🇿' },
  { code: 'GE', name: 'Georgia', nameAr: 'جورجيا', dial: '+995', flag: '🇬🇪' },
  { code: 'AM', name: 'Armenia', nameAr: 'أرمينيا', dial: '+374', flag: '🇦🇲' },
  { code: 'CN', name: 'China', nameAr: 'الصين', dial: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', nameAr: 'اليابان', dial: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', nameAr: 'كوريا الجنوبية', dial: '+82', flag: '🇰🇷' },
  { code: 'IN', name: 'India', nameAr: 'الهند', dial: '+91', flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan', nameAr: 'باكستان', dial: '+92', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', nameAr: 'بنغلاديش', dial: '+880', flag: '🇧🇩' },
  { code: 'LK', name: 'Sri Lanka', nameAr: 'سريلانكا', dial: '+94', flag: '🇱🇰' },
  { code: 'NP', name: 'Nepal', nameAr: 'نيبال', dial: '+977', flag: '🇳🇵' },
  { code: 'AF', name: 'Afghanistan', nameAr: 'أفغانستان', dial: '+93', flag: '🇦🇫' },
  { code: 'ID', name: 'Indonesia', nameAr: 'إندونيسيا', dial: '+62', flag: '🇮🇩' },
  { code: 'MY', name: 'Malaysia', nameAr: 'ماليزيا', dial: '+60', flag: '🇲🇾' },
  { code: 'SG', name: 'Singapore', nameAr: 'سنغافورة', dial: '+65', flag: '🇸🇬' },
  { code: 'TH', name: 'Thailand', nameAr: 'تايلاند', dial: '+66', flag: '🇹🇭' },
  { code: 'PH', name: 'Philippines', nameAr: 'الفلبين', dial: '+63', flag: '🇵🇭' },
  { code: 'VN', name: 'Vietnam', nameAr: 'فيتنام', dial: '+84', flag: '🇻🇳' },
  { code: 'AU', name: 'Australia', nameAr: 'أستراليا', dial: '+61', flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', nameAr: 'نيوزيلندا', dial: '+64', flag: '🇳🇿' },
  { code: 'BR', name: 'Brazil', nameAr: 'البرازيل', dial: '+55', flag: '🇧🇷' },
  { code: 'AR', name: 'Argentina', nameAr: 'الأرجنتين', dial: '+54', flag: '🇦🇷' },
  { code: 'MX', name: 'Mexico', nameAr: 'المكسيك', dial: '+52', flag: '🇲🇽' },
  { code: 'CL', name: 'Chile', nameAr: 'تشيلي', dial: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', nameAr: 'كولومبيا', dial: '+57', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', nameAr: 'بيرو', dial: '+51', flag: '🇵🇪' },
  { code: 'VE', name: 'Venezuela', nameAr: 'فنزويلا', dial: '+58', flag: '🇻🇪' },
  { code: 'ZA', name: 'South Africa', nameAr: 'جنوب أفريقيا', dial: '+27', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', nameAr: 'نيجيريا', dial: '+234', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', nameAr: 'كينيا', dial: '+254', flag: '🇰🇪' },
  { code: 'ET', name: 'Ethiopia', nameAr: 'إثيوبيا', dial: '+251', flag: '🇪🇹' },
  { code: 'UG', name: 'Uganda', nameAr: 'أوغندا', dial: '+256', flag: '🇺🇬' },
  { code: 'TZ', name: 'Tanzania', nameAr: 'تنزانيا', dial: '+255', flag: '🇹🇿' },
  { code: 'GH', name: 'Ghana', nameAr: 'غانا', dial: '+233', flag: '🇬🇭' },
  { code: 'SN', name: 'Senegal', nameAr: 'السنغال', dial: '+221', flag: '🇸🇳' },
  { code: 'CI', name: 'Ivory Coast', nameAr: 'ساحل العاج', dial: '+225', flag: '🇨🇮' },
  { code: 'CM', name: 'Cameroon', nameAr: 'الكاميرون', dial: '+237', flag: '🇨🇲' },
];

const getUserGeolocation = async () => {
  const fallback = { country: null, countryCode: null, city: null, ip: null, success: false };
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const response = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) return fallback;
    const d = await response.json();
    if (!d.success) return fallback;
    return {
      country: d.country || null,
      countryCode: d.country_code || null,
      city: d.city || null,
      ip: d.ip || null,
      success: true,
    };
  } catch (e) {
    console.warn('Geolocation failed:', e);
    return fallback;
  }
};

const sendToGoogleSheets = async (data) => {
  try {
    // بنحط كل البيانات التفصيلية في حقل Details واحد كـ JSON
    // ده بيخلي الشيت نضيف (3 أعمدة: Name, Email, Details)
    // ولو محتاج تفاصيل أكتر هتلاقيهم في عمود Details
    const detailsBlob = [
      'Score: ' + data.score,
      'Points: ' + data.totalPoints,
      'Level: ' + data.classification,
      'Technical: ' + data.technicalScore,
      'Qualifying: ' + data.qualifyingScore,
      'Main Concern: ' + data.mainConcern,
      'Knowledge: ' + data.knowledgeLevel,
      'Crisis Experience: ' + data.crisisExperience,
      'Improvement Goal: ' + data.improvementGoal,
      'Age Group: ' + data.ageGroup,
      'Products: ' + data.recommendedProducts,
      'Income Range: ' + (data.incomeRange || 'Not specified'),
    'Reason: ' + data.productReason,
    'User Country: ' + (data.userCountry || 'Not specified'),
    'User Phone: ' + (data.userPhone || 'Not specified'),
    'Country: ' + (data.country || 'Unknown'),
    'Country Code: ' + (data.countryCode || 'XX'),
    'City: ' + (data.city || 'Unknown'),
    'IP: ' + (data.ip || 'Unknown'),
    ].join('\n');

    const formData = new FormData();
    formData.append(GOOGLE_FORM_ENTRIES.name, data.name || '');
    formData.append(GOOGLE_FORM_ENTRIES.email, data.email || '');
    formData.append(GOOGLE_FORM_ENTRIES.country, data.userCountry || '');
    formData.append(GOOGLE_FORM_ENTRIES.phone, data.userPhone || '');
    formData.append(GOOGLE_FORM_ENTRIES.details, detailsBlob);

    await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    });
    return true;
  } catch (error) {
    console.error('خطأ في إرسال البيانات:', error);
    return false;
  }
};

// --- Ahmes Economy API (4 AI agents pipeline) ---
const sendToAhmesAPI = async (data) => {
  try {
    const res = await fetch(AHMES_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name || '',
        email: data.email || '',
        phone: data.userPhone || '',
        country: data.userCountry || data.country || '',
        score: data.score || '',
        totalPoints: data.totalPoints || '',
        classification: data.classification || '',
        technicalScore: data.technicalScore || '',
        qualifyingScore: data.qualifyingScore || '',
        mainConcern: data.mainConcern || '',
        knowledgeLevel: data.knowledgeLevel || '',
        crisisExperience: data.crisisExperience || '',
        improvementGoal: data.improvementGoal || '',
        ageGroup: data.ageGroup || '',
        incomeRange: data.incomeRange || '',
        recommendedProducts: data.recommendedProducts || '',
        productReason: data.productReason || '',
        source: data.source || 'web',
      }),
    });
    const result = await res.json();
    console.log('Ahmes API response:', result);
    return result.ok;
  } catch (error) {
    console.error('Ahmes API error:', error);
    return false;
  }
};

const buildLeadData = (name, email, score, answers, telegramUser = null, geo = null, userCountry = '', userPhone = '') => {
  const result = getResultLevel(score);
  const percentage = Math.round((score / MAX_SCORE) * 100);
  const technicalScore = answers.filter(a => a.category === 'technical').reduce((s, a) => s + a.score, 0);
  const qualifyingScore = answers.filter(a => a.category === 'qualifying').reduce((s, a) => s + a.score, 0);
  const source = telegramUser ? 'telegram' : 'web';
  const telegramInfo = telegramUser
    ? `@${telegramUser.username || '-'} (id:${telegramUser.id}) ${telegramUser.first_name || ''} ${telegramUser.last_name || ''}`.trim()
    : '';

  // استخراج الإجابات التأهيلية المهمة
  const concerns = answers.find(a => a.questionId === 11)?.answerText || '';
  const knowledgeLevel = answers.find(a => a.questionId === 12)?.answerText || '';
  const crisisExperience = answers.find(a => a.questionId === 13)?.answerText || '';
  const improvementGoal = answers.find(a => a.questionId === 14)?.answerText || '';
  const ageGroup = answers.find(a => a.questionId === 15)?.answerText || '';
  const incomeRange = answers.find(a => a.questionId === 16)?.answerText || '';

  return {
    timestamp: new Date().toISOString(),
    name,
    email,
    userCountry,
    userPhone,
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
    incomeRange: incomeRange,
    country: geo && geo.country || null,
    countryCode: geo && geo.countryCode || null,
    city: geo && geo.city || null,
    ip: geo && geo.ip || null,
    // توصيات المنتجات (لصاحب المشروع)
    recommendedProducts: result.productRecommendations.map(p => p.product + ' [' + p.priority + ']').join(' | '),
    productReason: result.productRecommendations[0]?.reason || '',
    // معلومات تليجرام (إن وُجدت)
    source,
    telegramInfo,
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
const LeadGate = ({ score, onSubmit, prefillName = '', isTelegram = false }) => {
  const [name, setName] = useState(prefillName || '');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryQuery, setCountryQuery] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const countryBoxRef = useRef(null);
  const result = getResultLevel(score);
  const percentage = Math.round((score / MAX_SCORE) * 100);

  // إغلاق القائمة لما المستخدم يدوس برّاها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryBoxRef.current && !countryBoxRef.current.contains(e.target)) {
        setCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // فلترة قائمة الدول بناءً على النص المكتوب (بحث إنجليزي بالأحرف الأولى + عربي)
  const filteredCountries = useMemo(() => {
    const q = countryQuery.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(c =>
      c.name.toLowerCase().startsWith(q) ||
      c.name.toLowerCase().includes(q) ||
      c.nameAr.includes(countryQuery.trim()) ||
      c.code.toLowerCase().startsWith(q)
    );
  }, [countryQuery]);

  const selectCountry = (c) => {
    setSelectedCountry(c);
    setCountryQuery('');
    setCountryOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('من فضلك اكتب اسمك'); return; }
    if (!email.trim() || !email.includes('@')) { setError('من فضلك اكتب إيميل صحيح'); return; }
    if (!selectedCountry) { setError('من فضلك اختار بلدك'); return; }
    setLoading(true); setError('');
    const countryLabel = `${selectedCountry.flag} ${selectedCountry.name} (${selectedCountry.dial})`;
    const fullPhone = phone.trim() ? `${selectedCountry.dial} ${phone.trim()}` : '';
    setTimeout(() => onSubmit(name, email, countryLabel, fullPhone), 1500);
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
          <p style={{ color: COLORS.textMuted, fontSize: 18 }}>
            {isTelegram && prefillName
              ? `أهلاً ${prefillName} 👋 — سجّل إيميلك علشان تشوف تحليلك الكامل`
              : 'سجّل بياناتك علشان تشوف تحليلك الكامل والنصائح المخصصة ليك.'}
          </p>
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

          {/* Country autocomplete */}
          <div ref={countryBoxRef} style={{ position: 'relative' }}>
            {selectedCountry ? (
              <div
                onClick={() => { setSelectedCountry(null); setCountryOpen(true); setCountryQuery(''); }}
                style={{
                  ...inputStyle,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer', padding: '16px', gap: 12
                }}
              >
                <span style={{ color: COLORS.textDim, fontSize: 13 }}>اضغط لتغيير البلد</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: COLORS.amber, fontWeight: 700, direction: 'ltr' }}>{selectedCountry.dial}</span>
                  <span style={{ fontWeight: 700 }}>{selectedCountry.nameAr}</span>
                  <span style={{ fontSize: 22 }}>{selectedCountry.flag}</span>
                </span>
              </div>
            ) : (
              <>
                <ChevronDown size={20} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: COLORS.textDim, pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder="ابحث عن بلدك (Egypt, Saudi...)"
                  value={countryQuery}
                  onFocus={() => setCountryOpen(true)}
                  onChange={(e) => { setCountryQuery(e.target.value); setCountryOpen(true); }}
                  style={{ ...inputStyle, direction: 'ltr', textAlign: 'right' }}
                />
              </>
            )}

            {countryOpen && !selectedCountry && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
                maxHeight: 160, overflowY: 'auto',
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.borderLight}`,
                borderRadius: 12,
                zIndex: 20,
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
              }}>
                {filteredCountries.length === 0 ? (
                  <div style={{ padding: 16, color: COLORS.textDim, textAlign: 'center', fontSize: 14 }}>
                    مفيش نتائج — جرّب ابحث بالإنجليزي
                  </div>
                ) : filteredCountries.map(c => (
                  <div
                    key={c.code}
                    onClick={() => selectCountry(c)}
                    style={{
                      padding: '12px 16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderBottom: `1px solid ${COLORS.border}`,
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245,158,11,0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ color: COLORS.textDim, fontSize: 13, direction: 'ltr' }}>{c.dial}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 13, color: COLORS.textMuted, direction: 'ltr' }}>{c.name}</span>
                      <span style={{ fontWeight: 700 }}>{c.nameAr}</span>
                      <span style={{ fontSize: 20 }}>{c.flag}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Phone (optional) with locked dial code prefix */}
          <div style={{
            display: 'flex', alignItems: 'stretch', gap: 0,
            background: COLORS.bgCard, border: `1px solid ${COLORS.borderLight}`,
            borderRadius: 12, overflow: 'hidden'
          }}>
            <input
              type="tel"
              placeholder="رقم الموبايل (اختياري)"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              style={{
                flex: 1, background: 'transparent', border: 'none',
                padding: '16px', color: '#fff', fontSize: 16,
                outline: 'none', direction: 'ltr', textAlign: 'right',
                minWidth: 0
              }}
            />
            <div style={{
              padding: '0 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(245,158,11,0.08)',
              borderLeft: `1px solid ${COLORS.borderLight}`,
              color: selectedCountry ? COLORS.amber : COLORS.textDim,
              fontWeight: 700, fontSize: 15, direction: 'ltr',
              minWidth: 70
            }}>
              {selectedCountry ? selectedCountry.dial : '+?'}
            </div>
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

// --- Share Modal ---
const ShareModal = ({ percentage, resultLabel, resultColor, userName, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = 'https://ahmose-scorecard.vercel.app/';

  // رسالة جذابة بتثير الفضول
  const shareText =
    `🏦 اختبار الجاهزية المالية — اقتصاد أحمس\n\n` +
    `${userName ? userName + ' خلّص الاختبار 👇\n' : ''}` +
    `📊 النتيجة: ${percentage}% (${resultLabel})\n\n` +
    `هل تقدر تحمي أموالك لو جت أزمة؟\n` +
    `اعرف درجة جاهزيتك المالية في أقل من 3 دقايق ⏱️\n\n` +
    `📢 انضم لقناتنا على تيليجرام: https://t.me/ahmoseeconomy\n\n` +
    `👇 جرّب الاختبار`;

  const shareTextShort =
    `🏦 عملت اختبار الجاهزية المالية من اقتصاد أحمس\n` +
    `نتيجتي: ${percentage}% (${resultLabel}) 📊\n\n` +
    `هل تقدر تحمي أموالك لو جت أزمة؟ اعرف درجتك إنت كمان في 3 دقايق 👇`;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const encodedShort = encodeURIComponent(shareTextShort);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedShort}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedShort}&url=${encodedUrl}&hashtags=اقتصاد_أحمس,الجاهزية_المالية`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedShort}%0A${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  };

  const openShare = (platform) => {
    const url = shareLinks[platform];
    if (url) {
      trackEvent('share_clicked', { method: platform, percentage, result_label: resultLabel });
      // Use simple _blank without popup specs to avoid browser popup blockers
      const w = window.open(url, '_blank');
      // Fallback: if popup was blocked, navigate directly
      if (!w || w.closed) {
        window.location.href = url;
      }
    }
  };

  const handleCopy = async () => {
    const fullText = `${shareTextShort}\n${shareUrl}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullText);
      } else {
        const ta = document.createElement('textarea');
        ta.value = fullText; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
      }
      trackEvent('share_clicked', { method: 'copy_link', percentage, result_label: resultLabel });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'اختبار الجاهزية المالية — اقتصاد أحمس',
          text: shareTextShort,
          url: shareUrl
        });
        trackEvent('share_clicked', { method: 'native_share', percentage, result_label: resultLabel });
      } catch (err) {}
    }
  };

  // SVG icons inline (lucide doesn't have brand icons)
  const brandIcons = {
    facebook: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    twitter: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    telegram: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    whatsapp: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
    )
  };

  const platforms = [
    { key: 'telegram', name: 'تيليجرام', color: '#0088cc', icon: brandIcons.telegram },
    { key: 'whatsapp', name: 'واتساب', color: '#25D366', icon: brandIcons.whatsapp },
    { key: 'facebook', name: 'فيسبوك', color: '#1877F2', icon: brandIcons.facebook },
    { key: 'twitter', name: 'إكس (تويتر)', color: '#ffffff', icon: brandIcons.twitter }
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: `linear-gradient(180deg, ${COLORS.bgAlt} 0%, ${COLORS.bg} 100%)`,
          border: `1.5px solid ${COLORS.amberBorder}`,
          borderRadius: 24,
          padding: '28px 24px',
          maxWidth: 440, width: '100%',
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${COLORS.amberGlow}`,
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, left: 14,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%', width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: COLORS.textDim,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = COLORS.textDim; }}
          aria-label="إغلاق"
        >
          <X size={18} />
        </button>

        {/* Header with result badge */}
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 18px',
            background: `${resultColor}15`,
            border: `1px solid ${resultColor}40`,
            borderRadius: 9999,
            marginBottom: 14
          }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: resultColor }}>{percentage}%</span>
            <span style={{ color: resultColor, fontWeight: 700, fontSize: 13 }}>{resultLabel}</span>
          </div>
          <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 900, marginBottom: 8 }}>
            شارك نتيجتك
          </h3>
          <p style={{ color: COLORS.textDim, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            اختار البلاتفورم اللي تحب تنشر عليها — خلي صحابك يعرفوا وضعهم المالي كمان
          </p>
        </div>

        {/* Platform grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 16
        }}>
          {platforms.map((p) => (
            <button
              key={p.key}
              onClick={() => openShare(p.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: 14,
                color: '#fff',
                fontSize: 14, fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'right'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${p.color}20`;
                e.currentTarget.style.borderColor = `${p.color}60`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ color: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.icon}
              </div>
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        {/* Copy link button */}
        <button
          onClick={handleCopy}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '14px',
            background: copied ? `${COLORS.amber}20` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${copied ? COLORS.amber : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 14,
            color: copied ? COLORS.amber : '#fff',
            fontSize: 14, fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: 10
          }}
        >
          {copied ? <CheckCircle2 size={18} /> : <Link2 size={18} />}
          <span>{copied ? 'تم نسخ الرابط والنص!' : 'نسخ الرابط (لإنستجرام أو أي تطبيق)'}</span>
        </button>

        {/* Native share fallback for mobile */}
        {typeof navigator !== 'undefined' && navigator.share && (
          <button
            onClick={handleNativeShare}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px',
              background: 'rgba(245,158,11,0.08)',
              border: `1px solid ${COLORS.amberBorder}`,
              borderRadius: 14,
              color: COLORS.amber,
              fontSize: 14, fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: 14
            }}
          >
            <Send size={18} />
            <span>مشاركة عبر تطبيق آخر</span>
          </button>
        )}

        {/* cross-promo bot banner (web only) */}
{!isTelegram && (
          <a
            href="https://t.me/AhmoseEconomyBot"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('bot_link_clicked', { placement: 'results' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #229ED9 0%, #2AABEE 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 14,
              boxShadow: '0 6px 24px rgba(42,171,238,0.35)',
              border: '1px solid rgba(255,255,255,0.15)'
            }}
          >
            <Send size={20} />
            جرّب الحاسبة على بوت تليجرام
          </a>
        )}

        {/* Telegram channel invite */}
        <a
          href="https://t.me/ahmoseeconomy"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px',
            background: 'rgba(0,136,204,0.1)',
            border: '1px solid rgba(0,136,204,0.3)',
            borderRadius: 12,
            color: '#4dabf7',
            fontSize: 13, fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,136,204,0.18)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,136,204,0.1)'; }}
        >
          <div style={{ color: '#4dabf7' }}>{brandIcons.telegram}</div>
          <span>انضم لقناة اقتصاد أحمس على تيليجرام ←</span>
        </a>
      </div>
    </div>
  );
};

// --- Results Page ---
const ResultsPage = ({ score, answers, userName, isTelegram = false }) => {
  const [showTips, setShowTips] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
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

        {/* CTA للكتابين */}
        <div style={{ opacity: showCTA ? 1 : 0, transform: showCTA ? 'translateY(0)' : 'translateY(32px)', transition: 'all 0.7s' }}>
          <div style={{
            position: 'relative', padding: '40px 24px', borderRadius: 24,
            border: `2px solid rgba(245,158,11,0.3)`,
            background: 'linear-gradient(to bottom, rgba(245,158,11,0.1), rgba(245,158,11,0.05))',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, transparent, ${COLORS.amber}, transparent)` }}></div>

            {/* العنوان الرئيسي */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <BookOpen size={44} style={{ color: COLORS.amber, margin: '0 auto 12px', display: 'block' }} />
              <h3 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.7rem)', fontWeight: 900, marginBottom: 8, color: '#fff' }}>الكتب اللي هتنقلك للمستوى التالي</h3>
              <p style={{ color: '#d4d4d4', fontSize: 15, lineHeight: 1.7, maxWidth: 520, margin: '12px auto 0' }}>{result.bookCTA}</p>
            </div>

            {/* شبكة الكتابين */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 24 }}>

              {/* الكتاب الأول */}
              <div style={{
                background: 'rgba(0,0,0,0.35)', border: `1px solid ${COLORS.amberBorder}`,
                borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column',
                alignItems: 'center', textAlign: 'center', transition: 'all 0.2s'
              }}>
                <div style={{
                  width: '100%', maxWidth: 280, aspectRatio: '3 / 2', borderRadius: 12,
                  background: 'rgba(245,158,11,0.08)', border: `1px solid ${COLORS.amberBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 18, overflow: 'hidden',
                  boxShadow: `0 10px 28px rgba(0,0,0,0.45), 0 0 22px ${COLORS.amberGlow}`
                }}>
                  <img src="book-money-war.jpg" alt="غلاف كتاب المال في أوقات الحروب"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 8 }}>المال في أوقات الحروب</h4>
                <p style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
                  دليلك العملي لحماية أموالك في أوقات الاضطراب الاقتصادي والأزمات
                </p>
                <a href="https://money-war.ahmoseeconomy.com/" target="_blank" rel="noopener noreferrer"
                  onClick={() => trackEvent('book_link_clicked', { book: 'money_war', placement: 'results' })}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: COLORS.amber, color: '#000', fontWeight: 800,
                    padding: '12px 24px', borderRadius: 9999, fontSize: 14,
                    textDecoration: 'none', width: '100%', justifyContent: 'center',
                    boxShadow: `0 0 24px ${COLORS.amberGlow}`, transition: 'all 0.2s'
                  }}>
                  احصل على الكتاب
                  <ArrowRight size={16} />
                </a>
              </div>

              {/* الكتاب الثاني */}
              <div style={{
                background: 'rgba(0,0,0,0.35)', border: `1px solid ${COLORS.amberBorder}`,
                borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column',
                alignItems: 'center', textAlign: 'center', transition: 'all 0.2s'
              }}>
                <div style={{
                  width: '100%', maxWidth: 280, aspectRatio: '3 / 2', borderRadius: 12,
                  background: 'rgba(245,158,11,0.08)', border: `1px solid ${COLORS.amberBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 18, overflow: 'hidden',
                  boxShadow: `0 10px 28px rgba(0,0,0,0.45), 0 0 22px ${COLORS.amberGlow}`
                }}>
                  <img src="book-chaos-map.jpg" alt="غلاف كتاب خريطة الفوضى"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 8 }}>خريطة الفوضى</h4>
                <p style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
                  خريطة طريقك لفهم الفوضى الاقتصادية وتحويلها لفرص حقيقية
                </p>
                <a href="https://book.ahmoseeconomy.com/" target="_blank" rel="noopener noreferrer"
                  onClick={() => trackEvent('book_link_clicked', { book: 'chaos_map', placement: 'results' })}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: COLORS.amber, color: '#000', fontWeight: 800,
                    padding: '12px 24px', borderRadius: 9999, fontSize: 14,
                    textDecoration: 'none', width: '100%', justifyContent: 'center',
                    boxShadow: `0 0 24px ${COLORS.amberGlow}`, transition: 'all 0.2s'
                  }}>
                  احصل على الكتاب
                  <ArrowRight size={16} />
                </a>
              </div>

            </div>

            <p style={{ textAlign: 'center', color: COLORS.textDim, fontSize: 13, marginTop: 8 }}>الخطوة الأولى في تأمين مستقبلك المالي</p>
          </div>
        </div>

        {/* Share */}
        <div style={{ marginTop: 48, textAlign: 'center', paddingBottom: 48 }}>
          <p style={{ color: COLORS.textDim, marginBottom: 20, fontSize: 14 }}>شارك النتيجة مع صحابك — خليهم يعرفوا وضعهم هما كمان</p>
          <button onClick={() => setShowShareModal(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '14px 36px',
            border: `2px solid ${COLORS.amber}`,
            borderRadius: 9999, fontSize: 15, fontWeight: 800,
            background: 'rgba(245,158,11,0.1)',
            color: COLORS.amber,
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: `0 0 24px ${COLORS.amberGlow}`
          }}>
            <span style={{ fontSize: 18 }}>📤</span>
            <span>شارك نتيجتك</span>
          </button>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <ShareModal
            percentage={percentage}
            resultLabel={result.label}
            resultColor={result.color}
            userName={userName}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </div>

    </div>
  );
};

// ============================================================
// Main App
// ============================================================
const App = () => {
  const [view, setView] = useState('landing');
  const [geo, setGeo] = useState({ country: null, countryCode: null, city: null, ip: null, success: false });
  useEffect(() => { getUserGeolocation().then(setGeo); }, []);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userName, setUserName] = useState('');
  const [telegramUser, setTelegramUser] = useState(null);
  const [isTelegram, setIsTelegram] = useState(false);

  // تهيئة Telegram Mini App SDK
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initData) {
      setIsTelegram(true);
      try {
        tg.ready();
        tg.expand();
        // تطبيق ألوان الثيم الداكن على شريط تيليجرام
        if (tg.setHeaderColor) tg.setHeaderColor('#05070a');
        if (tg.setBackgroundColor) tg.setBackgroundColor('#05070a');
        // منع إغلاق الـ Mini App بالسحب بطريق الخطأ
        if (tg.enableClosingConfirmation) tg.enableClosingConfirmation();
      } catch (e) {
        console.warn('Telegram WebApp init warning:', e);
      }
      // استخراج بيانات المستخدم من تيليجرام
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setTelegramUser(user);
        if (user.first_name) {
          setUserName(user.first_name);
        }
      }
    }
  }, []);

  const startQuiz = () => {
    trackEvent('quiz_start');
    setView('quiz');
    window.scrollTo(0, 0);
  };

  const handleQuizComplete = (totalScore, allAnswers) => {
    setScore(totalScore); setAnswers(allAnswers);
    const percentage = Math.round((totalScore / MAX_SCORE) * 100);
    const result = getResultLevel(totalScore);
    trackEvent('quiz_completed', {
      score: totalScore,
      max_score: MAX_SCORE,
      percentage,
      result_level: result.labelEn,
      result_label: result.label
    });
    setView('leadgate'); window.scrollTo(0, 0);
  };

  const handleLeadSubmit = async (name, email, userCountry = '', userPhone = '') => {
    setUserName(name);
    const percentage = Math.round((score / MAX_SCORE) * 100);
    const result = getResultLevel(score);
    trackEvent('lead_submitted', {
      percentage,
      result_level: result.labelEn,
      has_telegram: !!telegramUser,
      user_country: userCountry || 'unknown'
    });
    // بناء بيانات العميل الكاملة وإرسالها لـ Google Sheets
    const leadData = buildLeadData(name, email, score, answers, telegramUser, geo, userCountry, userPhone);
    console.log('📋 Lead Data:', leadData);
    await sendToGoogleSheets(leadData);

    // إرسال البيانات لنظام التحويل الذكي (4 وكلاء ذكاء اصطناعي)
    sendToAhmesAPI(leadData).catch(console.error);

    // إرسال النتيجة للبوت عبر sendData (لو داخل تيليجرام)
    const tg = window.Telegram?.WebApp;
    if (isTelegram && tg && tg.sendData) {
      try {
        const percentage = Math.round((score / MAX_SCORE) * 100);
        const result = getResultLevel(score);
        tg.sendData(JSON.stringify({
          type: 'scorecard_result',
          name,
          email,
          percentage,
          label: result.label,
          labelEn: result.labelEn,
          tgId: telegramUser?.id || null,
          tgUsername: telegramUser?.username || null
        }));
      } catch (e) {
        console.warn('tg.sendData failed:', e);
      }
    }

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
      {view === 'leadgate' && <LeadGate score={score} onSubmit={handleLeadSubmit} prefillName={userName} isTelegram={isTelegram} />}
      {view === 'results' && <ResultsPage score={score} answers={answers} userName={userName} isTelegram={isTelegram} />}
    </div>
  );
};

export default App;
