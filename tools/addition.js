const additionTool = {
  id: "addition",
  title: "Addition Trainer",
  settings: {
    leftDigits: 1,
    rightDigits: 1,
  },

  generateQuestion() {
    const a = this.randomNumberWithDigits(this.settings.leftDigits);
    const b = this.randomNumberWithDigits(this.settings.rightDigits);
    return {
      a,
      b,
      prompt: `${a} + ${b} = ?`,
    };
  },

  validateAnswer(question, userAnswer) {
    return Number(userAnswer) === question.a + question.b;
  },

  getCorrectAnswer(question) {
    return question.a + question.b;
  },

  setDigitCounts(leftDigits, rightDigits) {
    this.settings.leftDigits = this.normalizeDigits(leftDigits);
    this.settings.rightDigits = this.normalizeDigits(rightDigits);
  },

  normalizeDigits(value) {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
      return 1;
    }
    return parsed;
  },

  randomNumberWithDigits(digits) {
    const safeDigits = this.normalizeDigits(digits);
    const min = 10 ** (safeDigits - 1);
    const max = (10 ** safeDigits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

export default additionTool;
