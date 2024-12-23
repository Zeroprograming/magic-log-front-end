import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

import dbDataSource from '@/pages/api/db'; // Conexión a la base de datos
import User from '@/pages/api/entities/User'; // Tu entidad User

const SECRET_KEY = process.env.JWT_SECRET ?? 'supersecretkey';

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  if (!dbDataSource.isInitialized) {
    await dbDataSource.initialize();
  }
};

export default async function actualUserHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization token missing or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifica y decodifica el token
    const decodedToken = jwt.verify(token, SECRET_KEY) as { userId: string };

    // Inicializa la conexión con la base de datos
    await initializeDatabase();

    // Busca al usuario por su ID
    const user = await dbDataSource
      .getRepository(User)
      .findOneBy({ id: decodedToken.userId });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Retorna la información del usuario, excluyendo la contraseña
    const { password, ...userInfo } = user;

    res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}
