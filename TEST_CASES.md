# 📋 Example Election Data & Test Cases

## 📝 Sample Election - Student Council 2024

### Completed Election Data

```javascript
{
    // Step 1: Election Basics
    "electionName": "Student Council Elections 2024",
    "electionType": "student",
    "description": "Annual election for Student Government Association positions including President, Vice President, Secretary, and Treasurer.",
    "organizationName": "Massachusetts Institute of Technology",
    "timeZone": "EST",

    // Step 2: Candidates
    "candidates": [
        {
            "id": "STU2024001",
            "name": "Alice Johnson",
            "photoUrl": "https://example.com/photos/alice.jpg"
        },
        {
            "id": "STU2024002",
            "name": "Bob Smith",
            "photoUrl": "https://example.com/photos/bob.jpg"
        },
        {
            "id": "STU2024003",
            "name": "Charlie Brown",
            "photoUrl": "https://example.com/photos/charlie.jpg"
        },
        {
            "id": "STU2024004",
            "name": "Diana Lee",
            "photoUrl": "https://example.com/photos/diana.jpg"
        }
    ],

    // Step 3: Voters
    "voters": [
        {
            "id": "VOTER-1702831200000",
            "email": "john.doe@mit.edu",
            "verificationStatus": "pending"
        },
        {
            "id": "VOTER-1702831210000",
            "email": "jane.smith@mit.edu",
            "verificationStatus": "pending"
        },
        {
            "id": "VOTER-1702831220000",
            "email": "mike.wilson@mit.edu",
            "verificationStatus": "pending"
        }
        // ... more voters
    ],
    "voterInputMethod": "csv",
    "verificationMethods": ["email-otp", "employee-id"],

    // Step 4: Ballot Configuration
    "votingType": "single",
    "allowVoteChange": true,
    "anonymousVoting": true,

    // Step 5: Timeline
    "startDateTime": "2024-12-18T10:00",
    "endDateTime": "2024-12-20T17:00",
    "resultVisibility": "immediate",

    // Step 6: Security
    "encryptionEnabled": true,
    "auditLogsEnabled": true,
    "fraudDetectionEnabled": true,

    // Step 7: Confirmation
    "confirmed": true,

    // Meta
    "electionId": "ELECTION-20241218-KX9M2PQ",
    "createdAt": "2024-12-17T15:30:45.123Z"
}
```

---

## 🧪 Test Cases

### Test Case 1: Valid Election Creation

**Scenario:** Complete election with all valid data
**Steps:**

1. Fill Step 1 with valid election basics
2. Add 3+ candidates via manual entry
3. Add 5+ voter emails
4. Select multiple verification methods
5. Choose voting configuration
6. Set timeline with end > start
7. Confirm and create
   **Expected Result:** ✅ Success screen with Election ID

---

### Test Case 2: CSV Candidate Import

**Scenario:** Import candidates from CSV file
**CSV Content:**

```
Candidate Name,Candidate ID,Photo URL
Alice Johnson,STU001,
Bob Smith,STU002,
Charlie Brown,STU003,
```

**Steps:**

1. Navigate to Step 2
2. Click "Upload CSV" tab
3. Drag CSV file to upload zone
4. Verify 3 candidates imported
5. Click Continue
   **Expected Result:** ✅ 3 candidates appear in list, proceed to Step 3

---

### Test Case 3: Validation - Duplicate Candidate IDs

**Scenario:** Try to add candidate with existing ID
**Steps:**

1. Add candidate: Name="John", ID="A1"
2. Try to add candidate: Name="Jane", ID="A1"
   **Expected Result:** ⚠️ Alert: "Candidate ID already exists"

---

### Test Case 4: Validation - Duplicate Voter Emails

**Scenario:** Try to add voter with existing email
**Steps:**

1. Add voter: email="test@example.com"
2. Try to add voter: email="test@example.com"
   **Expected Result:** ⚠️ Alert: "Voter email already added"

---

### Test Case 5: Validation - Minimum Candidates

**Scenario:** Try to proceed with only 1 candidate
**Steps:**

