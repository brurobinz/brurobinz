import express from "express";
import { createHelpRequest } from "../controllers/helpController.js";

const helpRouter = express.Router();

// Use the base path
helpRouter.post('/', createHelpRequest);

export default helpRouter;
