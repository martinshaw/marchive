/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: scheduleIntervalToCaption.ts
Created:  2023-10-02T14:25:40.607Z
Modified: 2023-10-02T14:25:40.607Z

Description: description
*/

const scheduleIntervalToCaption = (interval: number): string => {
  let timeCaption = Math.ceil(interval / 60) + ' mins.'
  if ((Math.ceil(interval / 60)) >= 120) timeCaption = Math.ceil(interval / 3600) + ' hrs.';
  if ((Math.ceil(interval / 3600)) >= 48) timeCaption = Math.ceil(interval / 86400) + ' days.';
  if ((Math.ceil(interval / 86400)) >= 14) timeCaption = Math.ceil(interval / 604800) + ' weeks.';
  if ((Math.ceil(interval / 604800)) >= 8) timeCaption = Math.ceil(interval / 2419200) + ' months.';
  if ((Math.ceil(interval / 2419200)) >= 12) timeCaption = Math.ceil(interval / 29030400) + ' years.';

  return timeCaption;
}

export default scheduleIntervalToCaption;
