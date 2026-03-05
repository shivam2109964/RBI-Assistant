import additionTool from "./addition.js";
import subtractionTool from "./subtraction.js";
import multiplicationTool from "./multiplication.js";
import divisionTool from "./division.js";
import tableTool from "./table.js";
import percentageTool from "./percentage.js";
import squareCubeTool from "./squareCube.js";
import squareRootTool from "./squareRoot.js";
import simplificationTool from "./simplification.js";
import numberSeriesTool from "./numberSeries.js";

const mixedTools = [
  additionTool,
  subtractionTool,
  multiplicationTool,
  divisionTool,
  tableTool,
  percentageTool,
  squareCubeTool,
  squareRootTool,
  simplificationTool,
  numberSeriesTool,
];

const toolById = Object.fromEntries(mixedTools.map((tool) => [tool.id, tool]));

const mixTool = {
  id: "mix",
  title: "Mix Trainer",
  settings: {
    timeLimitSeconds: 7,
  },

  getInputConfig() {
    return {
      type: "text",
      inputMode: "decimal",
      placeholder: "Type your answer",
    };
  },

  generateQuestion() {
    const selectedTool = this.randomFrom(mixedTools);
    const question = selectedTool.generateQuestion();

    return {
      ...question,
      sourceToolId: selectedTool.id,
      sourceToolTitle: selectedTool.title,
      pattern: question.pattern || selectedTool.title,
    };
  },

  validateAnswer(question, userAnswer) {
    const sourceTool = toolById[question.sourceToolId];
    if (!sourceTool || typeof sourceTool.validateAnswer !== "function") {
      return false;
    }
    return sourceTool.validateAnswer(question, userAnswer);
  },

  getCorrectAnswer(question) {
    const sourceTool = toolById[question.sourceToolId];
    if (!sourceTool || typeof sourceTool.getCorrectAnswer !== "function") {
      return "";
    }
    return sourceTool.getCorrectAnswer(question);
  },

  getTimeLimitSeconds() {
    return this.settings.timeLimitSeconds;
  },

  randomFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
  },
};

export default mixTool;
