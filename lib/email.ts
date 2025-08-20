import { Resend } from 'resend';

// TEMPORARILY DISABLED: Email sending is disabled due to missing API key
// To re-enable: Set RESEND_API_KEY environment variable and uncomment the email sending code
const resend = null; // process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(template: EmailTemplate): Promise<boolean> {
  // TEMPORARILY DISABLED: Email sending is disabled due to missing RESEND_API_KEY
  // To re-enable email sending:
  // 1. Set RESEND_API_KEY environment variable
  // 2. Uncomment the resend initialization above
  // 3. Replace this function with the original implementation below

  console.log('📧 Email sending temporarily disabled');
  console.log('📬 Would send email to:', template.to);
  console.log('📋 Subject:', template.subject);
  console.log('📝 Content preview:', template.html.substring(0, 100) + '...');

  return true; // Return true to not break the application flow

  // ORIGINAL IMPLEMENTATION (commented out for easy restoration):
  /*
  try {
    if (!resend) {
      console.log('Email service not configured, skipping email send');
      return true; // Return true to not break the flow
    }

    const { data, error } = await resend.emails.send({
      from: template.from || 'DreamToApp <noreply@dreamtoapp.com>',
      to: template.to,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error('Email sending failed:', error);
      return false;
    }

    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
  */
}

