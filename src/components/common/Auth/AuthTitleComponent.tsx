import React from 'react';

export default function AuthTitleComponent({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl lg:text-4xl font-bold text-pretty">{title}</h1>
      <p className="text-base">{subtitle}</p>
    </div>
  );
}
