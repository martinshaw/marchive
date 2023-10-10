/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: 07-add-name-column-to-sources-table.ts
Created:  2023-09-05T23:48:52.522Z
Modified: 2023-09-05T23:48:52.522Z

Description: description
*/

import { DataTypes } from 'sequelize';
import { Migration } from '..';

const up: Migration = async ({ context }) => {
  await context.addColumn('sources', 'name', {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  });
};

const down: Migration = async ({ context }) => {
  await context.removeColumn('sources', 'name');
};

module.exports = { up, down };
