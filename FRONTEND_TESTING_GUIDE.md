# Frontend Testing Quick Start

## Prerequisites
- Backend running on `http://localhost:5000` 
- MongoDB Atlas connection working (see FRONTEND_BUILD_SUMMARY.md)
- Node.js and npm installed

## Setup & Running

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173` (or similar Vite port)

---

## What's Built & Ready to Test

### ✅ Authentication Flow

**1. Signup (New Account)**
- Navigate to http://localhost:5173/signup
- Fill in: Full Name, Email, Password, Confirm Password
- Click "Continue"
- Receive OTP email
- Enter 6-digit OTP
- Click "Verify & Create Account"
- Redirected to login page
- Success! Now you have an account

**2. Login**
- Navigate to http://localhost:5173/login
- Enter email and password
- Click "Sign In"
- Auto-redirected to /dashboard
- Token saved to localStorage (persists on refresh)

**3. Session Persistence**
- After login, refresh the page (Ctrl+R)
- You stay logged in! (Zustand persist middleware working)

**4. Logout**
- Click user profile section in sidebar (bottom left)
- Click "Logout" button
- Redirected to /login
- localStorage cleared

---

### ✅ Dashboard

**Navigate to:** http://localhost:5173/dashboard (auto-redirects if logged in)

**Features:**
- Welcome greeting with your name
- 4 stat cards (Documents, AI Chats, AI Operations, This Week)
- 5 quick action buttons (Upload, Chat, Documents, Analytics, History)
- Recent Activity list showing last 5 activities
- Refresh button on Recent Activity
- Empty state with helpful prompt if no activity

**Note:** Stats show "0" because we haven't integrated document counts yet (those are being built)

---

### ✅ Sidebar Navigation

**Visible on Desktop:** Fixed left sidebar
**Visible on Mobile:** Hamburger menu (will work once Navbar is fully built)

**Navigation Items:**
1. Dashboard - Home page
2. Upload Document - Upload form (page not built yet)
3. Documents - List view (page not built yet)
4. AI Chat - Chat interface (page not built yet)
5. History - Activity timeline (page not built yet)
6. Settings - User settings (page not built yet)

**User Profile Section:**
- Shows logged-in user's email
- Shows user's name
- Logout button

---

## Store Integration Examples

### How authStore Works
```typescript
// In Login component
const { login, error, isLoading } = useAuthStore();

const handleSubmit = async () => {
  const success = await login(email, password);
  if (success) navigate('/dashboard');
};
```

### How documentStore Works
```typescript
// In Dashboard component
const { recentActivity, fetchRecentActivity } = useDocumentStore();

useEffect(() => {
  fetchRecentActivity(); // Fetches from GET /dashboard/recent-activity
}, []);

