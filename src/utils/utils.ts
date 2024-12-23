const convertirFechaISO = (fechaISO: string): string => {
  const fecha = new Date(fechaISO);
  const year = fecha.getFullYear().toString().slice(-2); // Últimos 2 dígitos del año
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Mes (de 1 a 12)
  const day = fecha.getDate().toString().padStart(2, '0'); // Día del mes
  const hours = fecha.getHours().toString().padStart(2, '0'); // Horas
  const minutes = fecha.getMinutes().toString().padStart(2, '0'); // Minutos
  const seconds = fecha.getSeconds().toString().padStart(2, '0'); // Segundos

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export { convertirFechaISO };
