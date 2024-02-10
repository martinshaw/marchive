/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Source.js
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
import { Schedule, SourceDomain } from "..";
import { SourceEntityType } from "database-types";
import { SourceUseStartOrEndCursorValueType } from "database-types/src/entities/Source";

@Entity()
class Source extends BaseEntity implements SourceEntityType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
    nullable: false,
  })
  dataProviderIdentifier: string;

  @Column({
    type: "text",
    nullable: false,
  })
  url: string;

  @Column({
    type: "text",
    nullable: true,
  })
  name: string | null;

  @Column({
    type: "text",
    nullable: true,
  })
  currentStartCursorUrl: string | null;

  @Column({
    type: "text",
    nullable: true,
  })
  currentEndCursorUrl: string | null;

  @Column({
    type: "text",
    nullable: true,
    default: null,
  })
  useStartOrEndCursor: SourceUseStartOrEndCursorValueType;

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
  sourceDomainId: number | null;

  @ManyToOne(() => SourceDomain, (sourceDomain) => sourceDomain.sources)
  sourceDomain: SourceDomain;

  @OneToMany(() => Schedule, (schedule) => schedule.source)
  schedules: Schedule[];
}

export default Source;
