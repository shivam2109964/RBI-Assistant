import additionTool from "./tools/addition.js";

const tools = {
  addition: additionTool,
};

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
  questionHistory: [],
};

const ui = {
  toolTitle: document.getElementById("tool-title"),
  digitControls: document.getElementById("digit-controls"),
  leftDigits: document.getElementById("left-digits"),
  rightDigits: document.getElementById("right-digits"),
  questionDisplay: document.getElementById("question-display"),
  answerForm: document.getElementById("answer-form"),
  answerInput: document.getElementById("answer-input"),
  questionNumber: document.getElementById("question-number"),
  timerSeconds: document.getElementById("timer-seconds"),
  correctCount: document.getElementById("correct-count"),
  wrongCount: document.getElementById("wrong-count"),
  feedback: document.getElementById("feedback"),
  avgTime: document.getElementById("avg-time"),
  slowestQuestions: document.getElementById("slowest-questions"),
  accuracy: document.getElementById("accuracy"),
  toolButtons: Array.from(document.querySelectorAll(".tool-button")),
};

function getActiveTool() {
  return tools[state.activeToolKey];
}

function startTimer() {
  clearInterval(state.timerId);
  state.timerSeconds = 0;
  ui.timerSeconds.textContent = "0";

  state.timerId = setInterval(() => {
    state.timerSeconds += 1;
    ui.timerSeconds.textContent = String(state.timerSeconds);
  }, 1000);
}

function renderQuestion() {
  const tool = getActiveTool();
  state.currentQuestion = tool.generateQuestion();
  ui.toolTitle.textContent = tool.title;
  ui.questionDisplay.textContent = state.currentQuestion.prompt;
  ui.questionNumber.textContent = String(state.questionNumber);
  ui.answerInput.value = "";
  ui.answerInput.focus();
  startTimer();
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
}

function registerResult(isCorrect) {
  state.answeredQuestions += 1;
  state.totalTime += state.timerSeconds;

  state.questionHistory.push({
    questionNumber: state.questionNumber,
    prompt: state.currentQuestion.prompt,
    timeTaken: state.timerSeconds,
  });

  if (isCorrect) {
    state.correct += 1;
    ui.feedback.textContent = "Correct";
    ui.feedback.className = "feedback correct";
  } else {
    state.wrong += 1;
    const tool = getActiveTool();
    ui.feedback.textContent = `Wrong. Correct answer: ${tool.getCorrectAnswer(state.currentQuestion)}`;
    ui.feedback.className = "feedback wrong";
  }

  updateMetrics();
  state.questionNumber += 1;
  renderQuestion();
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
  updateMetrics();
  renderQuestion();
}

function handleDigitChange() {
  const tool = getActiveTool();
  if (typeof tool.setDigitCounts !== "function") {
    return;
  }

  tool.setDigitCounts(ui.leftDigits.value, ui.rightDigits.value);
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

ui.toolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.disabled) {
      return;
    }

    ui.toolButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    resetForTool(button.dataset.tool);
  });
});

ui.leftDigits.addEventListener("change", handleDigitChange);
ui.rightDigits.addEventListener("change", handleDigitChange);

resetForTool("addition");
