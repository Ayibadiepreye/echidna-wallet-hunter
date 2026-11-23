# ✅ Echidna Deployment Checklist

Use this checklist to ensure everything is set up correctly.

## 📋 Pre-Deployment

### Local Setup
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Project files downloaded/cloned
- [ ] `npm install` completed successfully
- [ ] `.env` file created from `.env.example`
- [ ] Local server starts with `npm start`
- [ ] Can access http://localhost:3000
- [ ] UI loads correctly
- [ ] Can click START button (even without API keys)

### Optional API Keys (Recommended)
- [ ] Alchemy account created (free)
- [ ] Alchemy API key added to `.env`
- [ ] BlockCypher account created (optional)
- [ ] BlockCypher token added to `.env`

### Database Setup (Optional)
- [ ] Supabase account created
- [ ] New project created in Supabase
- [ ] SQL schema (`supabase-schema.sql`) executed
- [ ] Table `found_wallets` exists
- [ ] Supabase URL copied to `.env`
- [ ] Supabase anon key copied to `.env`
- [ ] Local app shows "Connected to Supabase" (not "Using local file storage")

### Notifications (Optional)
- [ ] Discord server webhook created OR
- [ ] Slack incoming webhook created
- [ ] Webhook URL added to `.env`

## 🚀 Deployment to Render

### GitHub Setup
- [ ] GitHub account exists
- [ ] New repository created on GitHub
- [ ] Local git initialized (`git init`)
- [ ] Files added (`git add .`)
- [ ] Initial commit made (`git commit -m "Initial commit"`)
- [ ] Remote added (`git remote add origin ...`)
- [ ] Pushed to GitHub (`git push -u origin main`)

### Render Setup
- [ ] Render account created (free)
- [ ] Clicked "New +" → "Web Service"
- [ ] GitHub account connected to Render
- [ ] Repository selected
- [ ] Configuration set:
  - [ ] Name: `echidna` (or your choice)
  - [ ] Environment: `Node`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
  - [ ] Plan: `Free`

