const squareCubeTool = {
  id: "squareCube",
  title: "Square / Cube Trainer",
  settings: {
    mode: "mix",
  },

  getInputConfig() {
    return {
      type: "text",
      inputMode: "numeric",
      placeholder: "Type your answer",
    };
  },

  generateQuestion() {
    const number = this.randomInt(1, 30);
    const mode = this.getQuestionMode();
    const power = mode === "square" ? 2 : 3;

    return {
      mode,
      number,
      answer: number ** power,
      prompt: `${number}^${power} = ?`,
      promptHtml: `${number}<sup>${power}</sup> = ?`,
    };
  },

  validateAnswer(question, userAnswer) {
    return Number(userAnswer) === question.answer;
  },

  getCorrectAnswer(question) {
    return question.answer;
  },

  setMode(mode) {
    this.settings.mode = this.normalizeMode(mode);
  },

  normalizeMode(mode) {
    if (mode === "square" || mode === "cube" || mode === "mix") {
      return mode;
    }
    return "mix";
  },

  getQuestionMode() {
    const mode = this.normalizeMode(this.settings.mode);
    if (mode === "square" || mode === "cube") {
      return mode;
    }
    return Math.random() < 0.5 ? "square" : "cube";
  },

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

export default squareCubeTool;
