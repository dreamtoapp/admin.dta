import { event } from '@/lib/gtm'
// Removed next-intl dependency

export const useGTMEvents = () => {
  const locale = 'en' // Hardcoded for now

  const trackButtonClick = (buttonName: string, page: string) => {
    event('button_click', 'Button', buttonName, undefined, {
      button_name: buttonName,
      page: page,
      language: locale,
      engagement: true
    })
  }

  const trackFormSubmission = (formName: string, success: boolean) => {
    event('form_submit', 'Form', formName, success ? 1 : 0, {
      form_name: formName,
      success: success,
      language: locale
    })
  }

  const trackNavigation = (from: string, to: string) => {
    event('navigation', 'Page', `${from} -> ${to}`, undefined, {
      from_page: from,
      to_page: to,
      language: locale
    })
  }

  const trackScroll = (depth: number) => {
    event('scroll', 'Engagement', `scroll_depth_${depth}%`, depth, {
      scroll_depth: depth,
      language: locale
    })
  }

  const trackServiceInterest = (service: string) => {
    event('service_interest', 'Services', service, 1, {
      service_name: service,
      language: locale,
      interest_type: 'service_click'
    })
  }

  const trackPortfolioInterest = (project: string) => {
    event('portfolio_interest', 'Content', project, 1, {
      project_name: project,
      language: locale,
      interest_type: 'portfolio_click'
    })
  }

  const trackConsultationCTA = (source: string) => {
    event('consultation_cta', 'Lead', source, 1, {
      source: source,
      language: locale,
      cta_type: 'consultation'
    })
  }

  const trackSocialMediaClick = (platform: string) => {
    event('social_media_click', 'Social', platform, 1, {
      platform: platform,
      language: locale,
      click_type: 'social_link'
    })
  }

  return {
    trackButtonClick,
    trackFormSubmission,
    trackNavigation,
    trackScroll,
    trackServiceInterest,
    trackPortfolioInterest,
    trackConsultationCTA,
    trackSocialMediaClick
  }
}

