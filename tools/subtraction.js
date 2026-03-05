const subtractionTool = {
  id: "subtraction",
  title: "Subtraction Trainer",
  settings: {
    leftDigits: 1,
    rightDigits: 1,
  },

  generateQuestion() {
    let a = this.randomNumberWithDigits(this.settings.leftDigits);
    let b = this.randomNumberWithDigits(this.settings.rightDigits);

    if (b > a) {
      const temp = a;
      a = b;
      b = temp;
    }

    return {
      a,
      b,
      prompt: `${a} - ${b} = ?`,
    };
  },

  validateAnswer(question, userAnswer) {
    return Number(userAnswer) === question.a - question.b;
  },

  getCorrectAnswer(question) {
    return question.a - question.b;
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

export default subtractionTool;
