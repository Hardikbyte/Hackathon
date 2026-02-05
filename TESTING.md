# 🧪 TESTING GUIDE

## Quick Test Checklist

### ✅ Before Demo Day

1. **Environment Setup**
   ```bash
   # Check all dependencies are installed
   cd backend && npm list | head -20
   cd ../frontend && npm list | head -20
   
   # Verify Playwright browsers
   npx playwright --version
   ```

2. **API Key Test**
   ```bash
   # Check if Gemini API key is configured
   grep GEMINI_API_KEY backend/.env
   # Should show: GEMINI_API_KEY=AIza... (not empty)
   ```

3. **Backend Health Check**
   ```bash
   cd backend
   npm run dev
   # Should show:
   # ✅ Backend running at http://localhost:4000
   # ✅ WebSocket running at ws://localhost:3001
   ```

4. **Frontend Build Check**
   ```bash
   cd frontend
   npm run dev
   # Should show:
   # ✅ VITE ready in XXX ms
   # ✅ Local: http://localhost:5173
   ```

---

## 🎤 Voice Command Tests

### Test 1: Basic Train Booking
**Command**: "Book a train from Delhi to Mumbai tomorrow"

**Expected Results**:
- ✅ Transcript appears showing the command
- ✅ Intent shows: book_train, Delhi → Mumbai, date tomorrow
- ✅ Status updates appear in real-time
- ✅ Browser window opens (if HEADLESS_BROWSER=false)
- ✅ IRCTC website loads
- ✅ Form fields get filled automatically
- ✅ Search executes
- ✅ Final status shows success or error with details

### Test 2: Different Date Format
**Command**: "Find trains from Kota to Jaipur next Friday"

**Expected Results**:
- ✅ Correctly parses "next Friday" to actual date
- ✅ Shows proper from/to cities
- ✅ Automation proceeds normally

### Test 3: Natural Language Variation
**Command**: "I want to travel from Chennai to Bangalore day after tomorrow"

**Expected Results**:
- ✅ Gemini extracts intent despite different phrasing
- ✅ Handles "day after tomorrow" date parsing
- ✅ Automation works as expected

### Test 4: Invalid Command
**Command**: "What's the weather?"

**Expected Results**:
- ✅ Transcribes correctly
- ✅ Intent shows "unknown" action or error message
- ✅ Graceful error handling, no crash

---

## 🔍 Component-Level Tests

### 1. Transcription Test
```javascript
// Test the transcription endpoint directly
const audio = /* your test audio blob */;
const response = await fetch('http://localhost:4000/api/transcribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    audio: Array.from(audioSamples),
    sampleRate: 16000
  })
});

// Expected: { ok: true, text: "Book a train from Delhi to Mumbai" }
```

### 2. Intent Extraction Test
```javascript
// Test intent endpoint
const response = await fetch('http://localhost:4000/api/intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "Book a train from Delhi to Mumbai tomorrow"
  })
});

// Expected: 
// {
//   ok: true,
//   intent: {
//     action: "book_train",
//     site: "irctc",
//     params: { from: "Delhi", to: "Mumbai", date: "2026-02-06" }
//   }
// }
```

### 3. Automation Trigger Test
```bash
# Use curl to test the automation endpoint
curl -X POST http://localhost:4000/api/automate \
  -H "Content-Type: application/json" \
  -d '{
    "intent": {
      "action": "book_train",
      "site": "irctc",
      "params": {
        "from": "Delhi",
        "to": "Mumbai",
        "date": "2026-02-07",
        "passengers": 1
      }
    }
  }'

# Expected: { ok: true, runId: "..." }
```

---

## 🌐 Browser Automation Tests

### Visual Mode (For Demo)
```bash
# In backend/.env
HEADLESS_BROWSER=false

# Run automation - you should see browser window open
```

**What to Check**:
- ✅ Browser window opens and is visible
- ✅ IRCTC loads properly
- ✅ Popup dismissals work
- ✅ Form fills are visible
- ✅ Date picker selection works
- ✅ Search button clicks
- ✅ Results load

### Headless Mode (For Production)
```bash
# In backend/.env
HEADLESS_BROWSER=true

# Run automation - no browser window, but should still work
```

