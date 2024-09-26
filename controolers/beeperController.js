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
const findBeeperById = (beeperId) => __awaiter(void 0, void 0, void 0, function* () {
    const beepers = yield readBeeperFromJsonFile();
    return beepers.find((u) => u.id === beeperId);
});
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
export const getAllBeepers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beepers = yield readBeeperFromJsonFile();
        res.status(200).json(beepers);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
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
        yield writeBeepersToJsonFile(beepers);
        res.status(200).json({ massage: `Beeper status updated to ${beepers[indexBeeper].status}` });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the beeper' });
    }
});
// export const putStatusBeeperById = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const beepers: Beeper[] = await readBeeperFromJsonFile();
//         const beeper = await findBeeperById(req.params.id);
//         if (!beeper) {
//             res.status(404).json({ massage: 'Beeper not found' });
//             return;
//         }
//         const indexBeeper = beepers.findIndex((b) => b.id === beeper.id);
//         const currentStatusIndex = listStatus.indexOf(beepers[indexBeeper].status);
//         if (beepers[indexBeeper].status == listStatus[4]) {
//             res.status(409).json({ message: "Beeper cannot be updated as it is already in the status" });
//             return;
//         }
//         if (beepers[indexBeeper].status == listStatus[3]) {
//             beepers[indexBeeper].status = listStatus[currentStatusIndex + 1];
//             await writeBeepersToJsonFile(beepers);
//             res.status(200).send(`Beeper status updated to ${listStatus[currentStatusIndex + 1]}`);
//             return;
//         }
//         if (beepers[indexBeeper].status >= listStatus[0] && beepers[indexBeeper].status <= listStatus[2]) {
//             beepers[indexBeeper].status = listStatus[currentStatusIndex + 1];
//         }
//         await writeBeepersToJsonFile(beepers);
//         res.status(200).send(`Beeper status updated to ${listStatus[currentStatusIndex + 1]}`);
//         return;
//         }
//      catch (error) {
//     res.status(500).json({ error: 'An error occurred while updating the beeper' });
// }
// };
