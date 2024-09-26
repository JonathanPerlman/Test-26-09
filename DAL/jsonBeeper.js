var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jsonfile from 'jsonfile';
export const writeBeeperToJsonFile = (beeper) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beepers = yield jsonfile.readFile('./data/db.json');
        const existingBeeperIndex = beepers.findIndex((b) => b.id === beeper.id);
        if (existingBeeperIndex !== -1) {
            beepers[existingBeeperIndex] = beeper;
        }
        else {
            beepers.push(beeper);
        }
        yield jsonfile.writeFile('./data/db.json', beepers);
        console.log("File written successfully.");
    }
    catch (err) {
        console.error(err);
    }
});
export const writeBeepersToJsonFile = (newBeepers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield jsonfile.writeFile('./data/db.json', newBeepers);
        console.log("File overwritten successfully.");
    }
    catch (err) {
        console.error(err);
    }
});
export const readBeeperFromJsonFile = () => __awaiter(void 0, void 0, void 0, function* () {
    const beepers = yield jsonfile.readFile('./data/db.json');
    return beepers;
});
