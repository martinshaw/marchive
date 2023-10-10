/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: 01-create-source-domains-table.ts
Created:  2023-09-04T04:51:56.084Z
Modified: 2023-09-04T04:51:56.084Z

Description: description
*/

import { DataTypes } from 'sequelize';
import { Migration } from '..';

const up: Migration = async ({ context }) => {
  await context.createTable('source_domains', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    faviconPath: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
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
  await context.dropTable('source_domains');
};

module.exports = { up, down };
