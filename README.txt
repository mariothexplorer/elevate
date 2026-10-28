BUILD THE APK (no Android Studio needed)
1. Create a free GitHub account and a new repository.
2. Upload ALL files from this folder (including the hidden .github folder).
3. Open the repository's Actions tab, choose "Build Android APK", click Run workflow.
4. After about 5-8 minutes, open the finished run and download "Elevate-APK" (contains app-debug.apk).
5. Put app-debug.apk on your download page. On the phone, allow "Install unknown apps" and open the file.

OR locally with Android Studio: npm install, npx cap add android, npx cap sync, npx cap open android, then Build > Build APK(s).
