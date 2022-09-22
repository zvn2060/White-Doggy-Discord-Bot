import { getData } from "./googleSheet";

const questions = new Map<string, string[]>();
const keywords = new Map<string, string[]>();

const SPREADSHEET_ID = "1SzgR3jF6A--5g3R2gA2AUBI32LBaaJ2_Ny5ypFhrzMU"
const FULLMATCH_ID = "0"
const CONTAIN_ID = "485506954"
const SHEET_API_KEY_PATH = process.env.SHEET_API_KEY_PATH;

export async function fetchAnswers() {
    questions.clear();
    keywords.clear();
    getData(SPREADSHEET_ID, FULLMATCH_ID, SHEET_API_KEY_PATH)
        .then(response => response.forEach(row => questions.set(row[0], row.slice(1))));
    getData(SPREADSHEET_ID, CONTAIN_ID, SHEET_API_KEY_PATH)
        .then(response => response.forEach(row => keywords.set(row[0], row.slice(1))));
}

export function tackleQuestion(message: string): string {
    var answer = "";
    var hit = 0;
    for (const [key, value] of keywords) {
        if (message.includes(key)) {
            answer = value[Math.floor(Math.random() * value.length)];
            hit++;
        }
    }

    if (hit == 0) {
        for (const [key, value] of questions) {
            if (message == key) {
                answer = value[Math.floor(Math.random() * value.length)];
                break;
            }
        }
    } else if (hit == 1) {
        for (const key of questions.keys()) {
            if (message.includes(key)) {
                answer = "";
                break;
            }
        }
    } else {
        answer = "";
    }


    return injectValues(answer);
}


function injectValues(response: string): string {

    // inject random fixed decimal
    var injected = response.replace(/< *\%\.(\d+)f *, *(\d+) *, *(\d+) *>/, decimalReplacer);

    injected = injected.replace(/< *\%d *, *(\d+) *, *(\d+) *>/, integerReplacer)

    return injected;
}

function decimalReplacer(match: string, decimal: string, min: string, max: string, offset: number, string: string) {
    return (Math.random() * (parseFloat(max) - parseFloat(min)) + parseFloat(min)).toFixed(parseInt(decimal));
}

function integerReplacer(match: string, min: string, max: string, offset: number, string: string): string {
    return (Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) + parseInt(min)).toString();
}