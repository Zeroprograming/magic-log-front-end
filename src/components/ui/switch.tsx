import React from 'react';

interface SwitchProps {
  isChecked: boolean; // Estado booleano
  onToggle: () => void; // Función para manejar el cambio de estado
  onLabel: string; // Texto cuando el switch está activado (true)
  offLabel: string; // Texto cuando el switch está desactivado (false)
  disabled?: boolean; // Propiedad opcional para deshabilitar el switch
}

const Switch: React.FC<SwitchProps> = ({
  isChecked,
  onToggle,
  onLabel,
  offLabel,
  disabled = false, // Valor por defecto de `disabled` es `false`
}) => {
  return (
    <div
      className={`relative flex flex-row bg-greyScale-text-negative rounded-full shadow-2xl gap-2 py-2 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onToggle}
        className={`opacity-0 absolute z-20 w-full h-full ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        disabled={disabled} // Aplica la propiedad disabled
      />

      <div className="flex items-center justify-center w-1/2 py-1 px-12 z-[1]">
        <span
          className={`text-base transition-colors duration-200 ${
            !isChecked ? 'text-white' : 'text-black'
          }`}
        >
          {offLabel}
        </span>
      </div>
      <div className="flex items-center justify-center w-1/2 py-1 px-12 z-[1]">
        <span
          className={`text-base transition-colors duration-200 ${
            isChecked ? 'text-white' : 'text-black'
          }`}
        >
          {onLabel}
        </span>
      </div>
      <div
        className={`absolute top-1/2 -translate-y-1/2 left-1 bg-primaryVariant-surface-default h-full rounded-full z-0 transform transition-transform duration-300 w-1/2 ${
          isChecked ? 'translate-x-[100%]' : 'translate-x-0'
        }`}
      ></div>
    </div>
  );
};

export default Switch;
