import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import tenantsRouter from "./tenants.js";
import controlsRouter from "./controls.js";
import auditRouter from "./audit.js";
import aiRouter from "./ai.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(tenantsRouter);
router.use(controlsRouter);
router.use(auditRouter);
router.use(aiRouter);

export default router;
