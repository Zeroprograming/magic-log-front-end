import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class Radicado {
  @PrimaryGeneratedColumn() // id autoincrementable (no afecta la lógica del radicado)
  id: number;

  @Column({ unique: true }) // El número de radicado debe ser único
  numero_radicado: string;

  @Column()
  titulo: string;

  @Column()
  responsable: string;

  @Column()
  fecha: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Radicado;