### Environment Variables in Render
Add these in Render dashboard under Environment:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3000`
- [ ] `ALCHEMY_API_KEY` = your_key (if you have one)
- [ ] `BLOCKCYPHER_TOKEN` = your_token (if you have one)
- [ ] `SUPABASE_URL` = your_url (if using Supabase)
- [ ] `SUPABASE_KEY` = your_key (if using Supabase)
- [ ] `WEBHOOK_URL` = your_webhook (if using notifications)

### Deployment
- [ ] Clicked "Create Web Service"
- [ ] Build started successfully
- [ ] Build completed (green checkmark)
- [ ] Service shows "Live" status
- [ ] Can access the Render URL
- [ ] UI loads correctly on Render
- [ ] Can click START and see it working
- [ ] Logs show "Echidna server running"

## 🔍 Post-Deployment Testing

### Functionality Tests
- [ ] START button works
- [ ] Telemetry terminal shows activity
- [ ] Stats update in real-time
- [ ] "Wallets Checked" counter increases
- [ ] PAUSE button works
- [ ] RESUME button works
- [ ] STOP button works
- [ ] Logs display correctly
- [ ] No error messages in Render logs

### Database Tests (if using Supabase)
- [ ] Go to Supabase Table Editor
- [ ] Table `found_wallets` is empty (expected)
- [ ] No connection errors in Render logs
- [ ] Logs show "Connected to Supabase"

### Mobile/PWA Tests
- [ ] Open Render URL on mobile device
- [ ] UI is responsive and looks good
- [ ] Can tap "Add to Home Screen" (iOS) or "Install App" (Android)
- [ ] App installs successfully
- [ ] Can open installed app
- [ ] All functionality works in PWA

### Performance Tests
- [ ] Check "Checks/Second" stat
- [ ] Should be 1-10 on free tier
- [ ] No major lag or freezing
- [ ] Terminal scrolls smoothly
- [ ] Stats update every second

## 🛟 Troubleshooting Checklist

### If Build Fails
- [ ] Check Render logs for specific error
- [ ] Verify package.json is valid JSON
- [ ] Try `npm install --legacy-peer-deps` locally
- [ ] Check Node.js version (should be 18+)
- [ ] Verify all files pushed to GitHub

### If App Won't Start
- [ ] Check Render logs
- [ ] Verify START command is `npm start`
- [ ] Check if PORT is set correctly
- [ ] Look for module import errors
- [ ] Verify all dependencies in package.json

### If UI Doesn't Load
- [ ] Check if service is "Live" on Render
- [ ] Try opening in incognito/private window
- [ ] Clear browser cache
- [ ] Check browser console (F12) for errors
- [ ] Verify index.html is in public/ folder

### If Checks Aren't Working
- [ ] Check Render logs for API errors
- [ ] Verify internet connectivity
- [ ] Check if APIs are rate-limiting
- [ ] Add API keys if not using them
- [ ] Increase checkInterval in config.js

### If Database Not Working
- [ ] Verify Supabase URL and Key are correct
- [ ] Check if table exists in Supabase
- [ ] Verify RLS policies allow operations
- [ ] Check Render logs for connection errors
- [ ] Test with local storage (remove Supabase vars)

### If Notifications Not Working
- [ ] Verify webhook URL is correct
- [ ] Test webhook with a curl command
- [ ] Check Discord/Slack webhook is active
- [ ] Look for notification errors in logs
- [ ] Temporarily trigger a fake hit to test

## 📱 Mobile Setup Checklist

### iOS (Safari)
- [ ] Open Render URL in Safari
- [ ] Tap Share button (square with arrow)
- [ ] Scroll and tap "Add to Home Screen"
- [ ] Edit name if desired
- [ ] Tap "Add"
- [ ] App icon appears on home screen
- [ ] Tap icon to open app
- [ ] App opens in standalone mode

### Android (Chrome)
- [ ] Open Render URL in Chrome
- [ ] Tap menu (three dots)
- [ ] Tap "Install App" or "Add to Home Screen"
- [ ] Confirm installation
- [ ] App icon appears on home screen
- [ ] Tap icon to open app
- [ ] App opens in standalone mode

## 🔐 Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] No API keys committed to GitHub
- [ ] Supabase keys are "anon public" (not service role)
- [ ] Webhook URLs are private
- [ ] No sensitive data in logs
- [ ] Environment variables set in Render dashboard (not in code)

## 🎯 Success Criteria

Your deployment is successful when:

✅ App is accessible via Render URL
✅ START button makes it run
✅ Terminal shows activity
✅ Stats update in real-time
✅ PAUSE/RESUME/STOP work correctly
✅ No errors in Render logs
✅ PWA installs on mobile
✅ Database connects (if using Supabase)
✅ Notifications work (if configured)
✅ Performance is acceptable (1-10 checks/sec)

## 📊 Monitoring Checklist

### Daily Checks
- [ ] Check Render dashboard for uptime
- [ ] Monitor total wallets checked
- [ ] Review logs for errors
- [ ] Check Supabase storage usage
- [ ] Verify app still accessible

### Weekly Checks
- [ ] Review Render bandwidth usage
- [ ] Check API rate limit usage
- [ ] Monitor Supabase row count
- [ ] Update documentation if needed
- [ ] Backup any found wallet data

### Monthly Checks
- [ ] Review npm packages for updates
- [ ] Check for security advisories
- [ ] Verify SSL certificate is valid
- [ ] Review Supabase/Render quotas
- [ ] Consider performance optimizations

## 🎓 Learning Checklist

By completing this deployment, you should understand:

- [ ] How BIP39 wallets are generated
- [ ] Multi-chain address derivation
- [ ] Blockchain API integration
- [ ] Node.js application structure
- [ ] Environment variable management
- [ ] Git workflow and version control
- [ ] Cloud deployment (Render)
- [ ] Database hosting (Supabase)
- [ ] PWA implementation
- [ ] Real-time web applications
- [ ] Why cryptocurrency is secure (massive keyspace)

## 🎉 Completion

If all items are checked, congratulations! 🎊

Your Echidna is now:
- ✨ Fully deployed
- 🌐 Accessible worldwide
- 📱 Installable on mobile
- ☁️ Backed by cloud database
- 🔔 Sending notifications
- 📊 Tracking statistics
- 🔄 Ready to run 24/7

**The Witch of Greed is satisfied with your work!** 🌟

---

## 📞 Support Resources

If you need help:
1. Check QUICKSTART.md for common issues
2. Read SETUP.md for detailed instructions
3. Review Render logs for specific errors
4. Check GitHub Issues (if public repo)
5. Review Supabase documentation
6. Test locally to isolate problems

## 🔄 Next Steps

Now that it's deployed:
1. Monitor for a few hours
2. Test all features thoroughly
3. Share the URL (if you want)
4. Learn from the code
5. Consider enhancements
6. Enjoy watching the impossible hunt!

**Remember:** The odds are astronomical, but the learning is priceless! 🎓
