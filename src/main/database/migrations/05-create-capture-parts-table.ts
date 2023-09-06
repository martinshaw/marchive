/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: 05-create-capture-parts-table.js
Created:  2023-09-04T04:51:56.084Z
Modified: 2023-09-04T04:51:56.084Z

Description: description
*/

import { DataTypes } from "sequelize";
import { Migration } from "..";

const up: Migration = async ({ context }) => {
	await context.createTable('capture_parts', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
		},
		url: {
      type: DataTypes.STRING,
      allowNull: false,
		},
		dataProviderPartIdentifier: {
      type: DataTypes.STRING,
      allowNull: false,
		},
		payload: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: '{}',
		},
    currentRetryCount: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
    deletedFromDownloads: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    captureId: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		deletedAt: {
			type: DataTypes.DATE,
			allowNull: true
		}
	});
}

const down: Migration = async ({ context }) => {
	await context.dropTable('capture_parts');
}

module.exports = { up, down };
