import express from "express";
import { auth } from "../Middleware/Token.middleware.js";
import { createTeam, getTeamCodeToTeamLeader, joinTeam, getCurrentQuestion, submitQuestionCode,getPlayerLeaderBoard,getTeamDetails } from "../Controller/Player.controller.js";

const router = express.Router();

router.post("/createTeam", auth, createTeam);
router.get("/getTeamCodeToTeamLeader", auth, getTeamCodeToTeamLeader);
router.post("/joinTeam", auth, joinTeam);
router.get("/getCurrentQuestion", auth, getCurrentQuestion);
router.post("/submitQuestionCode", auth, submitQuestionCode);
router.get("/getPlayerLeaderBoard", auth, getPlayerLeaderBoard);
router.get("/getTeamDetails/:teamId", auth, getTeamDetails);
export default router;