import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import {
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import type { OnboardingAnswers } from '../types'
import { onboardingQuestions } from '../data/onboardingQuestions'
import { auth, db } from '../firebase'
import { Icon } from './Icon'
import './AuthGate.css'

type UserProfile = {
  onboardingCompleted: boolean
  onboardingAnswers: OnboardingAnswers
}

export type AuthSession = {
  user: User
  profile: UserProfile
  saveOnboarding: (answers: OnboardingAnswers) => Promise<void>
  restartOnboarding: () => Promise<void>
  clearOnboarding: () => Promise<void>
  signOutUser: () => Promise<void>
  signingOut: boolean
}

type AuthGateProps = {
  children: (session: AuthSession) => ReactNode
}

type GateState =
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'profile-loading'; user: User }
  | { status: 'profile-error'; user: User; message: string }
  | { status: 'authenticated'; user: User; profile: UserProfile }

const emptyProfile: UserProfile = {
  onboardingCompleted: false,
  onboardingAnswers: {},
}

function getFirebaseErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        return 'The sign-in window was closed before you finished. Try again when you’re ready.'
      case 'auth/popup-blocked':
        return 'Your browser blocked the sign-in window. Allow pop-ups for this site and try again.'
      case 'auth/cancelled-popup-request':
        return 'A sign-in request is already in progress. Please try again in a moment.'
      case 'auth/network-request-failed':
        return 'A network error interrupted sign-in. Check your connection and try again.'
      default:
        return 'We could not complete that request. Please try again.'
    }
  }
  return 'We could not complete that request. Please try again.'
}

function readProfile(data: unknown): UserProfile {
  if (typeof data !== 'object' || data === null) return emptyProfile
  const record = data as Record<string, unknown>
  const rawAnswers = record.onboardingAnswers
  const answers: OnboardingAnswers = {}

  if (typeof rawAnswers === 'object' && rawAnswers !== null) {
    const raw = rawAnswers as Record<string, unknown>
    for (const question of onboardingQuestions) {
      const answer = raw[question.id]
      if (typeof answer === 'string' && answer.trim().length <= 500) {
        if (
          question.kind === 'text' ||
          question.options.some((option) => option.label === answer)
        ) {
          answers[question.id] = answer
        }
      }
    }
  }

  return {
    onboardingCompleted: record.onboardingCompleted === true,
    onboardingAnswers: answers,
  }
}

function LoadingScreen({ message }: { message: string }) {
  return (
    <main className="auth-screen">
      <div className="auth-card auth-loading-card" role="status" aria-live="polite">
        <span className="brand-mark"><Icon name="sparkles" size={20} strokeWidth={2} /></span>
        <span className="auth-spinner" aria-hidden="true" />
        <h1>{message}</h1>
      </div>
    </main>
  )
}

function GoogleSignInScreen() {
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSignIn = async () => {
    if (isSigningIn) return
    setIsSigningIn(true)
    setErrorMessage(null)
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (error) {
      setErrorMessage(getFirebaseErrorMessage(error))
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-card auth-login-card" aria-labelledby="auth-title">
        <a className="brand auth-brand" href="#home" aria-label="Elevate">
          <span className="brand-mark"><Icon name="sparkles" size={19} strokeWidth={2} /></span>
          <span>ELEVATE</span>
        </a>
        <span className="auth-kicker">MAKE ROOM FOR THE UNEXPECTED</span>
        <h1 id="auth-title">Your next adventure starts <span>here.</span></h1>
        <p>Sign in to save your profile and pick up your personal quests wherever you are.</p>
        {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}
        <button
          className="google-sign-in"
          disabled={isSigningIn}
          onClick={handleSignIn}
          type="button"
        >
          <GoogleMark />
          {isSigningIn ? 'Connecting to Google...' : 'Continue with Google'}
        </button>
        <span className="auth-privacy-note">Your onboarding answers are saved to your ELEVATE profile.</span>
      </section>
    </main>
  )
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="google-mark" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94a11.05 11.05 0 0 1-4.8 7.24l7.73 5.99c4.51-4.18 7.11-10.34 7.11-17.7Z" />
      <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.2a23.92 23.92 0 0 0 0 21.58l7.98-6.2Z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-5.99c-2.14 1.44-4.89 2.29-8.17 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.2C6.51 42.62 14.62 48 24 48Z" />
    </svg>
  )
}

