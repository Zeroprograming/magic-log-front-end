import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { saveAs } from 'file-saver'; // Para guardar el archivo como PDF
import JsBarcode from 'jsbarcode';
import { Asterisk, CalendarIcon, FileText } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Dropzone from '@/components/common/Dropzone';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import {
  useCreateRadicadoMutation,
  useNextRadicadoNumberQuery,
  useRevertRadicadoMutation,
} from '@/services/v1/auth';

const formSchema = z.object({
  archivo_pdf: z
    .object({
      nombre: z.string().optional(),
      type: z.string().optional(),
      size: z
        .number()
        .max(10 * 1024 * 1024, {
          message: 'El archivo no debe exceder los 10 MB.',
        }) // Límite de 10 MB
        .optional(),
      extension: z.string().optional(),
      base64: z.string().optional(),
    })
    .optional(),
  fecha: z.string(),
  numero_radicado: z.string(),
  titulo: z.string().min(3, { message: 'El título es requerido.' }).max(250, {
    message: 'El título no puede tener más de 250 caracteres.',
  }),
  responsable: z
    .string()
    .min(3, { message: 'El responsable es requerido.' })
    .max(250, {
      message: 'El responsable no puede tener más de 250 caracteres.',
    }),
  position: z.string().optional(),
  file_url: z.string().optional(),
});

const generateRadicado = (baseNumber: string): string => {
  // Validar el número base (asegurar que sea de 6 dígitos)
  const radicadoNumber = baseNumber.padStart(6, '0');

  // Obtener la fecha actual
  const now = new Date();

  // Formatear la fecha
  const year = format(now, 'yyyy');
  // const month = format(now, 'MMM', { locale: es }).toUpperCase(); // Mes abreviado en español y en mayúsculas
  // const day = format(now, 'dd');
  // const time = format(now, 'HH:mm'); // Hora y minutos

  // Generar el número de radicado completo
  return `${year}-${radicadoNumber}`;
  //  ${month} ${day} ${time}
};

const extractBaseNumber = (radicado: string): string | null => {
  const parts = radicado.split('-');
  return parts.length === 2 ? parts[1] : null; // Verifica que tenga dos partes
};

