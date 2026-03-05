const numberSeriesTool = {
  id: "numberSeries",
  title: "Number Series Trainer",
  settings: {
    timeLimitSeconds: 7,
  },

  getInputConfig() {
    return {
      type: "text",
      inputMode: "numeric",
      placeholder: "Type missing number",
    };
  },

  generateQuestion() {
    const bucket = Math.random();

    if (bucket < 0.6) {
      return this.randomFrom([
        () => this.buildArithmeticSeries(),
        () => this.buildSecondDifferenceSeries(),
        () => this.buildOddIncrementSeries(),
        () => this.buildLargeIncreasingDifferenceSeries(),
      ])();
    }

    if (bucket < 0.8) {
      return this.randomFrom([
        () => this.buildMixedPatternSeries(),
        () => this.buildAlternatingSeries(),
        () => this.buildFibonacciSeries(),
      ])();
    }

    if (bucket < 0.9) {
      return this.randomFrom([
        () => this.buildGeometricSeries(),
        () => this.buildMultiplyPlusAddSeries(),
        () => this.buildDivisionSeries(),
      ])();
    }

    if (bucket < 0.95) {
      return this.randomFrom([
        () => this.buildSquareOffsetSeries(),
      ])();
    }

    return this.randomFrom([
      () => this.buildPrimeSeries(),
      () => this.buildFactorialSeries(),
    ])();
  },

  buildArithmeticSeries() {
    const start = this.randomInt(30, 140);
    const diff = this.randomInt(5, 20);
    const values = [];
    for (let i = 0; i < 6; i += 1) {
      values.push(start + (i * diff));
    }
    return this.toMissingTermQuestion(values, "Arithmetic");
  },

  buildGeometricSeries() {
    const start = this.randomInt(3, 10);
    const ratio = this.randomFrom([2, 3]);
    const values = [start];
    for (let i = 1; i < 6; i += 1) {
      values.push(values[i - 1] * ratio);
    }
    return this.toMissingTermQuestion(values, "Geometric");
  },

  buildAlternatingSeries() {
    const a = this.randomInt(45, 130);
    const add = this.randomInt(8, 20);
    const sub = this.randomInt(3, 11);
    const values = [a];
    for (let i = 1; i < 6; i += 1) {
      const prev = values[i - 1];
      const next = i % 2 === 1 ? prev + add : prev - sub;
      values.push(next);
    }
    return this.toMissingTermQuestion(values, "Alternating");
  },

  buildSquareOffsetSeries() {
    const base = this.randomInt(6, 25);
    const values = [];
    for (let i = 1; i <= 6; i += 1) {
      values.push((i * i) + base);
    }
    return this.toMissingTermQuestion(values, "Square Offset");
  },

  buildSecondDifferenceSeries() {
    const start = this.randomInt(22, 95);
    const firstStep = this.randomInt(4, 12);
    const secondStep = this.randomInt(3, 8);
    const values = [start];
    let currentDiff = firstStep;

    for (let i = 1; i < 6; i += 1) {
      values.push(values[i - 1] + currentDiff);
      currentDiff += secondStep;
    }

    return this.toMissingTermQuestion(values, "Second Difference");
  },

  buildPrimeSeries() {
    const startIndex = this.randomInt(0, 8);
    const values = this.primeNumbers().slice(startIndex, startIndex + 6);
    return this.toMissingTermQuestion(values, "Prime");
  },

  buildFibonacciSeries() {
    const first = this.randomInt(2, 9);
    const second = this.randomInt(first + 1, first + 9);
    const values = [first, second];
    for (let i = 2; i < 6; i += 1) {
      values.push(values[i - 1] + values[i - 2]);
    }
    return this.toMissingTermQuestion(values, "Fibonacci");
  },

  buildMultiplyPlusAddSeries() {
    const start = this.randomInt(2, 9);
    const multiplyBy = this.randomFrom([2, 3]);
    const addBy = this.randomInt(1, 4);
    const values = [start];
    for (let i = 1; i < 6; i += 1) {
      values.push((values[i - 1] * multiplyBy) + addBy);
    }
    return this.toMissingTermQuestion(values, "Multiply + Add");
  },

  buildOddIncrementSeries() {
    const start = this.randomInt(4, 25);
    const firstOdd = this.randomFrom([3, 5, 7]);
    const values = [start];
    let increment = firstOdd;
    for (let i = 1; i < 6; i += 1) {
      values.push(values[i - 1] + increment);
      increment += 2;
    }
    return this.toMissingTermQuestion(values, "Odd Increments");
  },

  buildMixedPatternSeries() {
    const start = this.randomInt(4, 25);
    const addA = this.randomInt(2, 4);
    const addB = this.randomInt(1, 2);
    const values = [start];
    for (let i = 1; i < 6; i += 1) {
      const step = i % 2 === 1 ? addA : addB;
      values.push(values[i - 1] + step);
    }
    return this.toMissingTermQuestion(values, "Mixed +2/+1");
  },

  buildDivisionSeries() {
    const startPower = this.randomInt(8, 10);
    const values = [2 ** startPower];
    for (let i = 1; i < 6; i += 1) {
      values.push(values[i - 1] / 2);
    }
    return this.toMissingTermQuestion(values, "Division");
  },

  buildFactorialSeries() {
    const start = this.randomFrom([1, 2]);
    const values = [start];
    let multiplier = start + 1;
    for (let i = 1; i < 6; i += 1) {
      values.push(values[i - 1] * multiplier);
      multiplier += 1;
    }
    return this.toMissingTermQuestion(values, "Factorial");
  },

  buildLargeIncreasingDifferenceSeries() {
    const start = this.randomInt(70, 150);
    const baseDiff = this.randomInt(6, 12);
    const values = [start];
    let diff = baseDiff;
    for (let i = 1; i < 6; i += 1) {
      values.push(values[i - 1] + diff);
      diff += baseDiff;
    }
    return this.toMissingTermQuestion(values, "Increasing Difference");
  },

  toMissingTermQuestion(values, pattern) {
    const missingIndex = this.randomInt(0, values.length - 1);
    const answer = values[missingIndex];
    const display = values.map((value, index) => (index === missingIndex ? "?" : String(value)));
    const readableSeries = display.join("   ");

    return {
      prompt: readableSeries,
      pattern,
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

  randomFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
  },

  primeNumbers() {
    return [
      2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
      67, 71, 73, 79, 83, 89, 97,
    ];
  },

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

export default numberSeriesTool;
