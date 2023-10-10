/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Renderers.ts
Created:  2023-09-14T01:43:23.846Z
Modified: 2023-09-14T01:43:23.846Z

Description: description
*/

export type RenderersChannels =
  | 'renderer.focused-window.navigate'
  | 'renderer.focused-window.is-focused'
  | 'renderer.focused-window.is-blurred'

/**
 * You should not add renderer->main listeners here, this list of channels is for main->renderer channels
 *   only and listeners should be implmented in UI-related code which is run in the renderer process.
 */
