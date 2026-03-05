import additionTool from "./tools/addition.js";
import subtractionTool from "./tools/subtraction.js";
import multiplicationTool from "./tools/multiplication.js";
import divisionTool from "./tools/division.js";
import tableTool from "./tools/table.js";
import percentageTool from "./tools/percentage.js";
import squareCubeTool from "./tools/squareCube.js";
import squareRootTool from "./tools/squareRoot.js";
import simplificationTool from "./tools/simplification.js";
import numberSeriesTool from "./tools/numberSeries.js";
import mixTool from "./tools/mix.js";

const tools = {
  addition: additionTool,
  subtraction: subtractionTool,
  multiplication: multiplicationTool,
  division: divisionTool,
  table: tableTool,
  percentage: percentageTool,
  squareCube: squareCubeTool,
  squareRoot: squareRootTool,
  simplification: simplificationTool,
  numberSeries: numberSeriesTool,
  mix: mixTool,
};

const OVERALL_ANALYTICS_KEY = "rapidMathOverallAnalytics";
const ANALYTICS_VIEW_KEY = "analytics";

function loadOverallAnalytics() {
  try {
    const raw = localStorage.getItem(OVERALL_ANALYTICS_KEY);
    if (!raw) {
      return {
        attempts: 0,
        correct: 0,
        wrong: 0,
        totalTime: 0,
      };
    }

    const parsed = JSON.parse(raw);
    return {
      attempts: Number(parsed.attempts) || 0,
      correct: Number(parsed.correct) || 0,
      wrong: Number(parsed.wrong) || 0,
      totalTime: Number(parsed.totalTime) || 0,
    };
  } catch {
    return {
      attempts: 0,
      correct: 0,
      wrong: 0,
      totalTime: 0,
    };
  }
}

function saveOverallAnalytics(analytics) {
  localStorage.setItem(OVERALL_ANALYTICS_KEY, JSON.stringify(analytics));
}

const state = {
  activeToolKey: "addition",
  currentQuestion: null,
  questionNumber: 1,
  correct: 0,
  wrong: 0,
  totalTime: 0,
  answeredQuestions: 0,
  timerSeconds: 0,
  timerId: null,
  timerRunning: false,
  questionHistory: [],
  patternStats: {},
  overallAnalytics: loadOverallAnalytics(),
};

const ui = {
  toolTitle: document.getElementById("tool-title"),
  digitControls: document.getElementById("digit-controls"),
  leftDigits: document.getElementById("left-digits"),
  rightDigits: document.getElementById("right-digits"),
  powerModeControls: document.getElementById("power-mode-controls"),
  powerMode: document.getElementById("power-mode"),
  questionDisplay: document.getElementById("question-display"),
  answerForm: document.getElementById("answer-form"),
  answerInput: document.getElementById("answer-input"),
  timerStartButton: document.getElementById("timer-start-button"),
  timerStopButton: document.getElementById("timer-stop-button"),
  questionNumber: document.getElementById("question-number"),
  timerSeconds: document.getElementById("timer-seconds"),
  correctCount: document.getElementById("correct-count"),
  wrongCount: document.getElementById("wrong-count"),
  feedback: document.getElementById("feedback"),
  avgTime: document.getElementById("avg-time"),
  slowestQuestions: document.getElementById("slowest-questions"),
  accuracy: document.getElementById("accuracy"),
  patternInsight: document.getElementById("pattern-insight"),
  overallAttempts: document.getElementById("overall-attempts"),
  overallCorrect: document.getElementById("overall-correct"),
  overallWrong: document.getElementById("overall-wrong"),
  overallAvgTime: document.getElementById("overall-avg-time"),
  practiceView: document.getElementById("practice-view"),
  analyticsView: document.getElementById("analytics-view"),
  toolButtons: Array.from(document.querySelectorAll(".tool-button")),
};

function getActiveTool() {
  return tools[state.activeToolKey];
}

function syncTimerButtons() {
  ui.timerStartButton.disabled = state.timerRunning;
  ui.timerStopButton.disabled = !state.timerRunning;
}

function getActiveToolTimeLimit() {
  const tool = getActiveTool();
  return typeof tool.getTimeLimitSeconds === "function"
    ? Number(tool.getTimeLimitSeconds())
    : Number(tool.settings?.timeLimitSeconds);
}

function pauseTimer() {
  clearInterval(state.timerId);
  state.timerId = null;
  state.timerRunning = false;
  syncTimerButtons();
}

