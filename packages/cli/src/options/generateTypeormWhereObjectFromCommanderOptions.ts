/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: generateTypeormWhereObjectFromCommanderOptions.ts
Created:  2024-02-02T00:08:21.283Z
Modified: 2024-02-02T00:08:21.283Z

Description: description
*/

import { Command, Option } from "commander";
import {
  And,
  BaseEntity,
  Between,
  Equal,
  FindOperator,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from "database";
import { pascalCase, kebabCase, capitalCase } from "change-case";

type GenerateTypeormWhereObjectFromCommanderOptionsColumnsParameterType = {
  [columnName: string]: {
    type: "string" | "boolean" | "integer" | "date";
    nullable?: boolean;
    values?: string[];
  };
};

type GenerateTypeormWhereObjectFromCommanderOptionsAddTypeormWhereCommanderOptionsFunctionType =
  (command: Command) => Command;

type GenerateTypeormWhereObjectFromCommanderOptionsDetermineTypeormWhereObjectFromCommanderOptionsFunctionType<
  TEntityType extends BaseEntity
> = (optionsAndArguments: {
  [key: string]: string | number | boolean;
}) => FindOptionsWhere<TEntityType>;

const generateTypeormWhereObjectFromCommanderOptions: <
  TEntityType extends BaseEntity
>(
  columns: GenerateTypeormWhereObjectFromCommanderOptionsColumnsParameterType
) => [
  GenerateTypeormWhereObjectFromCommanderOptionsAddTypeormWhereCommanderOptionsFunctionType,
  GenerateTypeormWhereObjectFromCommanderOptionsDetermineTypeormWhereObjectFromCommanderOptionsFunctionType<TEntityType>
] = <TEntityType extends BaseEntity>(
  columns: GenerateTypeormWhereObjectFromCommanderOptionsColumnsParameterType
) => {
  const addTypeormWhereCommanderOptions: GenerateTypeormWhereObjectFromCommanderOptionsAddTypeormWhereCommanderOptionsFunctionType =
    (command) => {
      Object.entries(columns).forEach((column) => {
        const [columnName, columnOptions] = column;
        const columnNameKebabCase = kebabCase(columnName);
        const columnNameCapitalCase = capitalCase(columnName);

        let optionValues =
          columnOptions?.values != null
            ? ` (available values: ${columnOptions.values.join(" | ")})`
            : "";

        command = command.addOption(
          new Option(
            `--where-${columnNameKebabCase}-eq <value>`,
            `Filter by ${columnNameCapitalCase} equals value ${optionValues}`
          )
        );

        command = command.addOption(
          new Option(
            `--where-${columnNameKebabCase}-not-eq <value>`,
            `Filter by ${columnNameCapitalCase} does not equal value ${optionValues}`
          )
        );

        if (columnOptions.nullable === true) {
          command = command.addOption(
            new Option(
              `--where-${columnNameKebabCase}-null`,
              `Filter by ${columnNameCapitalCase} is null`
            )
          );

          command = command.addOption(
            new Option(
              `--where-${columnNameKebabCase}-not-null`,
              `Filter by ${columnNameCapitalCase} is not null`
            )
          );
        }

        if (columnOptions.type === "string") {
          command = command.addOption(
            new Option(
              `--where-${columnNameKebabCase}-like <value>`,
              `Filter by ${columnNameCapitalCase} contains value (case-insensitive)`
            )
          );

          command = command.addOption(
            new Option(
              `--where-${columnNameKebabCase}-not-like <value>`,
              `Filter by ${columnNameCapitalCase} does not contain value (case-insensitive)`
            )
          );

          command = command.addOption(
            new Option(
              `--where-${columnNameKebabCase}-in <values>`,
              `Filter by ${columnNameCapitalCase} is in list of values (comma-separated)`
            )
          );
        }

        if (columnOptions.type === "integer") {
          command = command.addOption(
            new Option(
              `--where-${columnNameKebabCase}-lt <value>`,
              `Filter by ${columnNameCapitalCase} is less than value`
            )
          );

          command = command.addOption(
            new Option(
              `--where-${columnNameKebabCase}-lt-eq <value>`,
              `Filter by ${columnNameCapitalCase} is less than or equal to value`
            )
          );

          command = command.addOption(
            new Option(
              `--where-${columnNameKebabCase}-gt <value>`,
              `Filter by ${columnNameCapitalCase} is greater than value`
            )
          );

          command = command.addOption(
            new Option(
              `--where-${columnNameKebabCase}-gt-eq <value>`,
              `Filter by ${columnNameCapitalCase} is greater than or equal to value`
            )
          );

          command = command.addOption(
            new Option(
              `--where-${columnNameKebabCase}-between <values>`,
              `Filter by ${columnNameCapitalCase} is between two values (two comma-separated values)`
            )
          );

          command = command.addOption(
            new Option(
              `--where-${columnNameKebabCase}-not-between <values>`,
              `Filter by ${columnNameCapitalCase} is not between two values (two comma-separated values)`
            )
          );

          command = command.addOption(
            new Option(
              `--where-${columnNameKebabCase}-in <values>`,
              `Filter by ${columnNameCapitalCase} is in list of values (comma-separated)`
            )
          );

          command = command.addOption(
            new Option(
              `--where-${columnNameKebabCase}-not-in <values>`,
              `Filter by ${columnNameCapitalCase} is not in list of values (comma-separated)`
            )
          );
        }
      });

      return command;
    };

  const determineTypeormWhereObjectFromCommanderOptions: GenerateTypeormWhereObjectFromCommanderOptionsDetermineTypeormWhereObjectFromCommanderOptionsFunctionType<
    TEntityType
  > = (optionsAndArguments) => {
    let filtersGroupedByColumn: {
      [key: string]: FindOperator<any>[];
    } = {};

    Object.entries(columns).forEach((column) => {
      const [columnName, columnOptions] = column;
      const columnNamePascalCase = pascalCase(columnName);

      filtersGroupedByColumn[columnName] = [];

      if (
        optionsAndArguments[`where${columnNamePascalCase}Eq`] != null &&
        typeof optionsAndArguments[`where${columnNamePascalCase}Eq`] ===
          "string"
      ) {
        filtersGroupedByColumn[columnName].push(
          Equal(optionsAndArguments[`where${columnNamePascalCase}Eq`])
        );
      }

      if (
        optionsAndArguments[`where${columnNamePascalCase}NotEq`] != null &&
        typeof optionsAndArguments[`where${columnNamePascalCase}NotEq`] ===
          "string"
      ) {
        filtersGroupedByColumn[columnName].push(
          Not(Equal(optionsAndArguments[`where${columnNamePascalCase}NotEq`]))
        );
      }

      if (optionsAndArguments[`where${columnNamePascalCase}Null`] === true) {
        filtersGroupedByColumn[columnName].push(IsNull());
      }

      if (optionsAndArguments[`where${columnNamePascalCase}NotNull`] === true) {
        filtersGroupedByColumn[columnName].push(Not(IsNull()));
      }

      if (columnOptions.type === "string") {
        if (
          optionsAndArguments[`where${columnNamePascalCase}Like`] != null &&
          typeof optionsAndArguments[`where${columnNamePascalCase}Like`] ===
            "string"
        ) {
          filtersGroupedByColumn[columnName].push(
            ILike(optionsAndArguments[`where${columnNamePascalCase}Like`])
          );
        }

        if (
          optionsAndArguments[`where${columnNamePascalCase}NotLike`] != null &&
          typeof optionsAndArguments[`where${columnNamePascalCase}NotLike`] ===
            "string"
        ) {
          filtersGroupedByColumn[columnName].push(
            Not(
              ILike(optionsAndArguments[`where${columnNamePascalCase}NotLike`])
            )
          );
        }

        if (optionsAndArguments[`where${columnNamePascalCase}In`] != null) {
          const inValuesString =
            optionsAndArguments[`where${columnNamePascalCase}In`];

          if (typeof inValuesString === "string") {
            filtersGroupedByColumn[columnName].push(
              In(inValuesString.split(","))
            );
          }
        }
      }

      if (columnOptions.type === "integer") {
        if (
          optionsAndArguments[`where${columnNamePascalCase}Lt`] != null &&
          ["number", "string"].includes(
            typeof optionsAndArguments[`where${columnNamePascalCase}Lt`]
          )
        ) {
          filtersGroupedByColumn[columnName].push(
            LessThan(
              parseFloat(
                optionsAndArguments[`where${columnNamePascalCase}Lt`] + ""
              )
            )
          );
        }

        if (
          optionsAndArguments[`where${columnNamePascalCase}LtEq`] != null &&
          ["number", "string"].includes(
            typeof optionsAndArguments[`where${columnNamePascalCase}LtEq`]
          )
        ) {
          filtersGroupedByColumn[columnName].push(
            LessThanOrEqual(
              parseFloat(
                optionsAndArguments[`where${columnNamePascalCase}LtEq`] + ""
              )
            )
          );
        }

        if (
          optionsAndArguments[`where${columnNamePascalCase}Gt`] != null &&
          ["number", "string"].includes(
            typeof optionsAndArguments[`where${columnNamePascalCase}Gt`]
          )
        ) {
          filtersGroupedByColumn[columnName].push(
            MoreThan(
              parseFloat(
                optionsAndArguments[`where${columnNamePascalCase}Gt`] + ""
              )
            )
          );
        }

        if (
          optionsAndArguments[`where${columnNamePascalCase}GtEq`] != null &&
          ["number", "string"].includes(
            typeof optionsAndArguments[`where${columnNamePascalCase}GtEq`]
          )
        ) {
          filtersGroupedByColumn[columnName].push(
            MoreThanOrEqual(
              parseFloat(
                optionsAndArguments[`where${columnNamePascalCase}GtEq`] + ""
              )
            )
          );
        }

        if (
          optionsAndArguments[`where${columnNamePascalCase}Between`] != null &&
          typeof optionsAndArguments[`where${columnNamePascalCase}Between`] ===
            "string"
        ) {
          const betweenValuesString =
            optionsAndArguments[`where${columnNamePascalCase}Between`];
          if (typeof betweenValuesString === "string") {
            const betweenValues = betweenValuesString.split(",");
            if (betweenValues.length === 2) {
              filtersGroupedByColumn[columnName].push(
                Between(
                  parseFloat(betweenValues[0]),
                  parseFloat(betweenValues[1])
                )
              );
            }
          }
        }

        if (
          optionsAndArguments[`where${columnNamePascalCase}NotBetween`] !=
            null &&
          typeof optionsAndArguments[
            `where${columnNamePascalCase}NotBetween`
          ] === "string"
        ) {
          const notBetweenValuesString =
            optionsAndArguments[`where${columnNamePascalCase}NotBetween`];
          if (typeof notBetweenValuesString === "string") {
            const notBetweenValues = notBetweenValuesString.split(",");
            if (notBetweenValues.length === 2) {
              filtersGroupedByColumn[columnName].push(
                Not(
                  Between(
                    parseFloat(notBetweenValues[0]),
                    parseFloat(notBetweenValues[1])
                  )
                )
              );
            }
          }
        }

        if (optionsAndArguments[`where${columnNamePascalCase}In`] != null) {
          const inValuesString =
            optionsAndArguments[`where${columnNamePascalCase}In`];

          if (typeof inValuesString === "string") {
            filtersGroupedByColumn[columnName].push(
              In(inValuesString.split(","))
            );
          }
        }

        if (optionsAndArguments[`where${columnNamePascalCase}NotIn`] != null) {
          const notInValuesString =
            optionsAndArguments[`where${columnNamePascalCase}NotIn`];

          if (typeof notInValuesString === "string") {
            filtersGroupedByColumn[columnName].push(
              Not(In(notInValuesString.split(",")))
            );
          }
        }
      }
    });

    const where: FindOptionsWhere<TEntityType> = Object.fromEntries(
      Object.entries(filtersGroupedByColumn)
        .filter(([columnName, filters]) => filters.length > 0)
        .map(([columnName, filters]) => [
          columnName,
          And<string | number | boolean>(...filters),
        ])
    ) as FindOptionsWhere<TEntityType>;

    return where;
  };

  return [
    addTypeormWhereCommanderOptions,
    determineTypeormWhereObjectFromCommanderOptions,
  ];
};

export default generateTypeormWhereObjectFromCommanderOptions;
export {
  type GenerateTypeormWhereObjectFromCommanderOptionsColumnsParameterType,
  type GenerateTypeormWhereObjectFromCommanderOptionsAddTypeormWhereCommanderOptionsFunctionType,
  type GenerateTypeormWhereObjectFromCommanderOptionsDetermineTypeormWhereObjectFromCommanderOptionsFunctionType,
};
