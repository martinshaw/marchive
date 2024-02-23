/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: breakpoints.ts
Created:  2024-02-23T19:29:07.603Z
Modified: 2024-02-23T19:29:07.603Z

Description: description
*/

const breakpoints = {
  base: 0,
  extraSmall: 384,
  small: 576,
  medium: 768,
  large: 992,
  extraLarge: 1200,
  "2xl": 1440,
  "3xl": 1920,
  "4xl": 2560,
  "5xl": 3840,
} as const;

type Breakpoints = typeof breakpoints;
type BreakpointNames = keyof Breakpoints;
type BreakpointValues = Breakpoints[BreakpointNames];

export { breakpoints, type BreakpointNames, type BreakpointValues };
export default Breakpoints;
