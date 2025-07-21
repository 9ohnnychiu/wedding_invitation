# Wedding Website - HTMX SPA with RSVP

A beautiful, responsive wedding website built with HTMX featuring a single-page application design and Google Sheets RSVP integration.

## Features

- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ⚡ **HTMX SPA**: Smooth single-page application experience
- 📝 **RSVP Form**: Comprehensive form with Google Sheets integration
- 🖼️ **Photo Gallery**: Interactive gallery with lightbox functionality
- 🎨 **Modern Design**: Elegant typography and smooth animations
- 🚀 **GitHub Pages Ready**: Static deployment compatible

## File Structure

```
wedding_htmx/
├── index.html              # Main HTML file
├── styles.css              # CSS styles with responsive design
├── script.js               # JavaScript for HTMX and form handling
├── google-apps-script.js   # Google Apps Script for RSVP backend
├── wedding_pictures/       # Wedding photo assets
├── README.md              # This file
└── ...
```

## Setup Instructions

### 1. Basic Website Setup

1. Clone or download this repository
2. Update the wedding details in `index.html`:
   - Replace "新郎" and "新娘" with actual names
   - Update wedding date and venue information
   - Customize the story sections

### 2. Google Sheets RSVP Setup

#### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Rename it to "Wedding RSVP Responses"
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)

#### Step 2: Setup Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Replace the default code with the content from `google-apps-script.js`
4. Replace `YOUR_GOOGLE_SHEET_ID` with your actual Sheet ID
5. Save the project

#### Step 3: Deploy Web App
1. Click "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set execute as "Me"
4. Set access to "Anyone"
5. Click "Deploy"
6. Copy the Web App URL

#### Step 4: Update Website
1. Open `script.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your Web App URL
3. Test the RSVP form

### 3. Photo Management

1. Add your wedding photos to the `wedding_pictures/` folder
2. Update the image references in `index.html` to match your photo filenames
3. Optimize images for web (recommended: max 1200px width, compressed)

### 4. GitHub Pages Deployment

1. Create a GitHub repository
2. Upload all files to the repository
3. Go to repository Settings → Pages
4. Select "Deploy from branch" and choose "main" branch
5. Your website will be available at `https://yourusername.github.io/repository-name`

## Customization

### Colors and Styling
- Primary color: `#d4b99c` (warm beige)
- Edit `styles.css` to change colors, fonts, and layout
- All colors are CSS variables for easy customization

### Content Updates
- Update text content directly in `index.html`
- Replace photos in the `wedding_pictures/` folder
- Modify form fields in the RSVP section as needed

### RSVP Form Fields
Current form includes:
- Name (required)
- Attendance confirmation
- Number of guests
- Dietary requirements
- Alcohol preferences
- Transportation method
- Contact information
- Relationship to bride/groom
- Personal message

You can modify these fields in both `index.html` and `google-apps-script.js`.

## Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Development

### Local Testing
1. Use a local web server (e.g., Python's `http.server`, Node.js `live-server`, or VS Code Live Server)
2. Open `http://localhost:port` in your browser
3. Test all functionality including form submission

### RSVP Testing
- During development, RSVP data is saved to browser's localStorage
- Use browser console functions:
  - `downloadRSVPData()` - Download test data as JSON
  - `clearRSVPData()` - Clear test data

## Troubleshooting

### RSVP Form Issues
1. **Form not submitting**: Check Google Apps Script URL is correct
2. **CORS errors**: Ensure Google Apps Script is deployed with "Anyone" access
3. **Data not appearing in sheet**: Verify Sheet ID is correct

### Display Issues
1. **Images not loading**: Check file paths and ensure images exist
2. **Responsive issues**: Test on different screen sizes using browser dev tools
3. **HTMX not working**: Verify HTMX CDN is loading correctly

## Performance Tips

1. **Optimize images**: Compress and resize before uploading
2. **Minimize HTTP requests**: Consider combining CSS/JS files for production
3. **Use CDN**: HTMX and Alpine.js are loaded from CDN for better performance

## Security Considerations

- Google Apps Script handles RSVP data securely
- No sensitive information is exposed in client-side code
- Form validation prevents common injection attacks

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Google Apps Script logs for backend issues
3. Test in different browsers to isolate problems

---

**Happy Wedding! 🎉👰🤵💕**