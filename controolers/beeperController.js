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
import { writeBeeperToJsonFile, writeBeepersToJsonFile, readBeeperFromJsonFile } from "../DAL/jsonBeeper.js";
import { v4 as uuid4 } from 'uuid';
import { findBeeperById, updateBeeperStatus } from "../services/beeperService.js";
/// beeper CRUD
// create beeper
export const createBeeper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beeper = req.body;
        beeper.id = uuid4();
        beeper.status = BeeperStatus.Manufactured;
        beeper.created_at = new Date();
        yield writeBeeperToJsonFile(beeper);
        res.status(201).json({ beeperId: beeper.id });
    }
    catch (err) {
        res.status(500).send(err);
    }
    ;
});
// get all beepers
export const getAllBeepers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beepers = yield readBeeperFromJsonFile();
        res.status(200).json(beepers);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
// get beeper by id
export const getBeeperById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beeperFind = yield findBeeperById(req.params.id);
        if (beeperFind) {
            res.status(200).json(beeperFind);
        }
        else {
            res.status(404).send('Beeper not found');
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});
// delete beeper by id
export const deleteBeeperById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beepers = yield readBeeperFromJsonFile();
        const beeper = yield findBeeperById(req.params.id);
        if (!beeper) {
            res.status(404).send('Beeper not found');
            return;
        }
        const indexBeeper = beepers.findIndex((b) => b.id === beeper.id);
        if (indexBeeper >= 0) {
            beepers.splice(indexBeeper, 1);
            yield writeBeepersToJsonFile(beepers);
            res.status(200).send('Beeper deleted successfully');
        }
        else {
            res.status(404).send('Beeper not found');
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});
// update beeper status
export const putStatusBeeperById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beepers = yield readBeeperFromJsonFile();
        const beeper = yield findBeeperById(req.params.id);
        if (!beeper) {
            res.status(404).json({ message: 'Beeper not found' });
            return;
        }
        const indexBeeper = beepers.findIndex((b) => b.id === beeper.id);
        if (beepers[indexBeeper].status === BeeperStatus.Detonated) {
            res.status(409).json({ message: "Beeper cannot be updated as it is already in the final status" });
            return;
        }
        const { latitude, longitude } = req.body;
        const newStatus = updateBeeperStatus(beepers[indexBeeper], latitude, longitude);
        if (!newStatus) {
            if (!latitude || !longitude) {
                res.status(400).json({ message: 'Latitude and longitude are required' });
                return;
            }
            res.status(400).json({ message: 'Invalid status' });
            return;
        }
        beepers[indexBeeper].status = newStatus;
        yield writeBeepersToJsonFile(beepers);
        res.status(200).json({ message: `Beeper status updated to ${newStatus} status` });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the beeper' });
    }
});
