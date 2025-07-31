import Database from "@/lib/database";

function generateUniqueToken(UniqueId: string): string {
  return UniqueId + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export default async function fetchSheet(SPREADSHEET_ID = process.env.SPREADSHEET_ID) {
  try {
    const API_KEY = process.env.GOOGLE_API_KEY;

    // Step 1: Get all valid sheet names
    const sheetMetaRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${API_KEY}`
    );
    const metaJson = await sheetMetaRes.json();
    const validSheetNames = metaJson.sheets.map((sheet: any) => sheet.properties.title);

    // Step 2: Fetch outlets from DB
    const outlets = await Database.query("SELECT id, lastFetchedIndex FROM outlets");

    // Step 3: Build ranges only for valid sheets
    const outletRanges = outlets
      .filter((outlet: any) => validSheetNames.includes(outlet.id.toString()))
      .map((outlet: any) => `${outlet.id}!A${outlet.lastFetchedIndex + 1}:Z`);

    if (outletRanges.length === 0) {
      return { success: false, message: "No valid outlet sheets found." };
    }

    // Step 4: Call Sheets API with batchGet
    const ranges = outletRanges.map(encodeURIComponent).join("&ranges=");
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?ranges=${ranges}&key=${API_KEY}`
    );
    const data = await res.json();
console.log(data)
    if (!data.valueRanges || data.valueRanges.length === 0) {
      return { success: false, message: "No new values found." };
    }

    // Step 5: Flatten and insert
    const allRows = data.valueRanges.flatMap(sheet => {
      const sheetName = sheet.range.split("!")[0].replace(/'/g, '');
      return (sheet.values || []).map(row => [...row, sheetName]);
    });
        if (allRows.length === 0) {
      return { success: false, message: "No new values found." };
    }

    const response = allRows.map((rowArr: any[]) => (
      [
        generateUniqueToken(rowArr[0]),
        rowArr[rowArr.length-1],
        rowArr[12],
        rowArr[13],
        rowArr[14],
        rowArr[3]?.split("-").reverse().join("-"),
        rowArr[0]
      ]
    ));
// console.log(response)
    const chunks = [];
    const chunkSize = 7;
    for (let i = 0; i < response.length; i += chunkSize) {
      chunks.push(response.slice(i, i + chunkSize));
    }
// console.log(chunks)
try {
  for (const chunk of chunks) {
    await Promise.all(chunk.map(row =>
      Database.insert(
        `INSERT IGNORE INTO feedback_links (token, outlet_id, name, phone, email,arrival_date, unique_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        row
      )
    ));
  } 
  await Promise.all(
    data.valueRanges.map(subsheet =>
      Database.query(
        `UPDATE outlets SET lastFetchedIndex = lastFetchedIndex + ? WHERE id = ?`,
        [
          subsheet.values?.length || 0,
          subsheet.range.split("!")[0].replace(/'/g, '')
        ]
      )
    )
  );

  await Promise.all(
    data.valueRanges.map(subsheet =>
      subsheet.values.map(row =>
      Database.insert(
        `INSERT IGNORE INTO customers (unique_id, location, place, booking_date, time_stamp, booking_type, group_type, game_and_slot, upcoming_event_date_time, form_number, team_id, team_name, name, phone, email, gender, dob, anniversary_date, signature, id_proof) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          row[0],
          row[1],
          row[2],
          row[3]?.split("-").reverse().join("-"),
          row[4],
          row[5],
          row[6],
          row[7],
          row[8]?.split("-").reverse().join("-"),
          row[9],
          row[10],
          row[11],
          row[12],
          row[13],
          row[14],
          row[15],
          row[16]?.split("-").reverse().join("-"),
          // subsheet.val[0]ues[18-1],
          row[18],
          row[19],
          row[20],
        ]
      )
    )
    )
  )
 
  
} catch (error) {
  console.error("Insert failed, rolling back...", error);

  for (const chunk of chunks) {
    await Promise.all(chunk.map(row =>
      Database.query(
        `DELETE IGNORE FROM feedback_links WHERE unique_id = ?`,
        [row[6]] // wrap in array to match single param
      )
    ));
  }

}

    return { success: true, data: data.valueRanges };

  } catch (err) {
    console.error(err);
    return { success: false, message: "Error fetching sheet data." };
  }
}
