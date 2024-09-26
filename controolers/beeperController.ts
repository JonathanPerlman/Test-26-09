import { Request, Response } from "express";
import { Beeper, BeeperStatus } from "../models/types.js";
import { writeBeeperToJsonFile, writeBeepersToJsonFile, readBeeperFromJsonFile } from "../DAL/jsonBeeper.js";
import { v4 as uuid4 } from 'uuid';
import {findBeeperById,updateBeeperStatus } from "../services/beeperService.js";
import { promises } from "dns";

/// beeper CRUD

// create beeper
export const createBeeper = async (req: Request, res: Response): Promise<void> => {
    try {
        const beeper: Beeper = req.body;
        beeper.id = uuid4();
        beeper.status = BeeperStatus.Manufactured;
        beeper.created_at = new Date();
        await writeBeeperToJsonFile(beeper);

        res.status(201).json({ beeperId: beeper.id });
    }
    catch (err) {
        res.status(500).send(err);
    };
}


// get all beepers
export const getAllBeepers = async (req: Request, res: Response): Promise<void> => {
    try {
        const beepers: Beeper[] = await readBeeperFromJsonFile();
        res.status(200).json(beepers);
    } catch (err) {
        res.status(500).send(err);
    }
};


// get beeper by id
export const getBeeperById = async (req: Request, res: Response): Promise<void> => {
    try {
        const beeperFind = await findBeeperById(req.params.id);

        if (beeperFind) {
            res.status(200).json(beeperFind);
        } else {
            res.status(404).send('Beeper not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
};


// delete beeper by id
export const deleteBeeperById = async (req: Request, res: Response): Promise<void> => {
    try {
        const beepers: Beeper[] = await readBeeperFromJsonFile();
        const beeper = await findBeeperById(req.params.id);
        if (!beeper) {
            res.status(404).send('Beeper not found');
            return;
        }
        const indexBeeper = beepers.findIndex((b) => b.id === beeper.id);
        if (indexBeeper >= 0) {
            beepers.splice(indexBeeper, 1);
            await writeBeepersToJsonFile(beepers);
            res.status(200).send('Beeper deleted successfully');
        } else {
            res.status(404).send('Beeper not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
};


// update beeper status
export const putStatusBeeperById = async (req: Request, res: Response): Promise<void> => {
    try {
        const beepers: Beeper[] = await readBeeperFromJsonFile();
        const beeper = await findBeeperById(req.params.id);

        if (!beeper) {
            res.status(404).json({ message: 'Beeper not found' });
            return;
        }

        const indexBeeper = beepers.findIndex((b) => b.id === beeper.id);
        if (beepers[indexBeeper].status === BeeperStatus.Detonated) {
            res.status(409).json({ message: "Beeper cannot be updated as it is already in the final status" });
            return;
        }
        const {latitude, longitude} = req.body;
        const newStatus = updateBeeperStatus(beepers[indexBeeper], latitude, longitude);
        if (!newStatus) {
            if(!latitude || !longitude) {
                res.status(400).json({ message: 'Latitude and longitude are required' });
                return;
            }
            res.status(400).json({ message: 'Invalid status' });
            return;
        }
        beepers[indexBeeper].status = newStatus;
        await writeBeepersToJsonFile(beepers);
        res.status(200).json({ message: `Beeper status updated to ${newStatus} status`});
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the beeper' });
    }
};