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
  OneToMany,
} from "typeorm";
import Source from "./Source";
import { SourceDomainEntityType } from "database-types";

/**
 * A source domain is the website or domain which a source's URL belongs to.
 *
 * So if a Source's URL is https://www.example.com/ then the many-to-one
 *   associated Source Domain has the name 'example.com' and a path to
 *   example.com's favicon.
 *
 * As well as being visually helpful in the UI, this allows us to
 *   group sources by domain.
 */
@Entity()
class SourceDomain extends BaseEntity implements SourceDomainEntityType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: "text",
    nullable: true,
  })
  url: string | null = null;

  @Column({
    type: "text",
    nullable: true,
  })
  faviconPath: string | null = null;

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

  @OneToMany(() => Source, (source) => source.sourceDomain)
  sources: Source[];
}

export default SourceDomain;
