import * as React from 'react';

import { ListItem } from './ListItem'; // Asegúrate de importar tu ListItem

interface ColumnedListProps {
  items: Array<{
    title: string;
    href?: string;
    description: string;
    icon?: React.ReactNode;
    option?: number;
  }>;
  setViewOption?: (option: number) => void;
  columns?: number; // Número de columnas, por defecto 3
  sizeColumn?: number; // Número de elementos por columna, por defecto 3
}

const ColumnedList: React.FC<ColumnedListProps> = ({
  items,
  setViewOption,
  columns = 3,
  sizeColumn = 3,
}) => {
  // Función para dividir los elementos en sub-arrays de 3
  const chunkArray = (array: any[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  // Dividimos los items en sub-arrays
  const groupedItems = chunkArray(items, sizeColumn);

  const getDynamicWidth = () => {
    if (groupedItems.length === 1) return 'w-[400px] md:w-[500px] lg:w-[600px]';
    if (groupedItems.length === 2) return 'w-[500px] md:w-[600px] lg:w-[800px]';
    return 'w-full'; // Para más de 2 columnas, ajustar de manera personalizada si es necesario
  };

  return (
    <div
      className={`grid gap-6 ${getDynamicWidth()}`}
      style={{
        gridTemplateColumns: `repeat(${groupedItems.length}, minmax(0, 1fr))`,
      }}
    >
      {groupedItems.map((group, groupIndex) => (
        <ul key={groupIndex} className="flex flex-col gap-3">
          {group.map((component) => (
            <ListItem
              key={component.title}
              href={component.href}
              title={component.title}
              icon={component.icon}
              option={component.option}
              setViewOption={setViewOption}
            >
              {component.description}
            </ListItem>
          ))}
        </ul>
      ))}
    </div>
  );
};

export { ColumnedList };