function startTimer(reset = false) {
  const timeLimit = getActiveToolTimeLimit();

  if (reset) {
    state.timerSeconds = 0;
    ui.timerSeconds.textContent = "0";
  }

  clearInterval(state.timerId);
  state.timerRunning = true;
  syncTimerButtons();

  state.timerId = setInterval(() => {
    state.timerSeconds += 1;
    ui.timerSeconds.textContent = String(state.timerSeconds);

    if (Number.isFinite(timeLimit) && timeLimit > 0 && state.timerSeconds >= timeLimit) {
      pauseTimer();
      registerResult(false, { reason: "timeout" });
    }
  }, 1000);
}

function renderQuestion() {
  const tool = getActiveTool();
  configureAnswerInput(tool);
  state.currentQuestion = tool.generateQuestion();
  ui.toolTitle.textContent = tool.title;
  ui.questionDisplay.classList.toggle("series-question", state.activeToolKey === "numberSeries");
  if (state.currentQuestion.promptHtml) {
    ui.questionDisplay.innerHTML = state.currentQuestion.promptHtml;
  } else {
    ui.questionDisplay.textContent = state.currentQuestion.prompt;
  }
  ui.questionNumber.textContent = String(state.questionNumber);
  ui.answerInput.value = "";
  ui.answerInput.focus();
  startTimer(true);
}

function configureAnswerInput(tool) {
  const inputConfig = typeof tool.getInputConfig === "function"
    ? tool.getInputConfig()
    : {};

  const type = inputConfig.type ?? "text";
  const inputMode = inputConfig.inputMode ?? "numeric";
  const placeholder = inputConfig.placeholder ?? "Type your answer";

  ui.answerInput.type = type;
  ui.answerInput.placeholder = placeholder;
  ui.answerInput.setAttribute("inputmode", inputMode);
}

function syncDigitControls() {
  const tool = getActiveTool();
  const canConfigureDigits = typeof tool.setDigitCounts === "function" && tool.settings;

  ui.digitControls.hidden = !canConfigureDigits;
  if (!canConfigureDigits) {
    return;
  }

  ui.leftDigits.value = String(tool.settings.leftDigits ?? 1);
  ui.rightDigits.value = String(tool.settings.rightDigits ?? 1);
}

function syncPowerModeControls() {
  const tool = getActiveTool();
  const canConfigureMode = typeof tool.setMode === "function" && tool.settings;

  ui.powerModeControls.hidden = !canConfigureMode;
  if (!canConfigureMode) {
    return;
  }

  ui.powerMode.value = String(tool.settings.mode ?? "mix");
}

function formatSlowestQuestions() {
  if (!state.questionHistory.length) {
    return "-";
  }

  const slowest = [...state.questionHistory]
    .sort((a, b) => b.timeTaken - a.timeTaken)
    .slice(0, 3)
    .map((q) => `Q${q.questionNumber} (${q.timeTaken}s)`);

  return slowest.join(", ");
}

function updateMetrics() {
  ui.correctCount.textContent = String(state.correct);
  ui.wrongCount.textContent = String(state.wrong);

  const avg = state.answeredQuestions ? state.totalTime / state.answeredQuestions : 0;
  ui.avgTime.textContent = `${avg.toFixed(2)}s`;

  const accuracy = state.answeredQuestions
    ? (state.correct / state.answeredQuestions) * 100
    : 0;
  ui.accuracy.textContent = `${accuracy.toFixed(1)}%`;

  ui.slowestQuestions.textContent = formatSlowestQuestions();
  ui.patternInsight.textContent = formatPatternInsight();
  updateOverallAnalyticsUi();
}

function updateOverallAnalyticsUi() {
  const overall = state.overallAnalytics;
  const overallAvg = overall.attempts ? overall.totalTime / overall.attempts : 0;

  ui.overallAttempts.textContent = String(overall.attempts);
  ui.overallCorrect.textContent = String(overall.correct);
  ui.overallWrong.textContent = String(overall.wrong);
  ui.overallAvgTime.textContent = `${overallAvg.toFixed(2)}s`;
}

function registerPatternResult(isCorrect) {
  const pattern = state.currentQuestion?.pattern;
  if (!pattern) {
    return;
  }

  const key = `${state.activeToolKey}::${pattern}`;
  if (!state.patternStats[key]) {
    state.patternStats[key] = {
      attempts: 0,
      correct: 0,
      totalTime: 0,
      pattern,
      toolId: state.activeToolKey,
    };
  }

  state.patternStats[key].attempts += 1;
  state.patternStats[key].totalTime += state.timerSeconds;
  if (isCorrect) {
    state.patternStats[key].correct += 1;
  }
}

