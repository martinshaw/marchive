/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: 06-add-url-column-to-source-domains-table.ts
Created:  2023-09-05T23:48:52.522Z
Modified: 2023-09-05T23:48:52.522Z

Description: description
*/

import { DataTypes } from 'sequelize';
import { Migration } from '..';

const up: Migration = async ({ context }) => {
  await context.addColumn('source_domains', 'url', {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  });
};

const down: Migration = async ({ context }) => {
  await context.removeColumn('source_domains', 'url');
};

module.exports = { up, down };
