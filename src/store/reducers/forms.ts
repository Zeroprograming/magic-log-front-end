/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createReducer } from '@reduxjs/toolkit';

import {
  setIdDependencia,
  setIdRadicado,
  setIdTipoRadicado,
  setUserId,
} from '@/store/';
// Define el estado inicial
interface FormsState {
  userId: string | null;
  id_radicado: string | null;
  id_trd_dependencia: string | null;
  id_tipo_radicado: string | null;
}

// Estado inicial
const initialFormsState: FormsState = {
  userId: null,
  id_radicado: null,
  id_trd_dependencia: null,
  id_tipo_radicado: null,
};

// Reducer
export const formsReducer = createReducer(initialFormsState, (builder) => {
  builder.addCase(setUserId, (state, action) => {
    state.userId = action.payload;
  });
  builder.addCase(setIdRadicado, (state, action) => {
    state.id_radicado = action.payload;
  });

  builder.addCase(setIdDependencia, (state, action) => {
    state.id_trd_dependencia = action.payload;
  });

  builder.addCase(setIdTipoRadicado, (state, action) => {
    state.id_tipo_radicado = action.payload;
  });
});
