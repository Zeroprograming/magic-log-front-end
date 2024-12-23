interface Storage {
  get: (key: string) => string | null;
  set: (key: string, value: string, expiresIn?: number) => void;
  delete: (key: string) => void;
}

export default Storage;
