/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ProcessCheckIsConnectedAction.ts
Created:  2023-09-06T04:58:55.001Z
Modified: 2023-09-06T04:58:55.001Z

Description: description
*/


const ProcessCheckIsConnectedAction = async (): Promise<boolean> =>
  new Promise((resolve, reject) => {
    return resolve(true)

    // let connectionError: Error | null | undefined = null

    // pm2.connect(error => {
    //   connectionError = error

    //   pm2.disconnect()

    //   if (connectionError == null) return resolve(true)
    //   else return reject(connectionError)
    // })
  })

export default ProcessCheckIsConnectedAction
