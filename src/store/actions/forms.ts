import { createAction } from '@reduxjs/toolkit';

// Acciones
const setUserId = createAction<string | null>('forms/setUserId');
const setIdRadicado = createAction<string | null>('forms/setIdRadicado');
const setIdDependencia = createAction<string | null>('forms/setIdDependencia');
const setIdTipoRadicado = createAction<string | null>(
  'forms/setIdTipoRadicado',
);

export { setIdDependencia, setIdRadicado, setIdTipoRadicado, setUserId };
