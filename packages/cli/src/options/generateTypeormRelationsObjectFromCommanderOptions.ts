/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: generateTypeormRelationsObjectFromCommanderOptions.ts
Created:  2024-02-02T00:08:21.283Z
Modified: 2024-02-02T00:08:21.283Z

Description: description
*/

import { Command, Option } from "commander";
import { BaseEntity, FindOptionsRelations } from "database";
import { pascalCase, kebabCase, capitalCase } from "change-case-commonjs";

type GenerateTypeormRelationsObjectFromCommanderOptionsColumnsParameterType<
  TEntityType extends BaseEntity
> = (keyof TEntityType)[];

type GenerateTypeormRelationsObjectFromCommanderOptionsAddTypeormRelationsCommanderOptionsFunctionType =
  (command: Command) => Command;

type GenerateTypeormRelationsObjectFromCommanderOptionsDetermineTypeormRelationsObjectFromCommanderOptionsFunctionType<
  TEntityType extends BaseEntity
> = (optionsAndArguments: {
  [key: string]: string | number | boolean;
}) => FindOptionsRelations<TEntityType>;

const generateTypeormRelationsObjectFromCommanderOptions: <
  TEntityType extends BaseEntity
>(
  columns: GenerateTypeormRelationsObjectFromCommanderOptionsColumnsParameterType<TEntityType>
) => [
  GenerateTypeormRelationsObjectFromCommanderOptionsAddTypeormRelationsCommanderOptionsFunctionType,
  GenerateTypeormRelationsObjectFromCommanderOptionsDetermineTypeormRelationsObjectFromCommanderOptionsFunctionType<TEntityType>
] = <TEntityType extends BaseEntity>(
  columns: GenerateTypeormRelationsObjectFromCommanderOptionsColumnsParameterType<TEntityType>
) => {
  const addTypeormRelationsCommanderOptions: GenerateTypeormRelationsObjectFromCommanderOptionsAddTypeormRelationsCommanderOptionsFunctionType =
    (command) => {
      columns.forEach((columnName) => {
        if (typeof columnName !== "string") return;

        const columnNameKebabCase = kebabCase(columnName);
        const columnNameCapitalCase = capitalCase(columnName);

        command = command.addOption(
          new Option(
            `--with-${columnNameKebabCase}`,
            `Include ${columnNameCapitalCase}`
          )
        );
      });

      return command;
    };

  const determineTypeormRelationsObjectFromCommanderOptions: GenerateTypeormRelationsObjectFromCommanderOptionsDetermineTypeormRelationsObjectFromCommanderOptionsFunctionType<
    TEntityType
  > = (optionsAndArguments) => {
    const relations: FindOptionsRelations<TEntityType> = {};

    columns.forEach((columnName) => {
      if (typeof columnName !== "string") return;

      const columnNamePascalCase = pascalCase(columnName);

      if (
        optionsAndArguments[`with${columnNamePascalCase}`] != null &&
        ["boolean", "string"].includes(
          typeof optionsAndArguments[`with${columnNamePascalCase}`]
        )
      ) {
        if (
          optionsAndArguments[`with${columnNamePascalCase}`] === true ||
          optionsAndArguments[`with${columnNamePascalCase}`] === "true"
        ) {
          // TODO: Use the perfectly correct Typeorm type for `relations` and its key here. Not going to spend any more time implementing this good but non-essential feature.
          // @ts-ignore
          relations[columnName as keyof TEntityType] = true;
        }
      }
    });

    return relations;
  };

  return [
    addTypeormRelationsCommanderOptions,
    determineTypeormRelationsObjectFromCommanderOptions,
  ];
};

export default generateTypeormRelationsObjectFromCommanderOptions;
export {
  type GenerateTypeormRelationsObjectFromCommanderOptionsColumnsParameterType,
  type GenerateTypeormRelationsObjectFromCommanderOptionsAddTypeormRelationsCommanderOptionsFunctionType,
  type GenerateTypeormRelationsObjectFromCommanderOptionsDetermineTypeormRelationsObjectFromCommanderOptionsFunctionType,
};