**What to Check**:
- ✅ No browser window appears
- ✅ Status updates still work
- ✅ Screenshots are captured
- ✅ Automation completes successfully

---

## 🚨 Error Scenarios to Test

### 1. No Internet Connection
**Expected**: Graceful error message about connectivity

### 2. Invalid API Key
```bash
# In backend/.env
GEMINI_API_KEY=invalid_key

# Expected: Clear error about invalid API key
```

### 3. IRCTC Site Down
**Expected**: Timeout error with helpful message

### 4. No Trains Available
**Command**: "Book train from Delhi to Mumbai on Christmas 2030"

**Expected**: "No trains found" message, no crash

### 5. Microphone Permission Denied
**Expected**: Clear browser prompt to enable microphone

---

## 📊 Performance Benchmarks

### Target Metrics
- Voice transcription: < 3 seconds
- Intent extraction: < 2 seconds
- Browser launch: < 5 seconds
- Form filling: < 10 seconds
- Total end-to-end: < 45 seconds

### How to Measure
```javascript
// Add timestamps to your status updates
const start = Date.now();
// ... run automation ...
const end = Date.now();
console.log(`Total time: ${end - start}ms`);
```

---

## 🔧 Common Issues & Fixes

### Issue: "Cannot find module '@xenova/transformers'"
**Fix**:
```bash
cd backend
npm install @xenova/transformers
```

### Issue: "Playwright browser not found"
**Fix**:
```bash
cd backend
npx playwright install chromium
```

### Issue: "CORS error in browser console"
**Fix**: Check backend/server.js has correct FRONTEND_URL

### Issue: "WebSocket connection failed"
**Fix**: 
- Backend must be running
- Check WS_PORT in .env (default 3001)
- Check firewall settings

### Issue: "Gemini API quota exceeded"
**Fix**: 
- Wait for quota reset (daily limit)
- Create new API key
- Use OpenAI as fallback

### Issue: "IRCTC site changed selectors"
**Fix**: Update selectors in backend/automation/agent.js

---

## 🎬 Pre-Hackathon Final Test

**30 Minutes Before Presentation**:

1. ✅ Fresh restart of both servers
2. ✅ Clear browser cache
3. ✅ Test complete flow end-to-end
4. ✅ Test backup commands
5. ✅ Check internet connectivity
6. ✅ Verify microphone works
7. ✅ Take screenshots of successful run
8. ✅ Prepare backup video recording

**5 Minutes Before Presentation**:

1. ✅ Servers running
2. ✅ Browser tab open to app
3. ✅ Microphone tested
4. ✅ Volume up for audio
5. ✅ Demo script in hand
6. ✅ Deep breath, you got this! 💪

---

## 📹 Creating Backup Demo Video

In case of technical issues during presentation:

```bash
# 1. Start screen recording
# 2. Navigate to http://localhost:5173
# 3. Perform successful voice command
# 4. Show automation working
# 5. Show final checkout page
# 6. Stop recording
# 7. Save as demo-backup.mp4
```

**Video Checklist**:
- ✅ Clear audio of voice command
- ✅ Visible automation in browser
- ✅ Real-time status updates
- ✅ Final success screen
- ✅ Duration: 60-90 seconds max

---

## 🎯 Success Criteria

### Minimum Viable Demo
- ✅ Voice records and transcribes
- ✅ Intent extracted correctly
- ✅ Browser opens and navigates to IRCTC
- ✅ At least origin/destination filled
- ✅ Some status updates shown

### Ideal Demo
- ✅ All of above
- ✅ Date selection works
- ✅ Search executes
- ✅ Train results appear
- ✅ Full checkout page reached
- ✅ All status updates clear and accurate

### Judges Will Look For
1. **Does it work?** (Most Important)
2. **Is it smooth?** (User experience)
3. **Is it robust?** (Error handling)
4. **Is it impressive?** (Technical depth)
5. **Is it useful?** (Real-world impact)

---

## 🏆 You're Ready!

If you can successfully complete 3 voice commands in a row without errors, you're ready to wow the judges. Trust your preparation, believe in your solution, and show them how you're making the web accessible for everyone!

**Good luck! 🚀**
