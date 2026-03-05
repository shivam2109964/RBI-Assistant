const divisionTool = {
  id: "division",
  title: "Division Trainer",
  settings: {
    leftDigits: 1,
    rightDigits: 1,
    timeLimitSeconds: 10,
  },

  generateQuestion() {
    const leftDigits = this.normalizeDigits(this.settings.leftDigits);
    const rightDigits = this.normalizeDigits(this.settings.rightDigits);
    const minDividend = 10 ** (leftDigits - 1);
    const maxDividend = (10 ** leftDigits) - 1;
    const minDivisor = Math.max(2, 10 ** (rightDigits - 1));
    const maxDivisor = Math.min((10 ** rightDigits) - 1, Math.floor(maxDividend / 2));

    if (minDivisor > maxDivisor) {
      const divisor = 2;
      const quotient = this.randomInt(2, 9);
      const dividend = divisor * quotient;
      return {
        a: dividend,
        b: divisor,
        prompt: `${dividend} / ${divisor} = ?`,
      };
    }

    for (let attempt = 0; attempt < 120; attempt += 1) {
      const divisor = this.randomInt(minDivisor, maxDivisor);
      const minQuotient = Math.ceil(minDividend / divisor);
      const maxQuotient = Math.floor(maxDividend / divisor);

      const effectiveMinQuotient = Math.max(2, minQuotient);
      if (effectiveMinQuotient > maxQuotient) {
        continue;
      }

      const quotient = this.randomInt(effectiveMinQuotient, maxQuotient);
      const dividend = divisor * quotient;

      return {
        a: dividend,
        b: divisor,
        prompt: `${dividend} / ${divisor} = ?`,
      };
    }

    const divisor = this.randomInt(minDivisor, maxDivisor);
    const quotient = this.randomInt(2, Math.max(2, Math.floor(maxDividend / divisor)));
    const dividend = divisor * quotient;
    return {
      a: dividend,
      b: divisor,
      prompt: `${dividend} / ${divisor} = ?`,
    };
  },

  validateAnswer(question, userAnswer) {
    return Number(userAnswer) === question.a / question.b;
  },

  getCorrectAnswer(question) {
    return question.a / question.b;
  },

  getTimeLimitSeconds() {
    return this.settings.timeLimitSeconds;
  },

  setDigitCounts(leftDigits, rightDigits) {
    const safeLeft = this.normalizeDigits(leftDigits);
    const safeRight = this.normalizeDigits(rightDigits);
    this.settings.leftDigits = safeLeft;
    this.settings.rightDigits = Math.min(safeLeft, safeRight);
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
    return this.randomInt(min, max);
  },

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

export default divisionTool;
