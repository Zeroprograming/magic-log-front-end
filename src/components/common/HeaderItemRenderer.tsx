import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from 'primereact/badge';
import React from 'react';

function HeaderItemRenderer(item: any, options: any) {
  return (
    <a
      className={`flex align-items-center items-center px-3 py-5 cursor-pointer bg-greyScale-surface-subtitle shadow-lg rounded-lg gap-2
    ${options.active && 'rounded-b-none'}
    `}
      onClick={options.onClick}
    >
      {item.items ? (
        options.active ? (
          <ChevronDown className=" size-5 text-greyScale-text-title" />
        ) : (
          <ChevronRight className=" size-5 text-greyScale-text-title" />
        )
      ) : (
        React.cloneElement(item.icon as React.ReactElement, {
          className: 'size-5 text-greyScale-text-title',
        })
      )}

      <span className={`mx-2 font-semibold`}>{item.label}</span>
      {item.badge && <Badge className="ml-auto" value={item.badge} />}
      {item.shortcut && (
        <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1 ">
          {item.shortcut}
        </span>
      )}
    </a>
  );
}

export default HeaderItemRenderer;
