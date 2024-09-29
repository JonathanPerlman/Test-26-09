// imports
import { Request, Response } from "express";
import { Beeper, BeeperStatus } from "../models/types.js";
import { writeBeeperToJsonFile, writeBeepersToJsonFile, readBeeperFromJsonFile } from "../DAL/jsonBeeper.js";
import { v4 as uuid4 } from 'uuid';
import {findBeeperById,updateBeeperStatus} from "../services/beeperService.js";
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

// get beepers by status
export const getBeepersByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const beepers: Beeper[] = await readBeeperFromJsonFile();
        const beepersByStatus = beepers.filter((b) => b.status === req.params.status);
        res.status(200).json(beepersByStatus);
    } catch (err) {
        res.status(500).send(err);
    }
}



// put status beeper by id
export const putStatusBeeperById = async (req: Request, res: Response): Promise<void> => {
    try {
        const beepers: Beeper[] = await readBeeperFromJsonFile();
        const beeper = await findBeeperById(req.params.id);

        if (!beeper) {
            res.status(404).json({ message: 'Beeper not found' });
            return;
        }
        const { latitude, longitude } = req.body;
        // Update status
        const newStatus = updateBeeperStatus(beeper, latitude, longitude);
        if (!newStatus) {
            res.status(400).json({ message: 'Invalid status' });
            return;
        }
        beeper.status = newStatus;
        await writeBeeperToJsonFile(beeper);
        res.status(200).json({ message: `Beeper status updated to ${newStatus} status` });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the beeper' });
    }
};
        









