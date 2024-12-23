import { Filter } from 'lucide-react';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SearchFilterProps {
  options: any;
  filters: any;
  setFilters: (filters: any) => void;
  filterInputValue: any;
  setFilterInputValue: (value: any) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  options,
  filters,
  setFilters,
  filterInputValue,
  setFilterInputValue,
}) => {
  const [currentFilterMode, setCurrentFilterMode] = useState(
    FilterMatchMode.CONTAINS,
  );

  const handleFilterChange = (mode: any) => {
    setCurrentFilterMode(mode);
    setFilters({
      ...filters,
      [options.field]: {
        value: options.value,
        matchMode: mode,
      },
    });
  };

  return (
    <div className="flex flex-row gap-2 justify-center items-center">
      <InputText
        value={filterInputValue[options.field as keyof typeof filterInputValue]}
        onChange={(e) => {
          setFilterInputValue((prev: typeof setFilterInputValue) => ({
            ...prev,
            [options.field]: e.target.value,
          }));

          options.filterApplyCallback(e.target.value);
        }}
        placeholder="Buscar"
        className="p-column-filter p-2 px-4 border rounded-xl min-w-32 bg text-base"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="p-2">
          <DropdownMenuItem
            onClick={() => {
              handleFilterChange(FilterMatchMode.CONTAINS);
            }}
            className={
              currentFilterMode === FilterMatchMode.CONTAINS
                ? 'bg-gray-200'
                : ''
            }
          >
            Contiene
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              handleFilterChange(FilterMatchMode.STARTS_WITH);
            }}
            className={
              currentFilterMode === FilterMatchMode.STARTS_WITH
                ? 'bg-gray-200'
                : ''
            }
          >
            Comienza con
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              handleFilterChange(FilterMatchMode.ENDS_WITH);
            }}
            className={
              currentFilterMode === FilterMatchMode.ENDS_WITH
                ? 'bg-gray-200'
                : ''
            }
          >
            Termina con
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              handleFilterChange(FilterMatchMode.EQUALS);
            }}
            className={
              currentFilterMode === FilterMatchMode.EQUALS ? 'bg-gray-200' : ''
            }
          >
            Igual a
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SearchFilter;
