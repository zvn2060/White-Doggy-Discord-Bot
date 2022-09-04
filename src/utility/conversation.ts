import { getData } from "./googleSheet";

const questions: { [key: string]: string[] } = {}
const keywords: { [key: string]: string[] } = {}

const SPREADSHEET_ID = "1SzgR3jF6A--5g3R2gA2AUBI32LBaaJ2_Ny5ypFhrzMU"
const FULLMATCH_ID = "0"
const CONTAIN_ID = "485506954"
const SHEET_API_KEY_PATH = process.env.SHEET_API_KEY_PATH;

export async function fetchAnswers() {
    for (const key in questions) {
        delete questions[key];
    }

    for (const key in keywords) {
        delete keywords[key];
    }

    getData(SPREADSHEET_ID, FULLMATCH_ID, SHEET_API_KEY_PATH)
        .then(response => response.forEach(row => questions[row[0]] = row.slice(1)));
    getData(SPREADSHEET_ID, CONTAIN_ID, SHEET_API_KEY_PATH)
        .then(response => response.forEach(row => keywords[row[0]] = row.slice(1)));
}

export function tackleQuestion(message: string): string {
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