/**
 * Google Apps Script for Wedding RSVP Form
 * 
 * Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Save and deploy as a web app
 * 5. Copy the web app URL and replace 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' in script.js
 * 
 * Setup Steps:
 * 1. Create a Google Sheet with the following columns in row 1:
 *    - Timestamp, Name, Attendance, Guests, Dietary, Alcohol, Transportation, 
 *    - Contact, Bride_Side, Groom_Side, Message
 * 2. Note the Sheet ID from the URL
 * 3. Replace 'YOUR_GOOGLE_SHEET_ID' below with your actual Sheet ID
 */

// Replace with your Google Sheet ID
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
const SHEET_NAME = 'RSVP Responses';

/**
 * Handle POST requests from the wedding website
 */
function doPost(e) {
  try {
    // Parse the request data
    const data = JSON.parse(e.postData.contents);
    
    // Log the received data for debugging
    console.log('Received RSVP data:', data);
    
    // Add the data to the Google Sheet
    const result = addRSVPToSheet(data);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'RSVP submitted successfully',
        rowNumber: result.rowNumber
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
  } catch (error) {
    console.error('Error processing RSVP:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Failed to submit RSVP: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
}

/**
 * Handle preflight OPTIONS requests for CORS
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')
    .setHeader('Access-Control-Max-Age', '86400');
}

/**
 * Add RSVP data to Google Sheet
 */
function addRSVPToSheet(data) {
  try {
    // Open the Google Sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      const newSheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // Add headers
      const headers = [
        'Timestamp', 'Name', 'Attendance', 'Guests', 'Dietary', 
        'Alcohol', 'Transportation', 'Contact', 'Bride_Side', 
        'Groom_Side', 'Message'
      ];
      newSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers
      newSheet.getRange(1, 1, 1, headers.length)
        .setFontWeight('bold')
        .setBackground('#f0f0f0');
      
      sheet = newSheet;
    }
    
    // Prepare the row data
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.attendance || '',
      data.guests || '',
      data.dietary || '',
      data.alcohol || '',
      data.transportation || '',
      data.contact || '',
      data.bride_side || '',
      data.groom_side || '',
      data.message || ''
    ];
    
    // Add the data to the sheet
    const lastRow = sheet.getLastRow();
    const newRowNumber = lastRow + 1;
    sheet.getRange(newRowNumber, 1, 1, rowData.length).setValues([rowData]);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, rowData.length);
    
    console.log('RSVP added to sheet at row:', newRowNumber);
    
    return {
      success: true,
      rowNumber: newRowNumber
    };
    
  } catch (error) {
    console.error('Error adding to sheet:', error);
    throw error;
  }
}

/**
 * Test function to verify the script works
 */
function testRSVP() {
  const testData = {
    timestamp: new Date().toISOString(),
    name: 'Test User',
    attendance: 'yes',
    guests: '2',
    dietary: 'No special requirements',
    alcohol: 'yes',
    transportation: 'Car',
    contact: '0912345678',
    bride_side: 'friend',
    groom_side: '',
    message: 'Congratulations!'
  };
  
  try {
    const result = addRSVPToSheet(testData);
    console.log('Test successful:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

/**
 * Initialize the sheet with headers (run this once)
 */
function initializeSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
    
    // Add headers
    const headers = [
      'Timestamp', 'Name', 'Attendance', 'Guests', 'Dietary', 
      'Alcohol', 'Transportation', 'Contact', 'Bride_Side', 
      'Groom_Side', 'Message'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#d4b99c')
      .setFontColor('white');
    
    // Set column widths
    sheet.setColumnWidth(1, 150); // Timestamp
    sheet.setColumnWidth(2, 100); // Name
    sheet.setColumnWidth(3, 80);  // Attendance
    sheet.setColumnWidth(4, 60);  // Guests
    sheet.setColumnWidth(5, 150); // Dietary
    sheet.setColumnWidth(6, 80);  // Alcohol
    sheet.setColumnWidth(7, 150); // Transportation
    sheet.setColumnWidth(8, 120); // Contact
    sheet.setColumnWidth(9, 100); // Bride_Side
    sheet.setColumnWidth(10, 100); // Groom_Side
    sheet.setColumnWidth(11, 200); // Message
    
    console.log('Sheet initialized successfully');
    
  } catch (error) {
    console.error('Error initializing sheet:', error);
  }
}

/**
 * Get all RSVP responses (for admin use)
 */
function getAllRSVPs() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      return { success: false, message: 'Sheet not found' };
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const responses = data.slice(1).map(row => {
      const response = {};
      headers.forEach((header, index) => {
        response[header] = row[index];
      });
      return response;
    });
    
    return {
      success: true,
      responses: responses,
      count: responses.length
    };
    
  } catch (error) {
    console.error('Error getting RSVPs:', error);
    return { success: false, message: error.toString() };
  }
}