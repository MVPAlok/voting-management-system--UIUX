# 🚀 Quick Start Guide - Election Wizard

## ⚡ Getting Started Instantly

### Option 1: Using Python (Easiest)

```bash
cd "c:\Users\sy753\Patternprinting.c\OneDrive\Documents\WEB Development\voting management system"
python -m http.server 8000
```

Then open: **http://localhost:8000**

### Option 2: Using Node.js

```bash
node server.js
```

Then open: **http://localhost:3000**

### Option 3: Using VS Code Live Server Extension

1. Right-click on `index.html`
2. Select "Open with Live Server"
3. Browser opens automatically

### Option 4: Direct File Access

Simply double-click `index.html` in Windows Explorer
(Limited functionality - better to use a local server)

---

## 📋 What's Implemented

### ✅ Complete 7-Step Wizard

1. **Election Basics** - Name, type, description, organization, timezone
2. **Candidates Setup** - Manual entry or CSV upload (2+ required)
3. **Voter Authorization** - Email entry, verification methods
4. **Ballot Configuration** - Voting type, vote change, anonymity
5. **Election Timeline** - Start/end times, result visibility
6. **Security & Compliance** - Read-only security display
7. **Review & Confirm** - Summary and confirmation

### ✅ Smart Features

- ✨ **Auto-Save Draft** - Saves to browser localStorage every 2 seconds
- ✨ **Progress Tracking** - Visual indicator showing step progress
- ✨ **Inline Validation** - Real-time error messages
- ✨ **CSV Import** - Drag-and-drop candidate list import
- ✨ **Responsive Design** - Works on mobile, tablet, desktop
- ✨ **Dark Mode** - Full dark theme support
- ✨ **Smooth Animations** - Professional transitions between steps

---

## 🎮 How to Test

### Test Election Basics (Step 1):

1. Click "Create Election" button
2. Fill in all required fields:
   - Election Name: "Student Council 2024"
   - Type: "Student Election"
   - Description: "Annual student body election"
   - Organization: "XYZ University"
   - Timezone: "Eastern (EST)"
3. Click "Continue →"

### Test Candidates (Step 2):

**Method 1 - Manual Entry:**

1. Enter candidate name and ID
2. Click "Add" button
3. Add at least 2 candidates
4. Click "Continue →"

**Method 2 - CSV Upload:**

1. Click "Upload CSV" tab
2. Drag CSV file or click to browse
3. Expected CSV format:

```
Name,ID,Photo
John Smith,STU001,
Jane Doe,STU002,
Bob Jones,STU003,
```

### Test Voters (Step 3):

1. Select "Manual Entry" radio button
2. Enter voter email: test@example.com
3. Click "Add Voter"
4. Select at least one verification method
5. Click "Continue →"

### Test Ballot (Step 4):

1. Select voting type (Single Choice, Multiple, Ranked)
2. Toggle "Allow vote change"
3. Toggle "Anonymous voting"
4. Click "Continue →"

### Test Timeline (Step 5):

1. Set "Start Date & Time" to tomorrow
2. Set "End Date & Time" to 2 days from now
3. Select result visibility
4. Click "Continue →"

### Test Security (Step 6):

1. Review security features (read-only)
2. Click "Continue →"

### Test Review (Step 7):

1. Review complete summary
2. Check confirmation checkbox
3. Click "Create Election" button
4. See success screen with Election ID

---

## 🧪 Testing Scenarios

### Test Auto-Save:

1. Fill Step 1 fields
2. Refresh page (F5)
3. All data should still be there ✅

### Test Validation:

1. Click "Continue" without filling fields
2. See error messages appear ✅

### Test CSV Upload:

1. Create test.csv file:

```
Name,ID,Photo
Alice,A001,
Bob,B001,
Charlie,C001,
```

2. Drag onto upload zone
3. Should import all 3 candidates ✅

### Test Navigation:

1. Go to Step 3
2. Click "Back" button
3. Should return to Step 2 ✅

### Test Mobile:

1. Open on smartphone
2. All UI should be responsive ✅
3. Touch controls should work ✅

---

## 📊 Form Data Saved to Browser

All election data is automatically saved to browser localStorage:

- **Storage Key:** `electionDraft`
- **Location:** Browser cache (not sent to server)
- **Persistence:** Survives page refresh, browser restart
- **Clear:** Automatically cleared after successful creation

To view saved data in browser console:

```javascript
JSON.parse(localStorage.getItem("electionDraft"));
```

---

## 🎨 Customization

### Change Color Scheme:

Edit Tailwind colors in create-election.html:

```javascript
colors: {
    "primary": "#ea2a33",        // Red accent
    "navy-deep": "#0A1F44",      // Dark blue
    // ... edit these values
}
```

### Change Timezone Options:

Edit select options in create-election.html Step 1:

```html
<option value="IST">Indian Standard Time (IST)</option>
<!-- Add more options here -->
```

### Modify Step Count:

In app.js, change `totalSteps`:

```javascript
this.totalSteps = 7; // Increase/decrease
```

---

## 🔗 Integration with Backend

The wizard is ready for backend integration:

### After Election Creation:

```javascript
// In app.js createElection() method, add:
const response = await fetch("/api/elections/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(this.electionData),
});
const result = await response.json();
```

### Required API Endpoints:

```
POST /api/elections/create
POST /api/elections/{id}/publish
GET /api/elections/{id}
POST /api/voters/import
POST /api/candidates/import
```

---

## 🐛 Troubleshooting

### Problem: Buttons not working

- Solution: Make sure you're using a local server, not file:// protocol
- Check browser console (F12) for JavaScript errors

### Problem: Data not saving

- Solution: Check if localStorage is enabled in browser
- Check browser console for errors
- Try clearing cache: Ctrl+Shift+Delete

### Problem: CSV upload not working

- Solution: Ensure CSV format is correct (3 columns: Name, ID, Photo)
- Check file size (max 5MB)
- Try with a simple test file

### Problem: Mobile responsive not working

- Solution: Check viewport meta tag in HTML
- Ensure browser zoom is 100%
- Try different screen sizes

---

## 📚 Browser Console Commands

Test the wizard programmatically:

```javascript
// View all saved data
JSON.parse(localStorage.getItem("electionDraft"));

// Clear draft
localStorage.removeItem("electionDraft");

// View wizard state
wizard.electionData;

// Navigate to step
wizard.currentStep = 3;
wizard.showStep(3);

// Add test candidate
wizard.electionData.candidates.push({ id: "TEST", name: "Test" });

// Validate current step
wizard.validateStep(wizard.currentStep);
```

---

## 📞 Support

For issues or questions:

1. Check browser console (F12 → Console tab)
2. Verify all files are in correct directory
3. Clear browser cache and retry
4. Try different browser if issue persists
5. Check that JavaScript is enabled

---

## ✨ Next Steps

After testing the wizard:

1. **Connect Backend:** Implement API endpoints
2. **Setup Database:** Store election data
3. **Email System:** Send voter links
4. **Voting Interface:** Build voter dashboard
5. **Results Dashboard:** Create admin monitoring
6. **Audit Logs:** Implement security logging

---

**Ready to Test?** 🚀

```bash
cd "voting management system"
python -m http.server 8000
# Open http://localhost:8000
```

---

_Election Wizard - Ready for Production_ ✅
