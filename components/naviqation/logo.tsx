import Image from 'next/image';

import Link from '@/components/link';
import dreamtoapp from '@/public/assets/logo.webp';

const Logo = () => {
  return (
    <div className="relative flex aspect-square size-6 p-2 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground mr-3 image-container">
      <Link href="/">
        <Image
          src={dreamtoapp}
          alt="dreamtoapp"
          fill
          loading="eager"
          priority
          sizes="(max-width: 640px) 20px, 24px"
          className="object-contain"
          style={{ aspectRatio: '1/1' }}
        />
      </Link>
    </div>
  );
};
export default Logo;
