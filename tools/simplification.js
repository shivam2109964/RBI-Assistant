const simplificationTool = {
  id: "simplification",
  title: "Simplification Trainer",
  settings: {
    timeLimitSeconds: 10,
  },

  getInputConfig() {
    return {
      type: "text",
      inputMode: "numeric",
      placeholder: "Type your answer",
    };
  },

  generateQuestion() {
    const builders = [
      () => this.buildTypeA(),
      () => this.buildTypeB(),
      () => this.buildTypeC(),
      () => this.buildTypeD(),
      () => this.buildSquareType(),
      () => this.buildPercentType(),
      () => this.buildMixedType(),
      () => this.buildSquareDifference(),
    ];

    return this.randomFrom(builders)();
  },

  buildTypeA() {
    const a = this.randomInt(20, 120);
    const b = this.randomInt(3, 15);
    const c = this.randomInt(2, 12);
    const d = this.randomInt(10, 90);
    const answer = a + (b * c) - d;

    return {
      prompt: `${a} + ${b} x ${c} - ${d} = ?`,
      answer,
    };
  },

  buildTypeB() {
    const a = this.randomInt(8, 35);
    const b = this.randomInt(6, 30);
    const c = this.randomInt(2, 8);
    const d = this.randomInt(10, 95);
    const answer = ((a + b) * c) - d;

    return {
      prompt: `(${a} + ${b}) x ${c} - ${d} = ?`,
      answer,
    };
  },

  buildTypeC() {
    const m = this.randomInt(6, 25);
    const n = this.randomInt(4, 20);
    const divisor = this.randomInt(2, 12);
    const quotient = this.randomInt(3, 18);
    const dividend = divisor * quotient;
    const answer = (m * n) - (dividend / divisor);

    return {
      prompt: `${m} x ${n} - ${dividend} / ${divisor} = ?`,
      answer,
    };
  },

  buildTypeD() {
    const a = this.randomInt(25, 90);
    const b = this.randomInt(2, 9);
    const c = this.randomInt(2, 10);
    const d = this.randomInt(2, 9);

    const dividend = a - (a % b);
    const fixedAnswer = (dividend / b) + (c * d);

    return {
      prompt: `${dividend} / ${b} + ${c} x ${d} = ?`,
      answer: fixedAnswer,
    };
  },

  buildSquareType() {
    const a = this.randomInt(12, 35);
    const b = this.randomInt(10, 60);
    const answer = (a * a) + b;

    return {
      prompt: `${a}^2 + ${b} = ?`,
      promptHtml: `${a}<sup>2</sup> + ${b} = ?`,
      answer,
    };
  },

  buildPercentType() {
    const percent = this.randomFrom([10, 20, 25, 50]);
    const base = this.randomBaseForPercent(percent);
    const extra = this.randomInt(10, 80);
    const answer = ((percent / 100) * base) + extra;

    return {
      prompt: `${percent}% of ${base} + ${extra} = ?`,
      answer,
    };
  },

  buildMixedType() {
    const a = this.randomInt(20, 80);
    const b = this.randomInt(5, 12);
    const c = this.randomInt(3, 9);
    const dividend = b * c;
    const answer = (a * b) + (dividend / b);

    return {
      prompt: `${a} x ${b} + ${dividend} / ${b} = ?`,
      answer,
    };
  },

  buildSquareDifference() {
    const a = this.randomInt(20, 45);
    const b = this.randomInt(10, 35);
    const answer = (a * a) - (b * b);

    return {
      prompt: `${a}^2 - ${b}^2 = ?`,
      promptHtml: `${a}<sup>2</sup> - ${b}<sup>2</sup> = ?`,
      answer,
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

  randomBaseForPercent(percent) {
    if (percent === 25) {
      return this.randomInt(20, 160) * 4;
    }
    if (percent === 50) {
      return this.randomInt(20, 160) * 2;
    }
    if (percent === 20) {
      return this.randomInt(20, 160) * 5;
    }
    return this.randomInt(100, 800);
  },

  randomFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
  },

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

export default simplificationTool;
