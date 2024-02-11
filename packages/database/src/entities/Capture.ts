/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Capture.ts
Created:  2024-01-29T11:27:48.436Z
Modified: 2024-01-29T11:27:48.436Z

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
import { Schedule, CapturePart } from "..";
import { CaptureEntityType } from "common-types";

@Entity()
class Capture extends BaseEntity implements CaptureEntityType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
    nullable: false,
  })
  downloadLocation: string;

  @Column({
    type: "integer",
    nullable: false,
    default: 3,
  })
  allowedRetriesCount: number;

  @Column({
    type: "boolean",
    nullable: false,
    default: false,
  })
  deletedFromDownloads: boolean;

  @CreateDateColumn({
    type: "datetime",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "datetime",
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: "datetime",
    nullable: true,
  })
  deletedAt: Date | null;

  @Column({
    type: "integer",
    nullable: true,
  })
  scheduleId: number | null;

  @ManyToOne(() => Schedule, (schedule) => schedule.source)
  schedule: Schedule;

  @OneToMany(() => CapturePart, (capturePart) => capturePart.capture)
  captureParts: CapturePart[];
}

export default Capture;
