/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useHumanDateCaption.ts
Created:  2023-09-12T02:55:05.307Z
Modified: 2023-09-12T02:55:05.307Z

Description: description
*/

const useHumanDateCaption: (date: Date) => string = (date) => {
  const dateNow = new Date();

  const dateIsToday = dateNow.getFullYear() === date.getFullYear() && dateNow.getMonth() === date.getMonth() && dateNow.getDate() === date.getDate();
  const dateIsYesterday = dateNow.getFullYear() === date.getFullYear() && dateNow.getMonth() === date.getMonth() && dateNow.getDate() === date.getDate() - 1;

  if (dateIsToday) {
    return 'Today at ' + date.toLocaleTimeString();
  } else if (dateIsYesterday) {
    return 'Yesterday at ' + date.toLocaleTimeString();
  } else {
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  }
}

export default useHumanDateCaption;
