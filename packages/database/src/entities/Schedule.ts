/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Schedule.js
Created:  2023-06-21T16:32:11.327Z
Modified: 2023-06-21T16:32:11.327Z

Description: description
*/

import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Source, Capture } from "..";

const scheduleStatuses = ["pending", "processing", "cancelled"] as const;
export type ScheduleStatus = (typeof scheduleStatuses)[number];

@Entity()
class Schedule extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
    nullable: false,
    default: "pending",
  })
  status: ScheduleStatus;

  @Column({
    type: "integer",
    nullable: true,
    default: null,
  })
  interval: number | null;

  @Column({
    type: "date",
    nullable: true,
    default: null,
  })
  lastRunAt: Date | null;

  @Column({
    type: "date",
    nullable: true,
    default: null,
  })
  nextRunAt: Date | null;

  @Column({
    type: "text",
    nullable: false,
  })
  downloadLocation: string;

  @Column({
    type: "boolean",
    nullable: false,
    default: true,
  })
  enabled: boolean;

  @Column({
    type: "boolean",
    nullable: false,
    default: false,
  })
  deletedFromDownloads: boolean;

  @CreateDateColumn({
    type: "date",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "date",
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: "date",
    nullable: true,
  })
  deletedAt: Date | null;

  @Column({
    type: "integer",
    nullable: true,
  })
  sourceId: number | null;

  @ManyToOne(() => Source, (source) => source.schedules)
  source: Source;

  @OneToMany(() => Capture, (capture) => capture.schedule)
  captures: Capture[];
}

export default Schedule;
