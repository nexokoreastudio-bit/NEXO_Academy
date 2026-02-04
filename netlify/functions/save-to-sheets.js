// Netlify Function: 아카데미 관계자 견적/상담 폼 → Google Sheets 저장
// 스프레드시트: https://docs.google.com/spreadsheets/d/1pMiZfYkhcyKYTc3Y1oQbvbg4nTxmAnD85HuXZbAPKE8/
// Netlify 환경 변수: GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY
const { google } = require('googleapis');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body);
    const {
      GOOGLE_SHEET_ID,
      GOOGLE_SERVICE_ACCOUNT_EMAIL,
      GOOGLE_PRIVATE_KEY,
    } = process.env;

    if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Server configuration error',
          details: 'Missing env: GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY',
        }),
      };
    }

    const {
      customer_name,
      phone_number,
      org_name,
      address,
      order_summary,
      mount_type,
      elevator,
      payment,
    } = body;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const meta = await sheets.spreadsheets.get({ spreadsheetId: GOOGLE_SHEET_ID });
    const firstSheetTitle = meta.data.sheets?.[0]?.properties?.title || 'Sheet1';
    const range = `'${firstSheetTitle}'!A:J`;

    const timestamp = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    const rowValues = [
      timestamp,
      customer_name || '',
      phone_number || '',
      org_name || '',
      address || '',
      order_summary || '',
      mount_type || '',
      elevator || '',
      payment || '',
      '아카데미',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [rowValues] },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: '데이터가 Google Sheets에 저장되었습니다.' }),
    };
  } catch (error) {
    console.error('[save-to-sheets]', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to save to Google Sheets', details: error.message }),
    };
  }
};
