/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: 01-create-stored-settings-table.ts
Created:  2023-09-04T04:51:56.084Z
Modified: 2023-09-04T04:51:56.084Z

Description: description
*/

import { Migration } from '..';
import { DataTypes } from 'sequelize';

const up: Migration = async ({ context }) => {
  await context.createTable('stored_settings', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
};

const down: Migration = async ({ context }) => {
  await context.dropTable('stored_settings');
};

module.exports = { up, down };