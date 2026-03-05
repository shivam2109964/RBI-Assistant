const corePercentages = [
  { percent: 1, fraction: "1/100", decimal: 0.01 },
  { percent: 2, fraction: "1/50", decimal: 0.02 },
  { percent: 4, fraction: "1/25", decimal: 0.04 },
  { percent: 5, fraction: "1/20", decimal: 0.05 },
  { percent: 10, fraction: "1/10", decimal: 0.1 },

  { percent: 12.5, fraction: "1/8", decimal: 0.125 },
  { percent: 15, fraction: "3/20", decimal: 0.15 },
  { percent: 16.66, fraction: "1/6", decimal: 0.1666 },
  { percent: 20, fraction: "1/5", decimal: 0.2 },
  { percent: 25, fraction: "1/4", decimal: 0.25 },

  { percent: 30, fraction: "3/10", decimal: 0.3 },
  { percent: 33.33, fraction: "1/3", decimal: 0.3333 },
  { percent: 35, fraction: "7/20", decimal: 0.35 },
  { percent: 37.5, fraction: "3/8", decimal: 0.375 },
  { percent: 40, fraction: "2/5", decimal: 0.4 },

  { percent: 45, fraction: "9/20", decimal: 0.45 },
  { percent: 50, fraction: "1/2", decimal: 0.5 },
  { percent: 55, fraction: "11/20", decimal: 0.55 },
  { percent: 60, fraction: "3/5", decimal: 0.6 },
  { percent: 62.5, fraction: "5/8", decimal: 0.625 },

  { percent: 66.66, fraction: "2/3", decimal: 0.6666 },
  { percent: 70, fraction: "7/10", decimal: 0.7 },
  { percent: 75, fraction: "3/4", decimal: 0.75 },
  { percent: 80, fraction: "4/5", decimal: 0.8 },
  { percent: 83.33, fraction: "5/6", decimal: 0.8333 },

  { percent: 87.5, fraction: "7/8", decimal: 0.875 },
  { percent: 90, fraction: "9/10", decimal: 0.9 },
  { percent: 120, fraction: "6/5", decimal: 1.2 },
  { percent: 150, fraction: "3/2", decimal: 1.5 },
  { percent: 200, fraction: "2/1", decimal: 2 },

  { percent: 6.25, fraction: "1/16", decimal: 0.0625 },
  { percent: 14.28, fraction: "1/7", decimal: 0.1428 },
  { percent: 11.11, fraction: "1/9", decimal: 0.1111 },
  { percent: 22.22, fraction: "2/9", decimal: 0.2222 },
  { percent: 27.27, fraction: "3/11", decimal: 0.2727 },
  { percent: 36.36, fraction: "4/11", decimal: 0.3636 },
  { percent: 44.44, fraction: "4/9", decimal: 0.4444 },
  { percent: 54.54, fraction: "6/11", decimal: 0.5454 },
  { percent: 63.63, fraction: "7/11", decimal: 0.6363 },
  { percent: 72.72, fraction: "8/11", decimal: 0.7272 },
  { percent: 77.77, fraction: "7/9", decimal: 0.7777 },
  { percent: 81.81, fraction: "9/11", decimal: 0.8181 },
  { percent: 88.88, fraction: "8/9", decimal: 0.8888 },
  { percent: 9.09, fraction: "1/11", decimal: 0.0909 },
  { percent: 18.18, fraction: "2/11", decimal: 0.1818 },
  { percent: 27.27, fraction: "3/11", decimal: 0.2727 },
  { percent: 45.45, fraction: "5/11", decimal: 0.4545 },
  { percent: 72.72, fraction: "8/11", decimal: 0.7272 },
  { percent: 90.9, fraction: "10/11", decimal: 0.909 },
];

