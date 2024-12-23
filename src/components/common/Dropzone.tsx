import { FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  accept?: Record<string, string[]>; // Define los tipos MIME aceptados
  maxSize?: number; // Tamaño máximo en bytes
}

function Dropzone({
  onDrop,
  accept,
  maxSize = 10 * 1024 * 1024,
}: DropzoneProps) {
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxSize,
  });

  return (
    <div>
      {/* Contenedor principal del Dropzone */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed p-6 rounded-md cursor-pointer justify-center items-center flex flex-col border-primaryVariant-surface-default"
      >
        <input {...getInputProps()} />
        <span className="text-primaryVariant-surface-default font-semibold pb-4">
          Arrastre o
        </span>
        <button
          type="button"
          className="flex flex-row gap-1 items-center justify-center bg-primaryVariant-surface-default hover:bg-primaryVariant-surface-darker py-2 px-3 rounded-lg text-white"
        >
          <FileText className="size-5" />
          <span className="text-primary-500 text-sm">
            Seleccione un archivo
          </span>
        </button>
      </div>

      {/* Mostrar errores si el archivo excede el tamaño máximo */}
      {fileRejections.length > 0 && (
        <div className="text-red-500 mt-2 text-sm">
          {fileRejections.map(({ file, errors }) =>
            errors.map((error) => (
              <p key={error.code}>
                {error.code === 'file-too-large'
                  ? `El archivo "${file.name}" excede el tamaño máximo de 10 MB.`
                  : `Error: ${error.message}`}
              </p>
            )),
          )}
        </div>
      )}
    </div>
  );
}

export default Dropzone;
