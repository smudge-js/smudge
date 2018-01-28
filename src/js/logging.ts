// https://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number


export const consoleTrace = console.info.bind(window.console, "%ctrace", "background-color: #EEE; color: #666;");
export const consoleInfo = console.info.bind(window.console, "%cinfo", "background-color: #DDF; color: #666;");

export const consoleReport = console.log.bind(window.console, "%creport", "background-color: gray; color: white;");
export const consoleLog = console.log.bind(window.console, "%clog", "background-color: gray; color: white;");

export const consoleWarn = console.warn.bind(window.console, "%cwarn", "background-color: black; color: yellow;");
export const consoleError = console.error.bind(window.console, "%cerror", "background-color: black; color: red;");


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
