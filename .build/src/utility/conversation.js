var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  fetchAnswers: () => fetchAnswers,
  tackleQuestion: () => tackleQuestion
});
var import_googleSheet = __toModule(require("./googleSheet"));
const questions = {};
const keywords = {};
const SPREADSHEET_ID = "1SzgR3jF6A--5g3R2gA2AUBI32LBaaJ2_Ny5ypFhrzMU";
const FULLMATCH_ID = "0";
const CONTAIN_ID = "485506954";
const SHEET_API_KEY_PATH = process.env.SHEET_API_KEY_PATH;
async function fetchAnswers() {
  for (const key in questions) {
    delete questions[key];
  }
  for (const key in keywords) {
    delete keywords[key];
  }
  (0, import_googleSheet.getData)(SPREADSHEET_ID, FULLMATCH_ID, SHEET_API_KEY_PATH).then((response) => response.forEach((row) => questions[row[0]] = row.slice(1)));
  (0, import_googleSheet.getData)(SPREADSHEET_ID, CONTAIN_ID, SHEET_API_KEY_PATH).then((response) => response.forEach((row) => keywords[row[0]] = row.slice(1)));
}
function tackleQuestion(message) {
  var answer = "";
  var hit = 0;
  for (const key in keywords) {
    if (message.includes(key)) {
      const value = keywords[key];
      answer = value[Math.floor(Math.random() * value.length)];
      hit++;
    }
  }
  if (hit == 0) {
    for (const key in questions) {
      if (message == key) {
        const value = questions[key];
        answer = value[Math.floor(Math.random() * value.length)];
        break;
      }
    }
  } else if (hit == 1) {
    for (const key in questions) {
      if (message.includes(key)) {
        answer = "";
        break;
      }
    }
  } else {
    answer = "";
  }
  return answer;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fetchAnswers,
  tackleQuestion
});
//# sourceMappingURL=conversation.js.map