function formatPatternInsight() {
  const entries = Object.values(state.patternStats)
    .filter((entry) => entry.toolId === state.activeToolKey && entry.attempts > 0);

  if (!entries.length) {
    return "-";
  }

  let weakest = entries[0];
  for (let i = 1; i < entries.length; i += 1) {
    const current = entries[i];
    const currentAccuracy = current.correct / current.attempts;
    const weakestAccuracy = weakest.correct / weakest.attempts;

    if (currentAccuracy < weakestAccuracy) {
      weakest = current;
      continue;
    }

    if (currentAccuracy === weakestAccuracy) {
      const currentAvg = current.totalTime / current.attempts;
      const weakestAvg = weakest.totalTime / weakest.attempts;
      if (currentAvg > weakestAvg) {
        weakest = current;
      }
    }
  }

  const avgTime = weakest.totalTime / weakest.attempts;
  const accuracy = (weakest.correct / weakest.attempts) * 100;
  return `${weakest.pattern}: ${avgTime.toFixed(1)}s, ${accuracy.toFixed(0)}%`;
}

function registerResult(isCorrect, options = {}) {
  state.answeredQuestions += 1;
  state.totalTime += state.timerSeconds;

  state.questionHistory.push({
    questionNumber: state.questionNumber,
    prompt: state.currentQuestion.prompt,
    timeTaken: state.timerSeconds,
  });
  registerPatternResult(isCorrect);
  state.overallAnalytics.attempts += 1;
  state.overallAnalytics.totalTime += state.timerSeconds;

  if (isCorrect) {
    state.correct += 1;
    state.overallAnalytics.correct += 1;
    ui.feedback.textContent = "Correct";
    ui.feedback.className = "feedback correct";
  } else {
    state.wrong += 1;
    state.overallAnalytics.wrong += 1;
    const tool = getActiveTool();
    const prefix = options.reason === "timeout" ? "Time up." : "Wrong.";
    ui.feedback.textContent = `${prefix} Correct answer: ${tool.getCorrectAnswer(state.currentQuestion)}`;
    ui.feedback.className = "feedback wrong";
  }

  saveOverallAnalytics(state.overallAnalytics);
  updateMetrics();
  state.questionNumber += 1;
  renderQuestion();
}

function showPracticeView() {
  ui.practiceView.hidden = false;
  ui.analyticsView.hidden = true;
}

function showAnalyticsView() {
  pauseTimer();
  updateOverallAnalyticsUi();
  ui.practiceView.hidden = true;
  ui.analyticsView.hidden = false;
}

function resetForTool(toolKey) {
  state.activeToolKey = toolKey;
  state.currentQuestion = null;
  state.questionNumber = 1;
  state.correct = 0;
  state.wrong = 0;
  state.totalTime = 0;
  state.answeredQuestions = 0;
  state.questionHistory = [];
  ui.feedback.textContent = "";
  ui.feedback.className = "feedback";
  syncDigitControls();
  syncPowerModeControls();
  updateMetrics();
  renderQuestion();
}

function handleDigitChange() {
  const tool = getActiveTool();
  if (typeof tool.setDigitCounts !== "function") {
    return;
  }

  tool.setDigitCounts(ui.leftDigits.value, ui.rightDigits.value);
  syncDigitControls();
  state.currentQuestion = null;
  renderQuestion();
}

function handlePowerModeChange() {
  const tool = getActiveTool();
  if (typeof tool.setMode !== "function") {
    return;
  }

  tool.setMode(ui.powerMode.value);
  syncPowerModeControls();
  state.currentQuestion = null;
  renderQuestion();
}

ui.answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const userAnswer = ui.answerInput.value.trim();
  if (!userAnswer) {
    return;
  }

  const tool = getActiveTool();
  const isCorrect = tool.validateAnswer(state.currentQuestion, userAnswer);
  registerResult(isCorrect);
});
ui.timerStartButton.addEventListener("click", () => {
  if (state.timerRunning || !state.currentQuestion) {
    return;
  }

  startTimer(false);
});

ui.timerStopButton.addEventListener("click", () => {
  if (!state.timerRunning) {
    return;
  }

  pauseTimer();
});

ui.toolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.disabled) {
      return;
    }

    ui.toolButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const selectedTool = button.dataset.tool;
    if (selectedTool === ANALYTICS_VIEW_KEY) {
      showAnalyticsView();
      return;
    }

    showPracticeView();
    resetForTool(selectedTool);
  });
});

ui.leftDigits.addEventListener("change", handleDigitChange);
ui.rightDigits.addEventListener("change", handleDigitChange);
ui.powerMode.addEventListener("change", handlePowerModeChange);

showPracticeView();
resetForTool("addition");
