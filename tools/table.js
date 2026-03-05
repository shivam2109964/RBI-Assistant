const tableTool = {
  id: "table",
  title: "Table Trainer",
  settings: {
    timeLimitSeconds: 7,
    minTable: 1,
    maxTable: 20,
  },

  getInputConfig() {
    return {
      type: "text",
      inputMode: "numeric",
      placeholder: "Type your answer",
    };
  },

  generateQuestion() {
    const left = this.randomInt(this.settings.minTable, this.settings.maxTable);
    const right = this.randomInt(this.settings.minTable, this.settings.maxTable);
    return {
      left,
      right,
      prompt: `${left} x ${right} = ?`,
      answer: left * right,
    };
  },

  validateAnswer(question, userAnswer) {
    return Number(userAnswer) === question.answer;
  },

  getCorrectAnswer(question) {
    return question.answer;
  },

  getTimeLimitSeconds() {
    return this.settings.timeLimitSeconds;
  },

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

export default tableTool;
