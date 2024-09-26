import { Request, Response } from "express";
import { Beeper, BeeperStatus } from "../models/types.js";
import { writeBeeperToJsonFile, writeBeepersToJsonFile, readBeeperFromJsonFile } from "../DAL/jsonBeeper.js";
import { v4 as uuid4 } from 'uuid';
import { promises } from "dns";

const findBeeperById = async (beeperId: string): Promise<Beeper | undefined> => {
    const beepers: Beeper[] = await readBeeperFromJsonFile();
    return beepers.find((u) => u.id === beeperId);
};

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



export const getAllBeepers = async (req: Request, res: Response): Promise<void> => {
    try {
        const beepers: Beeper[] = await readBeeperFromJsonFile();
        res.status(200).json(beepers);
    } catch (err) {
        res.status(500).send(err);
    }
};



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

        switch (beepers[indexBeeper].status) {
            case BeeperStatus.Manufactured:
                beepers[indexBeeper].status = BeeperStatus.Assembled;
                break;
            case BeeperStatus.Assembled:
                beepers[indexBeeper].status = BeeperStatus.Shipped;
                break;
            case BeeperStatus.Shipped:
                
                beepers[indexBeeper].status = BeeperStatus.Deployed;
                break;
            case BeeperStatus.Deployed:
                beepers[indexBeeper].status = BeeperStatus.Detonated;
                break;
            default:
                res.status(400).json({ message: 'Invalid status' });
                return;
        }
        await writeBeepersToJsonFile(beepers);
        res.status(200).json({massage: `Beeper status updated to ${beepers[indexBeeper].status}`});
       } catch (error) {
           res.status(500).json({ error: 'An error occurred while updating the beeper' });
       }
};