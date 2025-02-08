import express from "express"
import {protectRoute} from "../middlewares/auth.middleware.js"
import { acceptConnectionRequest, getConnectionReqests, getConnectionStatus, getUserConnection, rejectConnectionRequest, removeConnection, sendConnectionRequest } from "../controllers/connection.controller.js"

const router = express.Router() 

router.get("/request/:userId", protectRoute, sendConnectionRequest)
router.put("/accept/:userId", protectRoute, acceptConnectionRequest)
router.put("/reject/:userId", protectRoute, rejectConnectionRequest)

router.get("/requests",protectRoute, getConnectionReqests)

router.get("/", protectRoute, getUserConnection)
router.delete("/:userId", protectRoute, removeConnection)
router.get("/status/:userId", protectRoute, getConnectionStatus) 

export default router 