/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: connection.js
Created:  2023-06-21T16:35:12.470Z
Modified: 2023-06-21T16:35:12.470Z

Description: description
*/

import { app } from 'electron';
import path from 'path';
import { Sequelize } from 'sequelize-typescript';

// Sequelize is a library that helps us to connect to databases also known as an ORM (Object Relational Mapper)
//   It allows us to use nice JavaScript functions to interact with databases instead of SQL

// This also means that we can use any type of database we want, as long as Sequelize supports it and we don't
//   need to change our code.

const sequelize = new Sequelize({
  // We must specify the dialect (type) of database we are using
  // Sqlite is a simple database that stores all of its data in a single file (database.db) instead
  //   of having to install and setup a database server like with MySQL or PostgreSQL
  dialect: 'sqlite',

  // We must use the absolute path to the database file
  storage: path.resolve(app.getPath('userData'), './database.db'),

  // By default, Sequelize will log all SQL queries to the console. We don't want that on a nice command line tool.
  logging: false,
});

export default sequelize;
