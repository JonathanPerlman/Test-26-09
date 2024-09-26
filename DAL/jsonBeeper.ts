import jsonfile from 'jsonfile'; 
import { Beeper, BeeperStatus } from '../models/types.js';       


// A function that writes the beeper to the JSON file
export const writeBeeperToJsonFile = async (beeper: Beeper) => {
    try {
        const beepers: Beeper[] = await jsonfile.readFile('./data/db.json');

        const existingBeeperIndex = beepers.findIndex((b: Beeper) => b.id === beeper.id);
        if (existingBeeperIndex !== -1) {
            beepers[existingBeeperIndex] = beeper;
        } else {
            beepers.push(beeper);
        }

        await jsonfile.writeFile('./data/db.json', beepers);
        console.log("File written successfully.");
    } catch (err) {
        console.error(err);
    }
};


// A function that writes the beepers to the JSON file
export const writeBeepersToJsonFile = async (newBeepers: Beeper[]) => {
    try {
        await jsonfile.writeFile('./data/db.json', newBeepers);
        console.log("File overwritten successfully.");
    } catch (err) {
        console.error(err);
    }
};



// A function that reads the beeper from the JSON file
export const readBeeperFromJsonFile = async () => {
    
    const beepers = await jsonfile.readFile('./data/db.json')

    return beepers;
};