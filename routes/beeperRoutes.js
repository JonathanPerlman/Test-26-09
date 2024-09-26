import express from "express";
import { createBeeper, getAllBeepers, getBeeperById, deleteBeeperById, putStatusBeeperById, getBeepersByStatus } from "../controolers/beeperController.js";
const router = express.Router();
router.route('/')
    .post(createBeeper)
    .get(getAllBeepers);
router.route('/:id')
    .get(getBeeperById)
    .delete(deleteBeeperById);
router.route('/:id/status').put(putStatusBeeperById);
router.route('/status/:status').get(getBeepersByStatus);
;
export default router;
