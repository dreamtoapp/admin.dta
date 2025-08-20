'use client';

import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React, { FC, HTMLAttributes } from 'react';

type CustomLinkProps = NextLinkProps & {
  children: React.ReactNode;
  href: string;
  target?: string;
} & HTMLAttributes<HTMLAnchorElement>;

const Link: FC<CustomLinkProps> = ({ children, href, ...rest }) => {
  return (
    <NextLink
      href={href}
      prefetch={true}
      {...rest}
    >
      {children}
    </NextLink>
  );
};

export default Link;
