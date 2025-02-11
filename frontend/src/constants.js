const PORT = 4000;
const BASE_URL = `http://localhost:${PORT}/api`;


//Question
export const ADD_QUESTION = `${BASE_URL}/admin/addQuestion`;
export const ADD_LEVEL = `${BASE_URL}/admin/addLevel`;



export const MODIFY_QUESTION = (questionId) => `${BASE_URL}/admin/modifyQuestion/${questionId}`;
export const DELETE_QUESTION = (questionId) => `${BASE_URL}/admin/deleteQuestion/${questionId}`;
export const GET_ALL_LEVELS = `${BASE_URL}/admin/getAllLevels`;

export const GET_ALL_QUESTIONS_BY_LEVEL = (levelId) => `${BASE_URL}/admin/getAllQuestionsByLevel/${levelId}`;
export const DELETE_LEVEL = (levelId) =>`${BASE_URL}/admin/deleteLevel/${levelId}`;


//Admin Start Game and Reset Game endpoints
export const START_GAME = `${BASE_URL}/admin/startGame`;
export const RESET_GAME = `${BASE_URL}/admin/resetGame`;


// Join team and create team
export const JOIN_TEAM = `${BASE_URL}/player/joinTeam`;
export const CREATE_TEAM = `${BASE_URL}/player/createTeam`;
export const GET_TEAM_DETAILS = (teamId) => `${BASE_URL}/player/getTeamDetails/${teamId}`;

//General User endpoints
export const REGISTER = `${BASE_URL}/user/register/initiate`;
export const LOGIN = `${BASE_URL}/user/login`;
export const LOGOUT = `${BASE_URL}/user/logout`;
export const VERIFY_USER = `${BASE_URL}/user/verify`;
export const VERIFY_OTP = `${BASE_URL}/user/register/verify`;