// Display recentActivity in UI
recentActivity.forEach(activity => {
  // Show activity item
});
```

### How API Interceptor Works
```typescript
// Automatically happens in api.ts
// 1. Every request gets: headers.Authorization = `Bearer ${token}`
// 2. If response is 401: logout() called + redirect to /login
// 3. No need to handle auth in components!
```

---

## Key Files & What They Do

| File | Purpose |
|------|---------|
| `frontend/src/store/authStore.ts` | Auth state (login, signup, logout) |
| `frontend/src/store/documentStore.ts` | Document & AI operation state |
| `frontend/src/lib/api.ts` | Axios client with interceptors |
| `frontend/src/components/Sidebar.tsx` | Navigation sidebar (redesigned) |
| `frontend/src/pages/Login.tsx` | Login form (connected to authStore) |
| `frontend/src/pages/Signup.tsx` | Signup + OTP form (connected to authStore) |
| `frontend/src/pages/Dashboard.tsx` | Home page with recent activity |

---

## Testing Checklist

### Step 1: Test Signup
- [ ] Navigate to /signup
- [ ] Try submitting empty form (should show validation errors)
- [ ] Try non-matching passwords (should show error)
- [ ] Fill valid form data
- [ ] Click "Continue"
- [ ] Should switch to OTP step
- [ ] Check your email for OTP code
- [ ] Enter OTP (6 digits)
- [ ] Click "Verify & Create Account"
- [ ] Should redirect to /login with success state

### Step 2: Test Login
- [ ] On login page, try invalid email (should show error)
- [ ] Try empty password (should show error)
- [ ] Enter credentials from signup
- [ ] Click "Sign In"
- [ ] Should redirect to /dashboard
- [ ] User name should appear in top left

### Step 3: Test Sidebar
- [ ] Click user profile section (bottom left)
- [ ] Should show: "Logged in as [email]" with [name] underneath
- [ ] Click "Logout"
- [ ] Should redirect to /login

### Step 4: Test Session Persistence
- [ ] Log back in
- [ ] Refresh page (Ctrl+R)
- [ ] You should still be logged in!
- [ ] Check browser DevTools → Application → LocalStorage
- [ ] Should see `auth` key with token

### Step 5: Test Dashboard
- [ ] On dashboard, check Recent Activity section
- [ ] If no activity, should show empty state with upload prompt
- [ ] Check all quick action buttons (they navigate correctly)
- [ ] Try clicking refresh button on Recent Activity (should re-fetch)

### Step 6: Test Mobile Responsiveness
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (mobile view)
- [ ] Sidebar should hide (will be hamburger menu once Navbar built)
- [ ] Dashboard should stack vertically
- [ ] All buttons should remain clickable

---

## Backend API Endpoints Being Used

| Endpoint | Method | Store/Component | Purpose |
|----------|--------|-----------------|---------|
| `/auth/sendotp` | POST | authStore | Send OTP to email |
| `/auth/signup` | POST | authStore | Create account with OTP |
| `/auth/login` | POST | authStore | Login with email/password |
| `/auth/login/google` | POST | authStore | Google OAuth (ready) |
| `/auth/checkauth` | GET | authStore | Verify session |
| `/auth/logout` | POST | authStore | Logout |
| `/dashboard/recent-activity` | GET | documentStore | Fetch activities for dashboard |

---

## Common Issues & Solutions

### Issue: "Network Error" in Login
**Solution:** Backend isn't running on localhost:5000
```bash
# In backend directory
npm start
```

### Issue: "Unauthorized" after login
**Solution:** JWT_SECRET not set in backend .env
- Check backend/.env has JWT_SECRET
- Restart backend server

### Issue: OTP not received
**Solution:** Nodemailer not configured
- Check backend/.env has EMAIL_USER and EMAIL_PASSWORD
- Verify SMTP settings in backend

### Issue: Token missing after page refresh
**Solution:** localStorage cleared or persisted wrong key
- Check DevTools → Application → LocalStorage
- Should have `auth` key with store data
- Try logging in again

### Issue: Sidebar not showing on desktop
**Solution:** CSS media query issue
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server (`npm run dev`)

---

## Next Pages Being Built

1. **Upload.tsx** - Document upload form with drag-and-drop
2. **Documents.tsx** - List all uploaded documents
3. **Chat.tsx** - AI chat interface for documents
4. **History.tsx** - Timeline of AI operations
5. **Settings.tsx** - User profile management

---

## Useful Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint
npm run lint

# Format code
npm run format
```

---

## Environment Variables

No `.env` file needed for frontend in development! All API calls use `http://localhost:5000/api` (hardcoded in api.ts for now).

To change backend URL, edit `frontend/src/lib/api.ts`:
```typescript
const api = axios.create({
  baseURL: 'http://your-backend-url/api', // Change here
  withCredentials: true,
});
```

---

## File Structure

```
frontend/
├── src/
│   ├── store/
│   │   ├── authStore.ts      (✅ Built)
│   │   └── documentStore.ts  (✅ Built)
│   ├── lib/
│   │   └── api.ts            (✅ Built)
│   ├── pages/
│   │   ├── Login.tsx         (✅ Built)
│   │   ├── Signup.tsx        (✅ Built)
│   │   ├── Dashboard.tsx     (✅ Built)
│   │   ├── Upload.tsx        (⏳ Next)
│   │   ├── Documents.tsx     (⏳ Next)
│   │   ├── Chat.tsx          (⏳ Next)
│   │   ├── History.tsx       (⏳ Next)
│   │   └── Settings.tsx      (⏳ Next)
│   ├── components/
│   │   ├── Sidebar.tsx       (✅ Built)
│   │   ├── Navbar.tsx        (⏳ Needs update)
│   │   └── ui/               (shadcn components)
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

---

## Performance Notes

- Zustand is lightweight (no Redux overhead)
- Persist middleware uses localStorage (fast)
- Axios interceptors handle auth centrally (no repetition)
- Framer Motion animations are GPU-accelerated
- Tailwind CSS is production-optimized

---

## Security

✅ **Implemented:**
- JWT token stored in localStorage
- Authorization header auto-injected
- 401 errors trigger logout
- Email validation on forms
- Password confirmation required

⚠️ **To Add in Production:**
- HTTPS only for token transmission
- Secure HTTP-only cookies (if using cookies)
- CSRF token validation
- Rate limiting on auth endpoints
- Account lockout after failed attempts

---

## Questions?

Refer to FRONTEND_BUILD_SUMMARY.md for architecture details!
