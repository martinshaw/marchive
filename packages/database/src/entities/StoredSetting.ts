/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSetting.js
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
} from "typeorm";

export const storedSettingKeys = [
  "MARCHIVE_IS_SETUP",
  "ELECTRON_IS_USED",
  "WATCH_SCHEDULES_PROCESS_IS_PAUSED",
  "WATCH_CAPTURE_PARTS_PROCESS_IS_PAUSED",
];
export type StoredSettingKeyType = (typeof storedSettingKeys)[number];

const storedSettingTypes = ["string", "number", "boolean"];
export type StoredSettingTypeType = (typeof storedSettingTypes)[number];

export type StoredSettingEntityType = {
  key: StoredSettingKeyType;
  value: string;
  type: StoredSettingTypeType;
};

@Entity()
class StoredSetting extends BaseEntity implements StoredSettingEntityType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
    unique: true,
  })
  key: StoredSettingKeyType;

  @Column({
    type: "text",
  })
  value: string;

  @Column({
    type: "text",
    nullable: true,
  })
  type: StoredSettingTypeType;

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
}

export default StoredSetting;
