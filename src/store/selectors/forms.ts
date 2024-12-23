import { AppState } from '@/store/wrapper';

const getCurrentUserId = (state: AppState) => state.forms.userId;
const getCurrentIdRadicado = (state: AppState) => state.forms.id_radicado;
const getCurrentIdDependencia = (state: AppState) =>
  state.forms.id_trd_dependencia;
const getCurrentIdTipoRadicado = (state: AppState) =>
  state.forms.id_tipo_radicado;

export {
  getCurrentIdDependencia,
  getCurrentIdRadicado,
  getCurrentIdTipoRadicado,
  getCurrentUserId,
};