const percentageTool = {
  id: "percentage",
  title: "Percentage Trainer",
  settings: {
    timeLimitSeconds: 10,
  },

  getInputConfig() {
    return {
      type: "text",
      inputMode: "decimal",
      placeholder: "e.g. 1/4, 0.25, 25%",
    };
  },

  generateQuestion() {
    const entry = this.randomFrom(corePercentages);
    const type = this.randomFrom([
      "percent_to_fraction",
      "percent_to_decimal",
      "fraction_to_percent",
      "decimal_to_percent",
      "percent_of_number",
      "increase_percent",
      "decrease_percent",
    ]);

    if (type === "percent_to_fraction") {
      return {
        type,
        prompt: `Convert ${entry.percent}% to fraction`,
        entry,
      };
    }

    if (type === "percent_to_decimal") {
      return {
        type,
        prompt: `Convert ${entry.percent}% to decimal`,
        entry,
      };
    }

    if (type === "fraction_to_percent") {
      return {
        type,
        prompt: `Convert ${entry.fraction} to percentage`,
        entry,
      };
    }

    if (type === "decimal_to_percent") {
      return {
        type,
        prompt: `Convert ${entry.decimal} to percentage`,
        entry,
      };
    }

    const divisor = this.getFractionDenominator(entry.fraction);
    const multiplier = this.randomInt(8, 80);
    const base = divisor * multiplier;
    const answer = (entry.percent / 100) * base;

    if (type === "percent_of_number") {
      return {
        type,
        prompt: `${entry.percent}% of ${base} = ?`,
        entry,
        base,
        answer,
      };
    }

    if (type === "increase_percent") {
      const growthBase = this.randomInt(100, 900);
      const growthAnswer = growthBase * (1 + entry.percent / 100);
      return {
        type,
        prompt: `${growthBase} increased by ${entry.percent}% = ?`,
        entry,
        base: growthBase,
        answer: growthAnswer,
      };
    }

    const declineBase = this.randomInt(100, 900);
    const declineAnswer = declineBase * (1 - entry.percent / 100);
    return {
      type,
      prompt: `${declineBase} decreased by ${entry.percent}% = ?`,
      entry,
      base: declineBase,
      answer: declineAnswer,
    };
  },

  validateAnswer(question, userAnswer) {
    const input = this.normalizeInput(userAnswer);
    if (!input) {
      return false;
    }

    if (question.type === "percent_to_fraction") {
      return this.areEquivalentFractions(input, question.entry.fraction);
    }

    if (question.type === "percent_to_decimal") {
      return this.isCloseNumber(input, question.entry.decimal, 0.0025);
    }

    if (
      question.type === "fraction_to_percent" ||
      question.type === "decimal_to_percent"
    ) {
      const parsed = this.parsePercentValue(input);
      return (
        parsed !== null && Math.abs(parsed - question.entry.percent) <= 0.2
      );
    }

    if (
      question.type === "percent_of_number" ||
      question.type === "increase_percent" ||
      question.type === "decrease_percent"
    ) {
      return this.isCloseNumber(input, question.answer, 0.0001);
    }

    return false;
  },

  getCorrectAnswer(question) {
    if (question.type === "percent_to_fraction") {
      return question.entry.fraction;
    }

    if (question.type === "percent_to_decimal") {
      return String(question.entry.decimal);
    }

    if (
      question.type === "fraction_to_percent" ||
      question.type === "decimal_to_percent"
    ) {
      return `${question.entry.percent}%`;
    }

    if (
      question.type === "percent_of_number" ||
      question.type === "increase_percent" ||
      question.type === "decrease_percent"
    ) {
      return question.answer;
    }

    return "";
  },

  getTimeLimitSeconds() {
    return this.settings.timeLimitSeconds;
  },

  normalizeInput(value) {
    return String(value).trim().replace(/\s+/g, "");
  },

  parseFraction(value) {
    const match = value.match(/^(-?\d+)\/(-?\d+)$/);
    if (!match) {
      return null;
    }

    const numerator = Number(match[1]);
    const denominator = Number(match[2]);
    if (
      !Number.isFinite(numerator) ||
      !Number.isFinite(denominator) ||
      denominator === 0
    ) {
      return null;
    }

    return this.reduceFraction(numerator, denominator);
  },

  reduceFraction(numerator, denominator) {
    const sign = denominator < 0 ? -1 : 1;
    const a = numerator * sign;
    const b = Math.abs(denominator);
    const divisor = this.gcd(Math.abs(a), b);
    return {
      numerator: a / divisor,
      denominator: b / divisor,
    };
  },

  areEquivalentFractions(userValue, expectedValue) {
    const userFraction = this.parseFraction(userValue);
    const expectedFraction = this.parseFraction(expectedValue);
    if (!userFraction || !expectedFraction) {
      return false;
    }

    return (
      userFraction.numerator === expectedFraction.numerator &&
      userFraction.denominator === expectedFraction.denominator
    );
  },

  gcd(a, b) {
    let x = a;
    let y = b;
    while (y !== 0) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x || 1;
  },

  parsePercentValue(value) {
    const clean = value.endsWith("%") ? value.slice(0, -1) : value;
    const parsed = Number(clean);
    if (!Number.isFinite(parsed)) {
      return null;
    }
    return parsed;
  },

  isCloseNumber(inputValue, expected, tolerance) {
    const parsed = Number(inputValue);
    if (!Number.isFinite(parsed)) {
      return false;
    }
    return Math.abs(parsed - expected) <= tolerance;
  },

  getFractionDenominator(fractionText) {
    const parsed = this.parseFraction(fractionText);
    return parsed ? parsed.denominator : 1;
  },

  randomFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
  },

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

export default percentageTool;
