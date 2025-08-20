// SEO Metadata utility for Next.js App Router
import { Metadata } from 'next';

export function getDefaultMetadata(locale: string): Metadata {
  const isArabic = locale === 'ar';

  return {
    title: {
      default: isArabic
        ? 'دريم تو آب - شركة تطوير مواقع وتطبيقات في جدة'
        : 'DreamToApp - Web & Mobile Development Agency in Jeddah, Saudi Arabia',
      template: isArabic ? '%s | دريم تو آب' : '%s | DreamToApp',
    },
    description: isArabic
      ? 'شركة تطوير مواقع وتطبيقات في جدة، المملكة العربية السعودية. نقدم خدمات تطوير الويب، تطبيقات الجوال، التجارة الإلكترونية، وتصميم الهوية البصرية.'
      : 'Leading web & mobile development agency in Jeddah, Saudi Arabia. We specialize in web development, mobile apps, e-commerce, UI/UX design, and digital marketing services.',
    keywords: isArabic
      ? 'تطوير مواقع جدة, تطبيقات جوال جدة, شركة برمجة جدة, تصميم مواقع جدة, تطوير تطبيقات السعودية, شركة تقنية جدة'
      : 'web development Jeddah, mobile app development Saudi Arabia, software company Jeddah, website design Saudi Arabia, digital agency Jeddah, IT services Saudi Arabia',
    openGraph: {
      title: isArabic ? 'دريم تو آب - شركة تطوير مواقع في جدة' : 'DreamToApp - Web Development Agency in Jeddah',
      description: isArabic
        ? 'شركة تطوير مواقع وتطبيقات في جدة، المملكة العربية السعودية'
        : 'Professional web & mobile development services in Jeddah, Saudi Arabia',
      url: 'https://www.dreamto.app',
      siteName: isArabic ? 'دريم تو آب' : 'DreamToApp',
      images: [
        {
          url: 'https://www.dreamto.app/og-image.png',
          width: 1200,
          height: 630,
          alt: isArabic ? 'دريم تو آب - شركة تطوير مواقع في جدة' : 'DreamToApp - Web Development Agency in Jeddah',
        },
      ],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@dreamtoapp',
      title: isArabic ? 'دريم تو آب - شركة تطوير مواقع في جدة' : 'DreamToApp - Web Development Agency in Jeddah',
      description: isArabic
        ? 'شركة تطوير مواقع وتطبيقات في جدة، المملكة العربية السعودية'
        : 'Professional web & mobile development services in Jeddah, Saudi Arabia',
      images: ['https://www.dreamto.app/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: '/favicon.ico',
    },
    alternates: {
      canonical: 'https://www.dreamto.app',
      languages: {
        ar: 'https://www.dreamto.app/ar',
        en: 'https://www.dreamto.app/en',
      },
    },
    other: {
      'geo.region': 'SA-MK',
      'geo.placename': 'Jeddah',
      'geo.position': '21.4858;39.1925',
      'ICBM': '21.4858, 39.1925',
      'DC.title': isArabic ? 'دريم تو آب' : 'DreamToApp',
      'DC.creator': 'DreamToApp',
      'DC.subject': isArabic ? 'تطوير مواقع، تطبيقات جوال، تصميم' : 'Web Development, Mobile Apps, Design',
      'DC.description': isArabic
        ? 'شركة تطوير مواقع وتطبيقات في جدة'
        : 'Web development agency in Jeddah, Saudi Arabia',
      'DC.publisher': 'DreamToApp',
      'DC.contributor': 'DreamToApp Team',
      'DC.date': new Date().toISOString(),
      'DC.type': 'Service',
      'DC.format': 'text/html',
      'DC.identifier': 'https://www.dreamto.app',
      'DC.language': isArabic ? 'ar' : 'en',
      'DC.coverage': 'Jeddah, Saudi Arabia',
      'DC.rights': 'Copyright DreamToApp',
    },
  };
}
