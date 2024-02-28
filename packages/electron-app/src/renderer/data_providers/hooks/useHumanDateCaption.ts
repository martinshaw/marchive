/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useHumanDateCaption.ts
Created:  2023-09-12T02:55:05.307Z
Modified: 2023-09-12T02:55:05.307Z

Description: description
*/

import dayjs from 'dayjs';

const useHumanDateCaption: (
  date: Date | string,
  withTime: boolean,
) => string = (date, withTime = true) => {
  const dateNow = new Date();

  // TODO: Use dayjs to handle date parsing instead of JavaScript's built-in Date object
  date = typeof date === 'string' ? dayjs(date).toDate() : date;

  const dateIsToday =
    dateNow.getFullYear() === date.getFullYear() &&
    dateNow.getMonth() === date.getMonth() &&
    dateNow.getDate() === date.getDate();
  const dateIsYesterday =
    dateNow.getFullYear() === date.getFullYear() &&
    dateNow.getMonth() === date.getMonth() &&
    dateNow.getDate() === date.getDate() - 1;

  let dateCaption = date.toLocaleDateString();
  if (dateIsToday) dateCaption = 'Today';
  if (dateIsYesterday) dateCaption = 'Yesterday';
  if (withTime) dateCaption += ' at ' + date.toLocaleTimeString();

  return dateCaption;
};

export default useHumanDateCaption;
