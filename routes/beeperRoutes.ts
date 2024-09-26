import express, { Router } from "express";
import {createBeeper, getAllBeepers, getBeeperById, deleteBeeperById, putStatusBeeperById} from "../controolers/beeperController.js";


const router: Router = express.Router();


router.route('/').post(createBeeper);
router.route('/').get(getAllBeepers);
router.route('/:id').get(getBeeperById);
router.route('/:id/status').put(putStatusBeeperById);
router.route('/:id').delete(deleteBeeperById);
router.route('/status/:status').get();
;


export default router;