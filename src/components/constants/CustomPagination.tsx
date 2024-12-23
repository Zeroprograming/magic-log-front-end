import React from 'react';

interface CustomPaginationProps {
  totalRowsInPage: number;
  totalRecords: number;
  rowsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  selectedRows?: number;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  totalRowsInPage = 0,
  totalRecords,
  rowsPerPage,
  currentPage,
  onPageChange,
  selectedRows = 0,
}) => {
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const pageLimit = 5;

    // Mostrar siempre la primera página
    pages.push(1);

    if (totalPages <= pageLimit) {
      // Mostrar todas las páginas si el número total de páginas es menor o igual al límite
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica de puntos suspensivos
      if (currentPage > 3) {
        if (currentPage > 4) pages.push('...');
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        if (currentPage < totalPages - 3) pages.push('...');
      }

      // Siempre mostrar la última página si hay varias páginas
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center p-4 relative">
      <div className="flex items-center justify-start left-0 absolute p-4">
        <span className="text-sm text-greyScale-text-caption">
          {selectedRows} de {totalRowsInPage} fila(s) seleccionada(s)
        </span>
      </div>

      <div className="flex gap-2 ">
        <button
          onClick={() => {
            handlePageChange(1);
          }}
          disabled={currentPage === 1}
          className="p-2 h-10 w-10  rounded-full disabled:opacity-50"
        >
          {/* <span className="sr-only text-black">{'<<'}</span> */}
          {'<<'}
        </button>
        <button
          onClick={() => {
            handlePageChange(currentPage - 1);
          }}
          disabled={currentPage === 1}
          className="p-2 h-10 w-10  rounded-full disabled:opacity-50"
        >
          {'<'}
        </button>
        {generatePageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => {
                handlePageChange(page);
              }}
              className={`p-2 h-10 w-10  rounded-full disabled:opacity-50 ${
                currentPage === page ? 'bg-green-500 text-white' : ''
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="mx-2 py-2">
              {page}
            </span>
          ),
        )}
        <button
          onClick={() => {
            handlePageChange(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
          className="p-2 h-10 w-10  rounded-full disabled:opacity-50"
        >
          {'>'}
        </button>
        <button
          onClick={() => {
            handlePageChange(totalPages);
          }}
          disabled={currentPage === totalPages}
          className="p-2 h-10 w-10  rounded-full disabled:opacity-50"
        >
          {'>>'}
        </button>
      </div>

      <div className="flex items-center justify-end right-0 absolute p-4">
        <span className="text-sm text-greyScale-text-caption">
          Total de registros: {totalRecords}
        </span>
      </div>
    </div>
  );
};

export default CustomPagination;
