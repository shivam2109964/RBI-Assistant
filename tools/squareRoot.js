const squareRootTool = {
  id: "squareRoot",
  title: "Square Root Trainer",
  settings: {
    timeLimitSeconds: 10,
    minNumber: 1,
    maxNumber: 30,
    tolerance: 0.01,
  },

  getInputConfig() {
    return {
      type: "text",
      inputMode: "decimal",
      placeholder: "Type approx square root",
    };
  },

  generateQuestion() {
    const number = this.randomInt(this.settings.minNumber, this.settings.maxNumber);
    const answer = Math.sqrt(number);

    return {
      number,
      prompt: `sqrt(${number}) = ?`,
      promptHtml: `&radic;${number} = ?`,
      answer,
    };
  },

  validateAnswer(question, userAnswer) {
    const parsed = Number(userAnswer);
    if (!Number.isFinite(parsed)) {
      return false;
    }
    return Math.abs(parsed - question.answer) <= this.settings.tolerance;
  },

  getCorrectAnswer(question) {
    return Number(question.answer.toFixed(3));
  },

  getTimeLimitSeconds() {
    return this.settings.timeLimitSeconds;
  },

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

export default squareRootTool;
