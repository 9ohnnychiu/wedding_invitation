# HTMX + Google Apps Script RSVP Implementation

## Summary of Changes

### 1. HTML Form Updates (`index.html`)
- Updated RSVP form to POST directly to Google Apps Script URL
- Added HTMX attributes for form handling:
  - `hx-post`: Points to Google Apps Script URL
  - `hx-target`: Response goes to `#rsvp-response` div
  - `hx-encoding`: Uses `multipart/form-data`
  - `hx-indicator`: Shows loading state
  - HTMX event handlers for button state management
- Added loading indicator div

### 2. JavaScript Cleanup (`script.js`)
- Removed all form submission JavaScript code:
  - `submitRSVP()` function
  - `submitToGoogleSheets()` function
  - `showResponse()` function
  - Form event listeners
  - Development utility functions
- Kept essential functionality:
  - Navigation scroll behavior
  - Gallery lightbox functionality
  - HTMX event handlers for response processing

### 3. CSS Updates (`styles.css`) 
- Added HTMX loading indicator styles:
  - `.htmx-indicator`: Hidden by default
  - `.htmx-request .htmx-indicator`: Shows during requests
  - `.htmx-request .submit-button`: Disabled appearance during submission

### 4. Google Apps Script Updates (`google-apps-script.js`)
- Enhanced `doPost()` function to handle both JSON and form data
- Added proper form data parsing from `e.parameter`
- Maintained CORS headers for cross-origin requests
- Added timestamp automatically for form submissions

## How It Works

1. **User submits form**: HTMX intercepts the form submission
2. **HTMX sends POST**: Data sent as `multipart/form-data` to Google Apps Script
3. **Google Apps Script processes**: Parses form data and saves to Google Sheets
4. **Response handling**: HTMX receives JSON response and updates UI
5. **Success/Error display**: JavaScript event listeners show appropriate messages

## Testing

Use `test-rsvp.html` to test the integration:
1. Open the test file in a browser
2. Fill out the form
3. Submit and check for success/error messages
4. Verify data appears in your Google Sheet

## Google Apps Script Setup Required

1. Update `SHEET_ID` in `google-apps-script.js` with your Google Sheet ID
2. Deploy the script as a web app with:
   - Execute as: Me
   - Who has access: Anyone
3. Copy the web app URL and verify it matches the URL in your HTML form

## Benefits of This Approach

- **Simpler code**: HTMX handles form submission automatically  
- **Better UX**: Built-in loading states and error handling
- **No JavaScript debugging**: Form submission is declarative in HTML
- **Reliable**: HTMX is specifically designed for this use case
- **Progressive enhancement**: Works even if JavaScript fails

## Files Modified

- `index.html`: Updated form with HTMX attributes
- `script.js`: Removed form handling code, kept HTMX event handlers
- `styles.css`: Added HTMX loading indicator styles  
- `google-apps-script.js`: Enhanced to handle form data
- `test-rsvp.html`: Created for testing (new file)
