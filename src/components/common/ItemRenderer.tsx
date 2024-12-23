import { useRouter } from 'next/router';
import React from 'react';

function ItemRenderer(item: any, options: any) {
  const router = useRouter();

  const handleClick = () => {
    if (!item.disabled && item.url) {
      void router.push(item.url);
    }
  };

  return (
    <div
      className={`flex flex-row w-full gap-2 justify-center items-center px-5 py-2 cursor-pointer  ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleClick}
    >
      {React.cloneElement(item.icon as React.ReactElement, {
        className: 'size-5',
      })}
      <span className={`w-full px-1 ${item.disabled ? 'text-gray-400' : ''}`}>
        {item.label}
      </span>
    </div>
  );
}

export default ItemRenderer;