1. Go to Step 2
2. Add 1 candidate only
3. Click "Continue →"
   **Expected Result:** ⚠️ Error message: "Add at least 2 candidates"
   **Button State:** ❌ Next button disabled

---

### Test Case 6: Validation - Timeline Logic

**Scenario:** Set end date before start date
**Steps:**

1. Go to Step 5
2. Set Start: "2024-12-20T10:00"
3. Set End: "2024-12-19T17:00"
4. Click "Continue →"
   **Expected Result:** ⚠️ Error message: "End time must be after start time"
   **Button State:** ❌ Next button disabled

---

### Test Case 7: Auto-Save Draft

**Scenario:** Verify draft saves automatically
**Steps:**

1. Fill Step 1 fields
2. Wait 2 seconds
3. Open Browser DevTools (F12)
4. Console: `JSON.parse(localStorage.getItem('electionDraft'))`
5. Refresh page
6. Verify data persists
   **Expected Result:** ✅ Draft saves automatically, survives page refresh

---

### Test Case 8: Resume Draft

**Scenario:** Resume incomplete election
**Steps:**

1. Start creating election (fill Step 1)
2. Close browser tab
3. Reopen create-election.html
4. Verify Step 1 data is pre-filled
   **Expected Result:** ✅ All previous data loaded automatically

---

### Test Case 9: Invalid Email Format

**Scenario:** Try to add voter with invalid email
**Steps:**

1. Go to Step 3
2. Enter: "invalid-email" (no @)
3. Click "Add Voter"
   **Expected Result:** ⚠️ Alert: "Please enter a valid email address"

---

### Test Case 10: Confirmation Requirement

**Scenario:** Try to create election without confirmation
**Steps:**

1. Go to Step 7
2. Leave checkbox unchecked
3. Click "Create Election"
   **Expected Result:** ⚠️ Checkbox shows error, button disabled

---

### Test Case 11: Mobile Responsive

**Scenario:** Test on mobile screen
**Steps:**

1. Open create-election.html
2. Resize to 375px width (mobile)
3. Verify:
   - All fields visible
   - Buttons clickable
   - No horizontal scroll
   - Progress indicator adapts
   - Forms readable
     **Expected Result:** ✅ Full responsive layout, no issues

---

### Test Case 12: Dark Mode

**Scenario:** Toggle dark mode
**Steps:**

1. Open election wizard
2. Click dark mode toggle (browser/system)
3. Verify:
   - Text readable
   - Contrast meets WCAG AA
   - All elements visible
   - Colors appropriate
     **Expected Result:** ✅ Dark mode works perfectly, all readable

---

## 📊 Sample CSV Files

### candidates.csv

```
Name,ID,Photo
Alice Johnson,STU001,https://example.com/alice.jpg
Bob Smith,STU002,https://example.com/bob.jpg
Charlie Brown,STU003,
Diana Lee,STU004,https://example.com/diana.jpg
```

### voters.csv

```
Email
john@company.com
jane@company.com
mike@company.com
sarah@company.com
david@company.com
```

---

## 🎯 Data Validation Rules

### Step 1 Validation Rules

```javascript
// Required fields check
if (!electionName || electionName.trim() === '') ❌ FAIL

if (!electionType || electionType === '') ❌ FAIL

if (!description || description.trim() === '') ❌ FAIL

if (!organizationName || organizationName.trim() === '') ❌ FAIL

if (!timeZone || timeZone === '') ❌ FAIL

// All filled = PASS ✅
```

### Step 2 Validation Rules

```javascript
// Minimum candidates check
if (candidates.length < 2) ❌ FAIL

// Unique ID check
const ids = new Set(candidates.map(c => c.id))
if (ids.size !== candidates.length) ❌ FAIL (duplicate found)

// Non-empty names
candidates.forEach(c => {
    if (!c.name.trim()) ❌ FAIL
    if (!c.id.trim()) ❌ FAIL
})

// All checks pass = PASS ✅
```

### Step 3 Validation Rules

