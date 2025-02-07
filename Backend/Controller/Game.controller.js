import Level from "../Model/Level.js";
import Team from "../Model/Team.js";



const startGame = async (req, res) => {
    try{
        const allTeams = await Team.find({});
        const firstLevel = await Level.findOne({level: 1});
        for(const team of allTeams){
            team.currlevel = firstLevel;
            team.currentQuestion = await allotNewRandomQuestionFromLevel(firstLevel._id);
            team.levelStartedAt = new Date();
            await team.save();
        }
        return res.status(200).json({message: "Game started successfully"});
    }
    catch(error){
        return res.status(500).json({message: "Failed to start the game", error: error.message, completeError: error})
    }
}

const allotNewRandomQuestionFromLevel = async (levelId) => {
    try{
        const level = await Level.findById(levelId);
        const allQuestions = await Question.find({level: levelId});

        const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
        return randomQuestion;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

const updateTeamScore = async (team) => {
    try{
        const currQuestion = team.currentQuestion;
        const levelStartedAt = team.levelStartedAt;
        const levelId = team.currLevel;
        const currLevel = await Level.findById(levelId);
        const levelNum = currLevel.level;

        const allLevels = await Level.find({});
        allLevels.sort((a, b) => a.level - b.level);
        const lastLevel = allLevels[allLevels.length - 1].level;

        if(levelNum === lastLevel){

            if(!team.hasCompletedAllLevels){
                team.score += 1000 + (1000/timeTakenToCompleteTheCurrLevelInMinutes);
                team.currentQuestion = null;
                team.completedQuestions.push({ currentQuestion: currQuestion, level: levelId, startedAt: team.levelStartedAt, completedAt: new Date(), timeTaken: team.startedAt - team.levelStartedAt })
                team.hasCompletedAllLevels = true;
                await team.save();
                return res.status(200).json({message: "Team has completed all levels"});
            }
            else{
                //do nothing the team has already completed and submitted the last level
                return res.status(200).json({message: "Team has already completed and submitted the last level"})
            }
        }
        else{
        const nextLevelNum = levelNum + 1;
        const nextLevelRef = allLevels.find((level) => level.level === nextLevelNum);
        const nextLevelId = nextLevelRef._id;

        team.currLevel = nextLevelId;
        team.currentQuestion = await allotNewRandomQuestionFromLevel(nextLevelId);
        team.completedQuestions.push({ currentQuestion: currQuestion, level: levelId, startedAt: team.levelStartedAt, completedAt: new Date(), timeTaken: team.startedAt - team.levelStartedAt })

        const timeTakenToCompleteTheCurrLevelInMinutes = new Date() - team.levelStartedAt / (1000*60);
        team.score += 1000 + (1000/timeTakenToCompleteTheCurrLevelInMinutes);
        // 1000 points will be given to each team for comepleting a particular level and an extra (1000/timetakentocompleteTheCurrLevelInMinutes) will be given for completing the level in less time)
        await team.save();
        return res.status(200).json({message: "Team has moved to the next level"});
        }
    }
    catch(error){
        console.log(error);
        throw error;
    }
}


const resetGame = async (req, res) => {
    try{
        const allTeams = await Team.find({});
        for(const team in allTeams){
            team.currLevel = null;
            team.currentQuestion = null;
            team.score = 0;
            team.completedQuestions = [];
            team.hasCompletedAllLevels = false;
            team.levelStartedAt = null;
            await team.save();
        }        
    }
    catch(error){
        return res.status(500).json({message: "Error reseting the game", error: error.message, completeError: error});
    }
}


export {startGame, allotNewRandomQuestionFromLevel, updateTeamScore, resetGame};

