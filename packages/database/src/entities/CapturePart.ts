/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CapturePart.ts
Created:  2024-01-29T12:43:22.938Z
Modified: 2024-01-29T12:43:22.939Z

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
import { Capture } from "..";

const capturePartStatuses = [
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
];
export type CapturePartStatus = (typeof capturePartStatuses)[number];

@Entity()
class CapturePart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
    nullable: false,
    default: "pending" as CapturePartStatus,
  })
  status: CapturePartStatus;

  @Column({
    type: "text",
    nullable: false,
  })
  url: string;

  @Column({
    type: "text",
    nullable: false,
  })
  dataProviderPartIdentifier: string;

  @Column({
    type: "simple-json",
    nullable: false,
    default: "{}",
  })
  payload: string;

  @Column({
    type: "text",
    nullable: true,
    default: null,
  })
  downloadLocation: string;

  @Column({
    type: "integer",
    nullable: false,
    default: 0,
  })
  currentRetryCount: number;

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
  captureId: number | null;

  @ManyToOne(() => Capture, (capture) => capture.captureParts)
  capture: Capture;
}

export default CapturePart;