```javascript
// At least one verification method
if (verificationMethods.length < 1) ❌ FAIL

// Valid email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) ❌ FAIL

// Unique voter emails
const emails = new Set(voters.map(v => v.email))
if (emails.size !== voters.length) ❌ FAIL (duplicate found)

// At least 1 method selected = PASS ✅
```

### Step 5 Validation Rules

```javascript
// Start date required
if (!startDateTime) ❌ FAIL

// End date required
if (!endDateTime) ❌ FAIL

// End must be after start
const start = new Date(startDateTime)
const end = new Date(endDateTime)
if (end <= start) ❌ FAIL

// Valid timeline = PASS ✅
```

### Step 7 Validation Rules

```javascript
// Confirmation required
if (!confirmed) ❌ FAIL

// All previous steps valid
for (let i = 1; i < 7; i++) {
    if (!isValid[i]) ❌ FAIL
}

// Confirmed & all steps valid = PASS ✅
```

---

## 🔄 Example User Flow

### Complete Flow: 10 Minutes

```
Start → Step 1 (2 min) → Step 2 (2 min) → Step 3 (1 min)
→ Step 4 (1 min) → Step 5 (2 min) → Step 6 (view)
→ Step 7 (1 min) → Success ✅
```

### Detailed Timeline

```
Time  Action                          Status
0:00  Click "Create Election"         ↓
0:05  Fill Election Basics            ✍️
1:30  Add 4 Candidates                ✍️
2:45  Add 10 Voters                   ✍️
3:30  Set Verification Methods        ✓
4:00  Configure Ballot                ✓
4:30  Set Timeline                    ✓
5:00  Review Security                 ✓
5:15  Confirm Election                ✓
5:20  Click Create Election           🚀
5:25  See Success Screen              ✅
```

---

## 💾 LocalStorage Schema Examples

### After Step 1

```javascript
{
    "electionName": "Student Council",
    "electionType": "student",
    "description": "Annual elections",
    "organizationName": "XYZ University",
    "timeZone": "EST",
    "candidates": [],
    "voters": [],
    "verificationMethods": [],
    // ... other fields
}
```

### After Step 2

```javascript
{
    // ... Step 1 data
    "candidates": [
        {"id": "A1", "name": "Alice", "photoUrl": ""},
        {"id": "B1", "name": "Bob", "photoUrl": ""}
    ]
}
```

### Complete Data (Before Creation)

```javascript
{
    "electionName": "Student Council 2024",
    "electionType": "student",
    // ... all 7 steps of data
    "electionId": "ELECTION-20241217-ABC123",
    "createdAt": "2024-12-17T10:30:00Z"
}
```

---

## 🎬 Expected Outputs

### Success Response Example

```javascript
{
    "success": true,
    "electionId": "ELECTION-20241217-KX9M2PQ",
    "message": "Election created successfully",
    "voterLink": "https://vote.votesecure.io/ELECTION-20241217-KX9M2PQ",
    "adminLink": "https://admin.votesecure.io/elections/ELECTION-20241217-KX9M2PQ"
}
```

### Error Response Examples

```javascript
// Validation error
{
    "error": true,
    "code": "VALIDATION_ERROR",
    "message": "Candidate count must be >= 2",
    "field": "candidates"
}

// Duplicate error
{
    "error": true,
    "code": "DUPLICATE_ERROR",
    "message": "Candidate ID already exists",
    "value": "STU001"
}
```

---

## 🔍 Debugging Tips

### Check Draft Data

```javascript
// In browser console
JSON.parse(localStorage.getItem("electionDraft"));
```

### Navigate Programmatically

```javascript
// Go to specific step
wizard.currentStep = 5;
wizard.showStep(5);
```

### Trigger Auto-Save

```javascript
wizard.autosaveDraft();
wizard.showDraftIndicator();
```

### Validate Step

```javascript
wizard.validateStep(3);
console.log(wizard.isValid[3]);
```

### Add Test Data

```javascript
wizard.electionData.electionName = "Test Election";
wizard.validateStep(1);
```

---

**Test Suite Complete!** ✅  
All test cases provided and documented.  
Ready for QA and user testing.
