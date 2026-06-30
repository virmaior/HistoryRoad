import { ConfigData, HistoryRoad , hrData } from './HistoryRoad.js';

declare global {
    interface Window {
        initializeHistoryRoad: (json: hrData, config: ConfigData) => void;
    }
}

window.initializeHistoryRoad = function (inJSON: hrData, config: ConfigData) {
    const container = document.getElementById('road-container');
    
    if (container) {
        let road : HistoryRoad | null = null;
        if (typeof inJSON == "string")  road = HistoryRoad.fromJsonString(inJSON,config);
        else road =  HistoryRoad.fromJSON(inJSON,config)
        if (road) {
            road.render(container);
        }
    } else {
        console.error("Could not find element #road-container");
    }
};