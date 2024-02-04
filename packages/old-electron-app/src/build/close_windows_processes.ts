/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: close_windows_processes.ts
Created:  2023-09-25T15:55:09.495Z
Modified: 2023-09-25T15:55:09.495Z

Description: description
*/

import process from 'node:process';
import child_process from 'node:child_process';

if (process.platform !== 'win32') process.exit(0);

const processesRunningOnSystem = child_process
  .execSync('wmic process get ProcessId,CommandLine /format:csv')
  .toString()
  .split('\n')
  .map((line) => line.trim())
  .filter(
    (line) =>
      line.length > 0 &&
      !line.startsWith('CommandLine') &&
      (line.includes(process.cwd()) || line.includes('node.exe')) &&
      line.includes('close_windows_processes') === false
  );

const PIDs = processesRunningOnSystem.map((line) => {
  const lineParts = line.split(',');
  return lineParts[lineParts.length - 1];
});

PIDs.forEach((PID) => {
  try {
    child_process.execSync(`taskkill /PID ${PID} /F /T`);
  } catch (error) {}
});
