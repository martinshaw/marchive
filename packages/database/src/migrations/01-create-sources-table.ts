/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: 01-create-sources-table.ts
Created:  2023-09-04T04:51:56.084Z
Modified: 2023-09-04T04:51:56.084Z

Description: description
*/

import { DataTypes } from 'sequelize';
import { Migration } from '..';

const up: Migration = async ({ context }) => {
  await context.createTable('sources', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    dataProviderIdentifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currentStartCursorUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentEndCursorUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    useStartOrEndCursor: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    sourceDomainId: {
      type: DataTypes.NUMBER,
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
  await context.dropTable('sources');
};

module.exports = { up, down };
