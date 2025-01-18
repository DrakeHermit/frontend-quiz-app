import themeSwitcher from "./themeSwitcher.js";
themeSwitcher();
import { Quiz } from "./quiz.js";
import { QuizStateManager } from "./QuizStateManager.js";
const stateManager = new QuizStateManager();
const quiz = new Quiz(stateManager);
