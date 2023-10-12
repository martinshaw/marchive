import config from "../config.js";
import { defPreventContArr } from "../constants/data.js";
import { getPureURL, getStorageData, setStorageData } from "../constants/functions.js";

// handle install
chrome.runtime.onInstalled.addListener(async details => {

	const { previousVersion, reason } = details;

	if (reason === "install") {

    await setStorageData({
      ctxEnabled: true,
      update: false,
      stats: {
        cleanedArea: 0,
        numbOfItems: 0,
        restored: 0,
      },
      statsEnabled: false,
      restoreContActive: [...defPreventContArr],
      curAutoMode: "whitelist",
      staticSubMode: "relative",
      shortCutMode: null,
      websites1: {},
      websites2: {},
      websites3: {},
      ...config,
    });

	} else if (reason === "update") {

		try {
			if (previousVersion === "2.0.3") {
				// 2.0.3
			} else if (previousVersion === "2.0.2") {
				// 2.0.2
				chrome.storage.sync.remove(["autoModeAggr"]);
			}
		} catch (error) {
			console.error("something went wrong", error);
		}

	}

});

// handle tab switch(focus)
chrome.tabs.onActivated.addListener(activeInfo => {
  console.log('onActivated', activeInfo);
});

// handle mode changed from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (!sender.tab) return true;

	if (request.modeChanged) {
		const tabID = sender.tab.id;
		const pureUrl = getPureURL(sender);

    console.log("onMessage modeChanged", request.modeChanged, tabID, pureUrl);
  }

	return true;
});

// handle updating to set new badge and context menu
chrome.tabs.onUpdated.addListener((tabID, changeInfo, tab) => {
  console.log('onUpdated', tabID, changeInfo, tab);
});
