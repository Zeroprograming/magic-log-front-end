interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  email: string;
  password: string;
}

interface IUserRole {
  id: number;
  name: string;
}

interface IProduct {
  id: number;
  name: string;
}

interface ICartItem {
  id: number;
  product: IProduct | null; // Producto puede ser null si ha sido eliminado
  quantity: number;
}

interface ICart {
  id: number;
  items: ICartItem[];
}

interface IUserProfile {
  id: number;
  email: string;
  role: IUserRole | null; // Role puede ser null si el usuario no tiene un rol asignado
  cart?: ICart | null; // Cart puede ser null si no existe un carrito asociado
}

export type {
  ICart,
  ICartItem,
  IProduct,
  IUserProfile,
  IUserRole,
  LoginFormData,
  RegisterFormData,
};
