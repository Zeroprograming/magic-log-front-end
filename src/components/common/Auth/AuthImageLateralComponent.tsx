import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function AuthImageLateralComponent() {
  return (
    <div className="lg:relative lg:w-full h-full">
      <Link href="/">
        <Image
          src="/images/logo_black_background.svg"
          alt="Logo"
          width={200}
          height={200}
          className="absolute top-10 left-10 z-10 cursor-pointer"
        />
      </Link>
      <Image
        src="/images/backgrounds/image_1.svg"
        alt="Logo"
        fill
        objectFit="cover"
        className="absolute inset-0 z-0"
      />
    </div>
  );
}
