// https://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number


/** @hidden */
export const consoleReport = console.log.bind(window.console, "%creport", "background-color: gray; color: white;");



/** @hidden */
export const consoleError = console.error.bind(window.console, "%cerror", "background-color: red; color: white;");




export const consoleTrace = console.info.bind(window.console, "%ctrace", "background-color: #EEE; color: #666;");




// really silly, but neat trick

// function randomNumber() {
//     return 1;
// }

// randomNumber.toString = () => {
//     return "" + Math.random();
// };

// export const consoleTrace = console.info.bind(window.console, randomNumber, "%ctrace", "background-color: #EEE; color: #666;");
