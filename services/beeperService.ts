import { Beeper, BeeperStatus } from "../models/types.js";
import { writeBeeperToJsonFile, writeBeepersToJsonFile, readBeeperFromJsonFile } from "../DAL/jsonBeeper.js";
import { Latitude, Longitude } from "../handlers/beeperHandler.js";

export const findBeeperById = async (beeperId: string): Promise<Beeper | undefined> => {
    const beepers: Beeper[] = await readBeeperFromJsonFile();
    return beepers.find((u) => u.id === beeperId);
};

export const updateBeeperStatus = (beeper: Beeper, latitude?: number, longitude?: number): BeeperStatus | null => {
    switch (beeper.status) {
        case BeeperStatus.Manufactured:
            return BeeperStatus.Assembled;
        case BeeperStatus.Assembled:
            return BeeperStatus.Shipped;
        case BeeperStatus.Shipped:
            return handleShippedStatus(beeper, latitude, longitude); 
        default:
            return null;
    }
};
const handleShippedStatus = (beeper: Beeper, latitude?: number, longitude?: number): BeeperStatus | null => {
    if (latitude && longitude) {
        const indexLatitude = Latitude.findIndex((l) => l === latitude);
        const indexLongitude = Longitude.findIndex((l) => l === longitude);
        
        if (indexLatitude === -1 || indexLongitude === -1 || indexLatitude !== indexLongitude) {
            return null;
        } else {
            beeper.latitude = latitude;
            beeper.longitude = longitude;
            changeStatusToDetonated(beeper);
            return BeeperStatus.Deployed; 
        }
    }
    return null; 
};

export const changeStatusToDetonated = async (beeper: Beeper) => {
    setTimeout(() => { ;
      beeper.status = BeeperStatus.Detonated;
      beeper.detonated_at = new Date();
      writeBeeperToJsonFile(beeper);
    }, 10000);
};


