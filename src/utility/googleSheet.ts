import { GoogleSpreadsheet } from 'google-spreadsheet';

export async function getData(docID: string, sheetID: string, credentialsPath: string = './credentials.json'): Promise<any[]> {
    const result = [];
    const doc = new GoogleSpreadsheet(docID);
    const creds = require(credentialsPath);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsById[sheetID];
    const rows = await sheet.getRows();
    for (var row of rows) {
        result.push(row._rawData);
    }
    return result;
}

