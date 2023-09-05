/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useCreateNewSchedule.ts
Created:  2023-08-02T03:17:08.445Z
Modified: 2023-08-02T03:17:08.445Z

Description: description
*/

import { useCallback, useState } from 'react'
import { Schedule } from '../../../../main/database'
import { ScheduleAttributes } from '../../../../main/database/models/Schedule'

const useCreateNewSchedule = () => {
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [createdSchedule, setCreatedSchedule] = useState<ScheduleAttributes | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | false>(false)

  const createNewSchedule = useCallback((sourceId: number, intervalInSeconds: number | null, downloadLocation: string | null = null) => {
    setIsCreating(true)

    window.electron.ipcRenderer.once(
      'schedules.create',
      (createdSchedule, errorMessage) => {
        if (createdSchedule == null && errorMessage == null) return

        setIsCreating(false)

        if (errorMessage != null) {
          setCreatedSchedule(null)
          setErrorMessage(errorMessage as string)
          return
        }

        setCreatedSchedule(createdSchedule as Schedule)
        setErrorMessage(false)
      }
    )

    window.electron.ipcRenderer.sendMessage('schedules.create', sourceId, intervalInSeconds, downloadLocation)

    return () => { window.electron.ipcRenderer.removeAllListeners('schedules.create') }
  }, [])

  return {
    isCreating,
    createdSchedule,
    errorMessage,
    createNewSchedule,
  }
}

export default useCreateNewSchedule
