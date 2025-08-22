import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import SignInForm from './auth/signin/SignInForm';
import { Users, Target, TrendingUp, Shield, Award } from 'lucide-react';
import Image from 'next/image';

// Background Component
function BackgroundLayers() {
  return (
    <>
      {/* Enhanced Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary/60"></div>

      {/* Refined Geometric Pattern */}
      <div className="absolute inset-0 opacity-25 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.12%22%3E%3Cpath%20d%3D%22M0%200h40v40H0V0zm40%2040h40v40H40V40zM0%2040h40v40H0V40z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      {/* Enhanced Radial Gradients */}
      <div className="absolute inset-0 bg-radial-gradient from-primary/50 via-primary/25 to-transparent" style={{ backgroundPosition: '0% 0%' }}></div>
      <div className="absolute inset-0 bg-radial-gradient from-secondary/40 via-transparent to-transparent" style={{ backgroundPosition: '100% 100%' }}></div>

      {/* Accent Highlights */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-accent/20 via-transparent to-transparent"></div>

      {/* Sophisticated Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"></div>
    </>
  );
}

// Decorative Elements Component
function DecorativeElements() {
  return (
    <>
      {/* Enhanced Floating Elements */}
      <div className="absolute top-16 left-16 w-36 h-36 bg-white/12 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-24 left-32 w-28 h-28 bg-secondary/25 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-24 right-24 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-32 right-40 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>

      {/* Strategic Accent Points */}
      <div className="absolute top-1/3 right-16 w-20 h-20 bg-primary/35 rounded-full blur-lg animate-pulse"></div>
      <div className="absolute bottom-1/3 left-24 w-16 h-16 bg-secondary/30 rounded-full blur-md animate-pulse"></div>

      {/* Dynamic Particles */}
      <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-white/50 rounded-full blur-sm animate-bounce"></div>
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-secondary/60 rounded-full blur-sm animate-bounce" style={{ animationDelay: '0.7s' }}></div>
      <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-accent/70 rounded-full blur-sm animate-bounce" style={{ animationDelay: '1.4s' }}></div>
    </>
  );
}

// Logo Section Component
function LogoSection() {
  return (
    <div className="z-20 w-full h-[35%] flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center w-[65%] h-full">
        <Image
          src="/assets/dreamtoapp/dreamToApp.svg"
          alt="شعار DreamToApp"
          fill
          className="drop-shadow-2xl object-contain filter brightness-110"
          priority
        />
        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl scale-150"></div>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, bgOpacity, borderOpacity }: {
  icon: React.ElementType;
  title: string;
  description: string;
  bgOpacity: string;
  borderOpacity: string;
}) {
  return (
    <div className={`flex items-center gap-4 p-3 ${bgOpacity} rounded-xl backdrop-blur-md border ${borderOpacity} hover:bg-white/30 hover:scale-[1.03] hover:shadow-xl transition-all duration-300 cursor-pointer group`}>
      <div className="w-11 h-11 bg-white/35 rounded-xl flex items-center justify-center backdrop-blur-lg border border-white/50 group-hover:bg-white/45 group-hover:border-white/60 transition-all duration-300 shadow-lg">
        <Icon className="w-5 h-5 text-secondary drop-shadow-lg group-hover:scale-110 group-hover:text-white transition-all duration-300" />
      </div>
      <div className="flex-1 text-right">
        <p className="text-white/95 text-sm leading-relaxed font-medium group-hover:text-white transition-colors duration-300">{description}</p>
      </div>
    </div>
  );
}

// Content Section Component
function ContentSection() {
  return (
    <div className="relative z-20 w-full h-[65%] flex flex-col justify-start px-12 pt-6">
      <div className="max-w-xl">
        <h2 className="text-4xl font-bold leading-tight mb-4 text-white text-right drop-shadow-lg">
          أهلاً وسهلاً!
        </h2>

        <p className="text-lg text-white/95 mb-6 leading-relaxed font-medium text-right drop-shadow-md">
          نحن سعداء برؤيتك مرة أخرى. معاً نصنع التميز ونحقق النجاح.
        </p>

        {/* Enhanced Feature Highlights */}
        <div className="flex flex-row gap-4 mb-6">
          <FeatureCard
            icon={Target}
            title=""
            description="كل عمل يساهم في النجاح"
            bgOpacity="bg-white/18"
            borderOpacity="border-white/25"
          />
          <FeatureCard
            icon={Users}
            title=""
            description="التعاون يخلق النتائج"
            bgOpacity="bg-white/15"
            borderOpacity="border-white/20"
          />
          <FeatureCard
            icon={TrendingUp}
            title=""
            description="التعلم لا يتوقف أبداً"
            bgOpacity="bg-white/12"
            borderOpacity="border-white/15"
          />
        </div>

        {/* Enhanced Quote Section */}
        <div className="mt-6 p-4 bg-white/25 rounded-2xl backdrop-blur-lg border border-white/35 shadow-2xl">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-secondary mt-1 flex-shrink-0 drop-shadow-lg" />
            <div className="text-right">
              <p className="text-white/95 italic font-medium text-sm leading-relaxed">
                "النجاح ليس نهائياً، والفشل ليس مميتاً: إنها الشجاعة للاستمرار هي ما يهم."
              </p>
              <p className="text-white/85 text-sm mt-2 font-semibold">- فريق DreamToApp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Left Section Component
function LeftSection() {
  return (
    <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden">
      <BackgroundLayers />
      <div className="flex flex-col justify-start px-10 pt-2 w-full h-full">
        <LogoSection />
        <ContentSection />
      </div>
      <DecorativeElements />
    </div>
  );
}

// Mobile Logo Component
function MobileLogo() {
  return (
    <div className="lg:hidden text-center mb-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg">
          <Image
            src="/assets/dreamtoapp/dreamToApp.svg"
            alt="شعار DreamToApp"
            width={32}
            height={32}
            className="drop-shadow-sm"
            priority
          />
        </div>
        <div className="text-right">
          <h1 className="text-lg font-bold text-foreground">DreamToApp</h1>
          <p className="text-muted-foreground text-xs">حلول المؤسسات</p>
        </div>
      </div>
    </div>
  );
}

// Login Form Component
function LoginFormSection() {
  return (
    <div className="bg-card rounded-lg shadow-lg border border-border p-4 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%230d3ad7%22%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative z-10">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-foreground mb-1">أهلاً وسهلاً</h2>
          <p className="text-muted-foreground text-xs">سجل دخولك إلى لوحة التحكم</p>
        </div>

        <SignInForm />

        {/* Additional Info - Ultra-Compact */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Award className="w-3 h-3 text-primary" />
            <span>آمن • موثوق • مهني</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Right Section Component
function RightSection() {
  return (
    <div className="w-full lg:w-[40%] flex items-center justify-center px-4 py-4 bg-background">
      <div className="w-full max-w-xs space-y-3">
        <MobileLogo />
        <LoginFormSection />
      </div>
    </div>
  );
}

export default async function RootPage() {
  const session = await auth();

  if (session) {
    const role = session.user?.role?.toUpperCase();
    if (role === 'ADMIN') {
      redirect('/dashboard/admin');
    } else if (role === 'STAFF') {
      redirect('/dashboard/client');
    } else {
      redirect('/dashboard/client');
    }
  }

  return (
    <div className="min-h-screen flex">
      <LeftSection />
      <RightSection />
    </div>
  );
}