// Email templates for job applications
export function createApplicationConfirmationEmail(
  applicantName: string,
  applicantEmail: string,
  applicationNumber: string,
  locale: string = 'en'
): EmailTemplate {
  const isArabic = locale === 'ar';

  return {
    to: applicantEmail,
    subject: isArabic
      ? `تأكيد طلب التوظيف - ${applicationNumber}`
      : `Job Application Confirmation - ${applicationNumber}`,
    html: `
      <!DOCTYPE html>
      <html dir="${isArabic ? 'rtl' : 'ltr'}" lang="${locale}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isArabic ? 'تأكيد طلب التوظيف' : 'Job Application Confirmation'}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d7a50d, #0d3ad7); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #d7a50d; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .btn { display: inline-block; background: #d7a50d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${isArabic ? 'DreamToApp' : 'DreamToApp'}</h1>
            <p>${isArabic ? 'تأكيد طلب التوظيف' : 'Job Application Confirmation'}</p>
          </div>
          <div class="content">
            <h2>${isArabic ? `مرحباً ${applicantName}` : `Hello ${applicantName}`}</h2>
            <p>${isArabic
        ? 'شكراً لك على تقديم طلب التوظيف مع DreamToApp. لقد تم استلام طلبك بنجاح.'
        : 'Thank you for submitting your job application with DreamToApp. We have successfully received your application.'
      }</p>
            
            <div class="highlight">
              <strong>${isArabic ? 'رقم الطلب:' : 'Application Number:'}</strong> ${applicationNumber}<br>
              <strong>${isArabic ? 'تاريخ التقديم:' : 'Submission Date:'}</strong> ${new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
            </div>
            
            <p>${isArabic
        ? 'سنقوم بمراجعة طلبك بعناية وسنتواصل معك في أقرب وقت ممكن. عادةً ما تستغرق عملية المراجعة من 2-3 أيام عمل.'
        : 'We will carefully review your application and get back to you as soon as possible. The review process typically takes 2-3 business days.'
      }</p>
            
            <p>${isArabic
        ? 'إذا كان لديك أي أسئلة، لا تتردد في التواصل معنا.'
        : 'If you have any questions, please don\'t hesitate to contact us.'
      }</p>
            
            <div style="text-align: center;">
              <a href="https://dreamtoapp.com/${locale}/contactus" class="btn">
                ${isArabic ? 'تواصل معنا' : 'Contact Us'}
              </a>
            </div>
          </div>
          <div class="footer">
            <p>${isArabic
        ? 'هذا البريد الإلكتروني تم إرساله تلقائياً. يرجى عدم الرد عليه.'
        : 'This email was sent automatically. Please do not reply to this email.'
      }</p>
            <p>&copy; 2024 DreamToApp. ${isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

export function createStatusUpdateEmail(
  applicantName: string,
  applicantEmail: string,
  applicationNumber: string,
  newStatus: string,
  notes?: string,
  locale: string = 'en'
): EmailTemplate {
  const isArabic = locale === 'ar';

  const statusTranslations = {
    'REVIEWING': { en: 'Under Review', ar: 'قيد المراجعة' },
    'INTERVIEW': { en: 'Interview Scheduled', ar: 'تم تحديد موعد المقابلة' },
    'ACCEPTED': { en: 'Application Accepted', ar: 'تم قبول الطلب' },
    'REJECTED': { en: 'Application Status Update', ar: 'تحديث حالة الطلب' },
    'HIRED': { en: 'Congratulations! You\'re Hired!', ar: 'تهانينا! تم توظيفك!' }
  };

  const statusText = statusTranslations[newStatus as keyof typeof statusTranslations] ||
    { en: newStatus, ar: newStatus };

  return {
    to: applicantEmail,
    subject: isArabic
      ? `تحديث حالة الطلب - ${applicationNumber}`
      : `Application Status Update - ${applicationNumber}`,
    html: `
      <!DOCTYPE html>
      <html dir="${isArabic ? 'rtl' : 'ltr'}" lang="${locale}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isArabic ? 'تحديث حالة الطلب' : 'Application Status Update'}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d7a50d, #0d3ad7); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-badge { 
            display: inline-block; 
            padding: 8px 16px; 
            border-radius: 20px; 
            font-weight: bold; 
            margin: 10px 0;
            background: ${newStatus === 'ACCEPTED' || newStatus === 'HIRED' ? '#28a745' :
        newStatus === 'REJECTED' ? '#dc3545' : '#ffc107'};
            color: ${newStatus === 'ACCEPTED' || newStatus === 'HIRED' ? 'white' : 'black'};
          }
          .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #d7a50d; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .btn { display: inline-block; background: #d7a50d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${isArabic ? 'DreamToApp' : 'DreamToApp'}</h1>
            <p>${isArabic ? 'تحديث حالة الطلب' : 'Application Status Update'}</p>
          </div>
          <div class="content">
            <h2>${isArabic ? `مرحباً ${applicantName}` : `Hello ${applicantName}`}</h2>
            <p>${isArabic
        ? 'نود إعلامك بتحديث حالة طلب التوظيف الخاص بك.'
        : 'We would like to inform you about an update to your job application status.'
      }</p>
            
            <div class="highlight">
              <strong>${isArabic ? 'رقم الطلب:' : 'Application Number:'}</strong> ${applicationNumber}<br>
              <strong>${isArabic ? 'الحالة الجديدة:' : 'New Status:'}</strong> 
              <span class="status-badge">${isArabic ? statusText.ar : statusText.en}</span><br>
              <strong>${isArabic ? 'تاريخ التحديث:' : 'Update Date:'}</strong> ${new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
            </div>
            
            ${notes ? `<p><strong>${isArabic ? 'ملاحظات:' : 'Notes:'}</strong> ${notes}</p>` : ''}
            
            <p>${isArabic
        ? 'سنواصل التواصل معك مع أي تحديثات إضافية.'
        : 'We will continue to communicate with you regarding any additional updates.'
      }</p>
            
            <div style="text-align: center;">
              <a href="https://dreamtoapp.com/${locale}/contactus" class="btn">
                ${isArabic ? 'تواصل معنا' : 'Contact Us'}
              </a>
            </div>
          </div>
          <div class="footer">
            <p>${isArabic
        ? 'هذا البريد الإلكتروني تم إرساله تلقائياً. يرجى عدم الرد عليه.'
        : 'This email was sent automatically. Please do not reply to this email.'
      }</p>
            <p>&copy; 2024 DreamToApp. ${isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

export function createAdminNotificationEmail(
  adminEmail: string,
  applicationNumber: string,
  applicantName: string,
  applicantEmail: string,
  areaOfExpertise: string,
  yearsOfExperience: number,
  locale: string = 'en'
): EmailTemplate {
  const isArabic = locale === 'ar';

  return {
    to: adminEmail,
    subject: isArabic
      ? `طلب توظيف جديد - ${applicationNumber}`
      : `New Job Application - ${applicationNumber}`,
    html: `
      <!DOCTYPE html>
      <html dir="${isArabic ? 'rtl' : 'ltr'}" lang="${locale}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isArabic ? 'طلب توظيف جديد' : 'New Job Application'}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d7a50d, #0d3ad7); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .highlight { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #0d3ad7; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .btn { display: inline-block; background: #0d3ad7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${isArabic ? 'DreamToApp' : 'DreamToApp'}</h1>
            <p>${isArabic ? 'طلب توظيف جديد' : 'New Job Application'}</p>
          </div>
          <div class="content">
            <h2>${isArabic ? 'طلب توظيف جديد تم استلامه' : 'New Job Application Received'}</h2>
            
            <div class="highlight">
              <strong>${isArabic ? 'رقم الطلب:' : 'Application Number:'}</strong> ${applicationNumber}<br>
              <strong>${isArabic ? 'اسم المتقدم:' : 'Applicant Name:'}</strong> ${applicantName}<br>
              <strong>${isArabic ? 'البريد الإلكتروني:' : 'Email:'}</strong> ${applicantEmail}<br>
              <strong>${isArabic ? 'مجال التخصص:' : 'Area of Expertise:'}</strong> ${areaOfExpertise}<br>
              <strong>${isArabic ? 'سنوات الخبرة:' : 'Years of Experience:'}</strong> ${yearsOfExperience}<br>
              <strong>${isArabic ? 'تاريخ التقديم:' : 'Submission Date:'}</strong> ${new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
            </div>
            
            <p>${isArabic
        ? 'يرجى مراجعة الطلب والرد على المتقدم في أقرب وقت ممكن.'
        : 'Please review the application and respond to the applicant as soon as possible.'
      }</p>
            
            <div style="text-align: center;">
              <a href="https://dreamtoapp.com/${locale}/admin/applications/${applicationNumber}" class="btn">
                ${isArabic ? 'عرض الطلب' : 'View Application'}
              </a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2024 DreamToApp. ${isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
} 