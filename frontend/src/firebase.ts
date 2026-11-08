import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value?.trim())
  .map(([key]) => `VITE_FIREBASE_${key.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase()}`)

if (missingConfig.length > 0) {
  const message = `Missing Firebase configuration: ${missingConfig.join(', ')}. Add these values to frontend/.env.local and restart the Vite dev server.`
  throw new Error(import.meta.env.DEV ? message : 'Firebase configuration is incomplete.')
}

const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
