import { NextApiRequest, NextApiResponse } from 'next';

import dbDataSource from '@/pages/api/db'; // Conexión a la base de datos

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  if (!dbDataSource.isInitialized) {
    await dbDataSource.initialize();
  }
};

// Ruta para obtener el próximo número de radicado
export default async function getNextRadicadoNumber(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    // Inicializa la conexión con la base de datos
    await initializeDatabase();

    // Consulta el último radicado
    const [lastRadicado] = await dbDataSource.query(
      'SELECT numero_radicado FROM radicado ORDER BY id DESC LIMIT 1',
    );

    // Obtener el año actual
    const currentYear = new Date().getFullYear();

    // Validar y parsear el último número de radicado
    let nextSequence = 1; // Secuencia inicial si no hay radicados previos
    if (lastRadicado?.numero_radicado) {
      const radicadoParts = lastRadicado.numero_radicado.split('-'); // Dividir el radicado
      if (radicadoParts.length === 2) {
        const lastSequence = parseInt(radicadoParts[1], 10); // Extraer la parte secuencial
        if (!isNaN(lastSequence)) {
          nextSequence = lastSequence + 1; // Incrementar la secuencia
        }
      }
    }

    // Generar el número de radicado en el formato deseado
    const nextRadicado = `${currentYear}-${String(nextSequence).padStart(5, '0')}`;

    res.status(200).json({ nextRadicado });
  } catch (error) {
    console.error('Error generating next radicado number:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
