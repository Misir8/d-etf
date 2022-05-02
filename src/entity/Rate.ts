import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'rates',
})
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 5, scale: 2 })
  buyRate: number;

  @Column('decimal', { precision: 5, scale: 2 })
  sellRate: number;

  @Column({ default: false })
  isActive: boolean;
}
