import { event } from './gtm'

// Form Submissions
export const trackContactFormSubmission = (data: any, locale: string) => {
  event('contact_form_submit', 'Lead', 'contact_form', 1, {
    form_type: 'contact',
    language: locale,
    conversion: true,
    timestamp: Date.now()
  })
}

export const trackStartDreamSubmission = (services: string[], locale: string) => {
  event('start_dream_submit', 'Conversion', 'project_initiation', 1, {
    services: services,
    language: locale,
    conversion_type: 'project_start',
    form_type: 'start_dream'
  })
}

export const trackJobApplicationSubmission = (expertise: string, locale: string) => {
  event('job_application_submit', 'Career', expertise, 1, {
    expertise: expertise,
    language: locale,
    source: 'team_apply',
    form_type: 'job_application'
  })
}

export const trackNewsletterSubscription = (locale: string) => {
  event('newsletter_subscription', 'Engagement', 'email_subscription', 1, {
    language: locale,
    subscription_type: 'newsletter',
    form_type: 'newsletter'
  })
}

// Service Interactions
export const trackServiceView = (service: string, locale: string) => {
  event('service_view', 'Content', service, 1, {
    service_name: service,
    language: locale,
    page_type: 'service'
  })
}

export const trackServiceInquiry = (service: string, source: string, locale: string) => {
  event('service_inquiry', 'Lead', service, 1, {
    service_name: service,
    source: source,
    language: locale,
    conversion: true
  })
}

export const trackMobileAppInterest = (locale: string) => {
  event('mobile_app_interest', 'Services', 'mobile_development', 1, {
    language: locale,
    service_type: 'mobile_app_development'
  })
}

export const trackEcommerceInterest = (locale: string) => {
  event('ecommerce_interest', 'Services', 'ecommerce_development', 1, {
    language: locale,
    service_type: 'ecommerce_development'
  })
}

export const trackUIUXInterest = (locale: string) => {
  event('uiux_interest', 'Services', 'ui_ux_design', 1, {
    language: locale,
    service_type: 'ui_ux_design'
  })
}

// Portfolio & Projects
export const trackPortfolioView = (project: string, locale: string) => {
  event('portfolio_view', 'Content', project, 1, {
    project_name: project,
    language: locale,
    page_type: 'portfolio'
  })
}

export const trackWorksampleView = (projectName: string, locale: string) => {
  event('worksample_view', 'Content', projectName, 1, {
    project_name: projectName,
    language: locale,
    page_type: 'worksample'
  })
}

export const trackCromboInquiry = (locale: string) => {
  event('crombo_inquiry', 'Lead', 'crombo_plugin', 1, {
    language: locale,
    conversion_type: 'plugin_inquiry'
  })
}

// Consultation & Support
export const trackConsultationRequest = (source: string, locale: string) => {
  event('consultation_request', 'Lead', source, 1, {
    source: source,
    language: locale,
    timestamp: Date.now()
  })
}

export const trackConsultationBooking = (service: string, locale: string) => {
  event('consultation_booking', 'Conversion', 'consultation_scheduled', 1, {
    service: service,
    language: locale,
    conversion_type: 'consultation'
  })
}

export const trackExpressQuery = (locale: string) => {
  event('express_query', 'Lead', 'quick_consultation', 1, {
    language: locale,
    conversion_type: 'express_consultation'
  })
}

export const trackProjectQuote = (services: string[], totalValue: number, locale: string) => {
  event('project_quote', 'Conversion', 'quote_request', totalValue, {
    services: services,
    total_value: totalValue,
    currency: 'SAR',
    language: locale,
    conversion_type: 'quote_request'
  })
}

// User Behavior
export const trackLanguageSwitch = (from: string, to: string) => {
  event('language_switch', 'User', `${from}_to_${to}`, 1, {
    from_language: from,
    to_language: to,
    user_preference: true
  })
}

// System Events
export const trackGTMLoadSuccess = () => {
  event('gtm_load_success', 'System', 'gtm_loaded', 1, {
    gtm_load_time: performance.now(),
    success: true
  })
}

export const trackGTMError = (error: string) => {
  event('gtm_error', 'Error', error, 1, {
    error_type: 'gtm_error',
    timestamp: Date.now()
  })
}