export default function HomeView() {
  const createRadicadoMutation = useCreateRadicadoMutation();
  const revertRadicadoMutation = useRevertRadicadoMutation();
  const [originalBase64, setOriginalBase64] = React.useState<string | null>(
    null,
  );
  const [isLoadingGeneratePdf, setIsLoadingGeneratePdf] = React.useState(false);
  const positionOptions = [
    { label: 'Esquina Superior Izquierda', value: 'top-left' },
    { label: 'Esquina Superior Derecha', value: 'top-right' },
    { label: 'Esquina Inferior Izquierda', value: 'bottom-left' },
    { label: 'Esquina Inferior Derecha', value: 'bottom-right' },
  ];

  const {
    data: nextRadicado,
    isLoading,
    isError,
    refetch,
  } = useNextRadicadoNumberQuery();

  // Dentro de tu componente HomeView
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      archivo_pdf: undefined,
      numero_radicado: nextRadicado ?? '', // Este valor se actualizará dinámicamente
      fecha: new Date().toISOString(),
      titulo: '',
      responsable: '',
      position: 'top-right', // Valor predeterminado
    },
  });

  // Aquí configuramos el valor de numero_radicado cuando se obtiene next_radicado
  useEffect(() => {
    if (nextRadicado && !isLoading && !isError) {
      form.setValue('numero_radicado', nextRadicado);
    }
  }, [nextRadicado, form, isLoading, isError]);

  const { setValue, watch } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoadingGeneratePdf(true);

    createRadicadoMutation.mutate(
      {
        titulo: data.titulo,
        responsable: data.responsable,
      },
      {
        onSuccess: async () => {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { numero_radicado, archivo_pdf, position } = data;

          toast({
            title: 'Radicado creado',
            description: 'El radicado se ha creado correctamente.',
          });

          try {
            if (!archivo_pdf?.base64) {
              throw new Error('El archivo PDF no está presente o es inválido.');
            }

            const base64Data = archivo_pdf.base64.replace(
              /^data:application\/pdf;base64,/,
              '',
            );

            const binaryData = atob(base64Data);
            const decodedPdf = new Uint8Array(
              binaryData.split('').map((char) => char.charCodeAt(0)),
            );

            const pdfHeader = new TextDecoder().decode(decodedPdf.slice(0, 4));
            if (!pdfHeader.startsWith('%PDF')) {
              throw new Error('El archivo no es un PDF válido.');
            }

            const pdfDoc = await PDFDocument.load(decodedPdf, {
              ignoreEncryption: true,
            });

            const baseNumber = extractBaseNumber(numero_radicado);

            const numeroRadicado = generateRadicado(baseNumber ?? '');

            // Generar el código de barras
            const canvas = document.createElement('canvas');
            JsBarcode(canvas, numero_radicado, {
              format: 'CODE128',
              displayValue: false,
              width: 2,
              height: 40,
            });
            const barcodeDataUrl = canvas.toDataURL();

            const pages = pdfDoc.getPages();
            for (const page of pages) {
              const { width, height } = page.getSize();

              const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
              const radicadoText = `${numeroRadicado}`;

              const logoImageUrl = '/images/Logo-fondo-claro@4x2.png';
              const response = await fetch(logoImageUrl);
              const logoImageArrayBuffer = await response.arrayBuffer();
              const logoImage = await pdfDoc.embedPng(logoImageArrayBuffer);

              // Coordenadas según posición
              let rectX, rectY;
              switch (position) {
                case 'top-left':
                  rectX = +30;
                  rectY = height - 24;
                  break;
                case 'top-right':
                  rectX = width - 120;
                  rectY = height - 24;
                  break;
                case 'bottom-left':
                  rectX = +30;
                  rectY = 2;
                  break;
                case 'bottom-right':
                  rectX = width - 130;
                  rectY = 2;
                  break;
                default:
                  rectX = width - 120;
                  rectY = height - 24;
              }

              const rectWidth = 180;
              const rectHeight = 20;

              page.drawRectangle({
                x: rectX - 30,
                y: rectY - 2,
                width: rectWidth,
                height: rectHeight + 5,
                color: rgb(1, 1, 1),
                borderWidth: 1,
                borderColor: rgb(1, 1, 1),
              });

              page.drawImage(logoImage, {
                x: rectX - 20,
                y: rectY + 6,
                width: 20,
                height: 10,
              });

              const barcodeImage = await pdfDoc.embedPng(barcodeDataUrl);
              page.drawImage(barcodeImage, {
                x: rectX,
                y: rectY,
                width: barcodeImage.width - 200,
                height: barcodeImage.height - 40,
              });

              page.drawText(radicadoText, {
                x: rectX + 65,
                y: rectY + 7,
                size: 8,
                font,
                color: rgb(0, 0, 0),
              });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            saveAs(blob, `${baseNumber} - ${archivo_pdf.nombre}`);

            toast({
              title: 'PDF generado',
              description: 'El archivo PDF ha sido modificado y descargado.',
            });

            void refetch();

            form.reset({
              archivo_pdf: undefined,
              numero_radicado: nextRadicado ?? '',
              fecha: new Date().toISOString(),
              titulo: '',
              responsable: '',
              position: 'top-right',
            });

            setOriginalBase64(null);
            setIsLoadingGeneratePdf(false);
          } catch (error) {
            console.error('Error al procesar el archivo PDF:', error);

            // Realizar solicitud para revertir la creación del radicado
            try {
              revertRadicadoMutation.mutate(numero_radicado, {
                onSuccess: () => {
                  toast({
                    title: 'Radicado revertido',
                    description:
                      'Se revirtió la creación del radicado debido a un error en el PDF.',
                  });

                  setIsLoadingGeneratePdf(false);
                },
                onError: (revertError) => {
                  console.error('Error al revertir el radicado:', revertError);
                  toast({
                    title: 'Error crítico',
                    description:
                      'No se pudo revertir la creación del radicado. Contacta al soporte.',
                  });

                  setIsLoadingGeneratePdf(false);
                },
              });
            } catch (revertError) {
              console.error('Error al revertir el radicado:', revertError);
              toast({
                title: 'Error crítico',
                description:
                  'No se pudo revertir la creación del radicado. Contacta al soporte.',
              });

              setIsLoadingGeneratePdf(false);
            }

            if ((error as Error).message.includes('PDF')) {
              toast({
                title: 'Error en el archivo',
                description: 'El archivo proporcionado no es un PDF válido.',
              });
            } else {
              toast({
                title: 'Error desconocido',
                description:
                  'Ocurrió un problema inesperado al procesar el archivo.',
              });

              setIsLoadingGeneratePdf(false);
            }
          }
        },
        onError(error) {
          const axiosError = error as { response?: { status: number } };
          switch (axiosError.response?.status) {
            case 400:
              toast({
                title: 'Error de validación',
                description: 'Por favor, verifica los datos ingresados.',
              });
              break;
            case 500:
              toast({
                title: 'Error del servidor',
                description: 'Ocurrió un error al procesar la solicitud.',
              });
              break;
            default:
              toast({
                title: 'Error desconocido',
                description: 'Ocurrió un error desconocido.',
              });
              break;
          }

          setIsLoadingGeneratePdf(false);
        },
      },
    );
  };

  const handleDrop = (
    acceptedFiles: File[],
    onChange: (value: any) => void,
  ) => {
    const file = acceptedFiles[0];

    // Validar el tamaño del archivo
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Archivo demasiado grande',
        description: 'El archivo no debe exceder los 10 MB.',
      });
      return;
    }

    const reader = new FileReader();

    setOriginalBase64(URL.createObjectURL(file));

    reader.onload = async () => {
      const base64 = reader.result as string;
      const base64String = base64.split(',')[1];
      const binaryData = atob(base64String);
      const uint8Array = new Uint8Array(
        binaryData.split('').map((char) => char.charCodeAt(0)),
      );

      try {
        const pdfDoc = await PDFDocument.load(uint8Array, {
          ignoreEncryption: false, // Permite detectar archivos cifrados
        });

        if (pdfDoc.isEncrypted) {
          toast({
            title: 'Archivo cifrado detectado',
            description:
              'Por favor, elimine la encriptación antes de subir el archivo.',
          });
          return;
        }

        const [type, extension] = file.type.split('/');

        onChange({
          nombre: file.name,
          type,
          size: file.size,
          extension,
          base64: base64String,
        });
      } catch (error) {
        toast({
          title: 'Error al leer el archivo',
          description:
            'No se pudo procesar el archivo. Asegúrese de que sea un PDF válido y no esté cifrado.',
        });
        console.error('Error al procesar el archivo:', error);
      }
    };

    reader.onerror = () => {
      toast({
        title: 'Error al leer el archivo',
        description: 'Hubo un problema al procesar el archivo.',
      });
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    // Limpiar el archivo del estado del formulario
    setValue('archivo_pdf', undefined);
  };

  const updatedFile = watch('archivo_pdf');

  return (
    <>
      <div className="flex flex-col gap-3 justify-center items-center  w-screen max-w-screen-xl">
        <div className="flex flex-row justify-between items-center w-screen max-w-screen-xl">
          <h1 className="text-3xl font-bold w-full">Generar PDF con sticker</h1>
          <div className="flex flex-row gap-4 justify-center items-center">
            <Button
              className="bg-greyScale-surface-default 
           hover:bg-greyScale-surface-disabled rounded-lg text-greyScale-text-body w-[120px] p-3"
              onClick={() => {
                // Refetch para actualizar el número de radicado
                void refetch();

                form.reset({
                  archivo_pdf: undefined,
                  numero_radicado: nextRadicado ?? '',
                  fecha: new Date().toISOString(),
                  titulo: '',
                  responsable: '',
                });

                setOriginalBase64(null);
              }}
            >
              Reiniciar
            </Button>

            <Button
              className="bg-primaryVariant-surface-default hover:bg-primaryVariant-surface-darker rounded-lg text-greyScale-text-negative w-[150px] p-3 px-4"
              onClick={form.handleSubmit(onSubmit)}
              disabled={
                !form.formState.isValid ||
                updatedFile === undefined ||
                createRadicadoMutation.isLoading ||
                form.formState.isSubmitting ||
                !nextRadicado ||
                isLoadingGeneratePdf
              }
            >
              Generar PDF
            </Button>
          </div>
        </div>
        <>
          <div className="w-full overflow-x-auto p-10 mb-10 bg-white rounded-lg">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <h2 className="text-xl font-semibold">Archivo PDF</h2>
                <div className="flex flex-row items-center justify-between w-full gap-10">
                  <FormField
                    control={form.control}
                    name="archivo_pdf"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="flex flex-row items-center gap-2">
                          <span>Archivo PDF</span>
                        </FormLabel>
                        <FormDescription>
                          Sube un archivo PDF para generar un nuevo documento
                          con un sticker, dicho archivo no debe exceder los 10
                          MB y no debe estar cifrado/encriptado el contenido.
                        </FormDescription>
                        <FormControl>
                          {updatedFile ? (
                            <div className="relative flex flex-col gap-4 items-start bg-gray-100 rounded p-4">
                              <div className="flex flex-row gap-2 items-center w-full">
                                <div className="flex items-center justify-center w-12 h-12 bg-primaryVariant-surface-default rounded-full">
                                  <FileText className="size-6 text-white" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-sm">
                                    Nombre: {updatedFile.nombre ?? 'N/A'}
                                  </span>
                                  <span className="text-sm">
                                    Tamaño:{' '}
                                    {updatedFile.size
                                      ? (updatedFile.size / 1024).toFixed(2)
                                      : 'N/A'}{' '}
                                    KB
                                  </span>
                                </div>
                                {/* Botón para eliminar archivo */}
                                <button
                                  onClick={() => {
                                    handleRemoveFile();
                                  }}
                                  className="ml-auto w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 focus:outline-none"
                                  aria-label="Eliminar archivo"
                                >
                                  <span className="text-xl">×</span>
                                </button>
                              </div>
                              {/* Previsualización del PDF */}
                              <div className="w-full h-[400px] border border-gray-300 rounded overflow-hidden">
                                <iframe
                                  src={originalBase64!}
                                  className="w-full h-full"
                                  title="Vista previa del archivo PDF"
                                />
                              </div>
                            </div>
                          ) : (
                            <Dropzone
                              accept={{ 'application/pdf': ['.pdf'] }} // Solo acepta PDFs
                              maxSize={10 * 1024 * 1024} // Límite de 10 MB
                              onDrop={(acceptedFiles) => {
                                if (
                                  acceptedFiles.length > 0 &&
                                  acceptedFiles[0].type === 'application/pdf'
                                ) {
                                  handleDrop(acceptedFiles, field.onChange);
                                } else {
                                  form.setError('archivo_pdf', {
                                    type: 'manual',
                                    message: 'El archivo debe ser un PDF.',
                                  });
                                }
                              }}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <h2 className="text-xl font-semibold">Datos del documento</h2>
                <div className="flex flex-col w-full gap-8">
                  {/* Numero de radicado y Fecha */}
                  <div className="flex flex-row items-center justify-between w-full gap-10">
                    <FormField
                      control={form.control}
                      name="numero_radicado"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel className="flex flex-row items-center gap-2">
                            <span>Numero de radicado</span>
                            {/* <Asterisk className="text-red-500 size-4" /> */}
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled
                              placeholder="Numero de radicado"
                              interiorBg="bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fecha"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-1/2">
                          <FormLabel>Fecha del documento</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  disabled
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP', { locale: es })
                                  ) : (
                                    <span>Fecha del documento</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={new Date(field.value ?? '')}
                                onSelect={(date) => {
                                  setValue(
                                    'fecha',
                                    (date ?? new Date()).toISOString(),
                                  );
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Titulo documento y Responsable */}
                  <div className="flex flex-row items-center justify-between w-full gap-10">
                    <FormField
                      control={form.control}
                      name="titulo"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="flex flex-row items-center gap-2">
                            <span>Titulo documento</span>
                            <Asterisk className="text-red-500 size-4" />
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Titulo documento"
                              interiorBg="bg-white"
                              {...field}
                              maxLength={250}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="responsable"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="flex flex-row items-center gap-2">
                            <span>Responsable</span>
                            <Asterisk className="text-red-500 size-4" />
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Responsable"
                              interiorBg="bg-white"
                              maxLength={250}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Posición del sticker */}
                  <div className="flex flex-row items-center justify-between w-full gap-10">
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel className="flex flex-row items-center gap-2">
                            <span>Posición del sticker</span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona una opción" />
                              </SelectTrigger>
                              <SelectContent>
                                {positionOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </>
      </div>
    </>
  );
}