export function AuthGate({ children }: AuthGateProps) {
  const [gate, setGate] = useState<GateState>({ status: 'loading' })
  const [profileRetry, setProfileRetry] = useState(0)
  const [signingOut, setSigningOut] = useState(false)
  const [authError, setAuthError] = useState(false)
  const requestId = useRef(0)

  useEffect(() => onAuthStateChanged(
    auth,
    (user) => {
      setAuthError(false)
      requestId.current += 1
      if (!user) {
        setGate({ status: 'signed-out' })
        return
      }
      setGate({ status: 'profile-loading', user })
    },
    () => {
      setAuthError(true)
      setGate({ status: 'signed-out' })
    },
  ), [])

  const activeUser = gate.status === 'profile-loading' ||
    gate.status === 'profile-error' ||
    gate.status === 'authenticated'
    ? gate.user
    : null

  useEffect(() => {
    if (!activeUser) return

    const currentRequestId = ++requestId.current

    void getDoc(doc(db, 'users', activeUser.uid))
      .then((snapshot) => {
        if (requestId.current !== currentRequestId) return
        setGate({
          status: 'authenticated',
          user: activeUser,
          profile: snapshot.exists() ? readProfile(snapshot.data()) : emptyProfile,
        })
      })
      .catch(() => {
        if (requestId.current !== currentRequestId) return
        setGate({
          status: 'profile-error',
          user: activeUser,
          message: 'We could not load your profile. Check your connection and try again.',
        })
      })
  }, [activeUser, profileRetry])

  const updateProfile = useCallback(async (updates: Record<string, unknown>) => {
    if (!activeUser) throw new Error('You must be signed in to update your profile.')
    await setDoc(
      doc(db, 'users', activeUser.uid),
      { ...updates, updatedAt: serverTimestamp() },
      { merge: true },
    )
    setGate((current) => {
      if (current.status !== 'authenticated' || current.user.uid !== activeUser.uid) return current
      return {
        ...current,
        profile: readProfile({ ...current.profile, ...updates }),
      }
    })
  }, [activeUser])

  const saveOnboarding = useCallback(async (answers: OnboardingAnswers) => {
    const requiredQuestions = onboardingQuestions.filter((question) => question.kind === 'choice')
    if (requiredQuestions.some((question) => !answers[question.id]?.trim())) {
      throw new Error('Please answer all five required questions before finishing.')
    }

    await updateProfile({
      onboardingAnswers: Object.fromEntries(
        Object.entries(answers).filter(([, answer]) => typeof answer === 'string' && answer.trim()),
      ),
      onboardingCompleted: true,
    })
  },
    [updateProfile],
  )

  const restartOnboarding = useCallback(
    () => updateProfile({ onboardingCompleted: false }),
    [updateProfile],
  )

  const clearOnboarding = useCallback(
    () => updateProfile({
      onboardingAnswers: deleteField(),
      onboardingCompleted: false,
    }),
    [updateProfile],
  )

  const signOutUser = useCallback(async () => {
    setSigningOut(true)
    try {
      await signOut(auth)
    } finally {
      setSigningOut(false)
    }
  }, [])

  if (gate.status === 'loading') return <LoadingScreen message="Getting things ready..." />
  if (gate.status === 'signed-out') {
    return authError ? (
      <main className="auth-screen">
        <section className="auth-card auth-error-card" role="alert">
          <h1>We could not check your sign-in status.</h1>
          <p>Refresh the page to try again.</p>
          <button className="google-sign-in" onClick={() => window.location.reload()} type="button">
            Retry
          </button>
        </section>
      </main>
    ) : <GoogleSignInScreen />
  }
  if (gate.status === 'profile-loading') {
    return <LoadingScreen message="Loading your ELEVATE profile..." />
  }
  if (gate.status === 'profile-error') {
    return (
      <main className="auth-screen">
        <section className="auth-card auth-error-card" role="alert">
          <h1>Your profile could not be loaded.</h1>
          <p>{gate.message}</p>
          <button
            className="google-sign-in"
            onClick={() => {
              setGate({ status: 'profile-loading', user: gate.user })
              setProfileRetry((attempt) => attempt + 1)
            }}
            type="button"
          >
            Retry loading profile
          </button>
          <button className="auth-secondary-button" onClick={() => void signOutUser()} type="button">
            Sign out
          </button>
        </section>
      </main>
    )
  }

  return children({
    user: gate.user,
    profile: gate.profile,
    saveOnboarding,
    restartOnboarding,
    clearOnboarding,
    signOutUser,
    signingOut,
  })
}
