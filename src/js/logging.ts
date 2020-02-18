// https://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number

/* tslint:disable no-console */

const _consoleTrace = console.info.bind(
  window.console,
  "%ctrace",
  "background-color: #EEE; color: #666;"
);
const _consoleInfo = console.info.bind(
  window.console,
  "%cinfo",
  "background-color: #DDF; color: #666;"
);

const _consoleReport = console.log.bind(
  window.console,
  "%creport",
  "background-color: #66F; color: white;"
);
const _consoleLog = console.log.bind(
  window.console,
  "%clog",
  "background-color: gray; color: white;"
);

const _consoleWarn = console.warn.bind(
  window.console,
  "%cwarn",
  "background-color: black; color: yellow;"
);
const _consoleError = console.error.bind(
  window.console,
  "%cerror",
  "background-color: black; color: red;"
);

const _friendlyError = console.error.bind(
  window.console,
  "%cSmudge Error",
  "background-color: #ff8888; color: white; padding: 5px 10px; border-radius: 4px;"
);

/** @hidden */
export let consoleTrace = _consoleTrace;
/** @hidden */
export let consoleInfo = _consoleInfo;
/** @hidden */
export let consoleReport = _consoleReport;
/** @hidden */
export let consoleLog = _consoleLog;
/** @hidden */
export let consoleWarn = _consoleWarn;
/** @hidden */
export let consoleError = _consoleError;
/** @hidden */
export let friendlyError = _friendlyError;

/** @hidden */
export const setLoggingLevel = (
  level: "trace" | "info" | "report" | "log" | "warn" | "error"
) => {
  const levelNum = ["trace", "info", "report", "log", "warn", "error"].indexOf(
    level
  );
  if (levelNum === -1) {
    return;
  }
  consoleTrace = nothing;
  consoleInfo = nothing;
  consoleReport = nothing;
  consoleLog = nothing;
  consoleWarn = nothing;
  consoleError = nothing;
  if (0 >= levelNum) {
    consoleTrace = _consoleTrace;
  }
  if (1 >= levelNum) {
    consoleInfo = _consoleInfo;
  }
  if (2 >= levelNum) {
    consoleReport = _consoleReport;
  }
  if (3 >= levelNum) {
    consoleLog = _consoleLog;
  }
  if (4 >= levelNum) {
    consoleWarn = _consoleWarn;
  }
  if (5 >= levelNum) {
    consoleError = _consoleError;
  }
};

function nothing() {
  // nothing
}

// consoleTrace("consoleTrace");
// consoleInfo("consoleInfo");
// consoleReport("consoleReport");
// consoleLog("consoleLog");
// consoleWarn("consoleWarn");
// consoleError("consoleError");

// really silly, but neat trick

// function randomNumber() {
//     return 1;
// }

// randomNumber.toString = () => {
//     return "" + Math.random();
// };

// export const consoleTrace = console.info.bind(window.console, randomNumber, "%ctrace", "background-color: #EEE; color: #666;");
