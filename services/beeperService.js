var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BeeperStatus } from "../models/types.js";
import { writeBeeperToJsonFile, readBeeperFromJsonFile } from "../DAL/jsonBeeper.js";
import { Latitude, Longitude } from "../handlers/beeperHandler.js";
export const findBeeperById = (beeperId) => __awaiter(void 0, void 0, void 0, function* () {
    const beepers = yield readBeeperFromJsonFile();
    return beepers.find((u) => u.id === beeperId);
});
export const updateBeeperStatus = (beeper, latitude, longitude) => {
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
const handleShippedStatus = (beeper, latitude, longitude) => {
    if (latitude && longitude) {
        const indexLatitude = Latitude.findIndex((l) => l === latitude);
        const indexLongitude = Longitude.findIndex((l) => l === longitude);
        if (indexLatitude === -1 || indexLongitude === -1 || indexLatitude !== indexLongitude) {
            return null;
        }
        else {
            beeper.latitude = latitude;
            beeper.longitude = longitude;
            changeStatusToDetonated(beeper);
            return BeeperStatus.Deployed;
        }
    }
    return null;
};
export const changeStatusToDetonated = (beeper) => __awaiter(void 0, void 0, void 0, function* () {
    setTimeout(() => {
        ;
        beeper.status = BeeperStatus.Detonated;
        beeper.detonated_at = new Date();
        writeBeeperToJsonFile(beeper);
    }, 10000);
});
