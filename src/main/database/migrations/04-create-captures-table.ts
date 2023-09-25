/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: 04-create-captures-table.js
Created:  2023-09-04T04:51:56.084Z
Modified: 2023-09-04T04:51:56.084Z

Description: description
*/

import { DataTypes } from 'sequelize';
import { Migration } from '..';

const up: Migration = async ({ context }) => {
  await context.createTable('captures', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    downloadLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    allowedRetriesCount: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 3,
    },
    deletedFromDownloads: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    scheduleId: {
      type: DataTypes.NUMBER,
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
  await context.dropTable('captures');
};

module.exports = { up, down };
