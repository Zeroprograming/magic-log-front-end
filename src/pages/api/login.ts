import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

import db from '@/pages/api/db'; // Conexión a la base de datos
import User from '@/pages/api/entities/User'; // Tu entidad User

const SECRET_KEY = process.env.JWT_SECRET ?? 'supersecretkey';

const initializeDatabase = async () => {
  if (!db.isInitialized) {
    await db.initialize();
  }
};

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    // Inicializa la conexión con la base de datos si no está inicializada
    await initializeDatabase();

    // Busca al usuario por correo electrónico
    const user = await db.getRepository(User).findOneBy({ email });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Verifica la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Genera un token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '12h' }, // Expira en 12 horas
    );

    res.status(200).json({ access_token: token, token_type: 'bearer' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
