import React, { useState, useEffect } from 'react';
import { 
  auth, 
  signInWithGoogle, 
  signOutUser, 
  User 
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { LogIn, LogOut, User as UserIcon, Cloud, CheckCircle2, Shield } from 'lucide-react';

interface AuthBarProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  language: 'th' | 'en';
  historyCount: number;
}

export const AuthBar: React.FC<AuthBarProps> = ({
  currentUser,
  setCurrentUser,
  language,
  historyCount,
}) => {
  const isThai = language === 'th';
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [setCurrentUser]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.warn('Google popup error:', err);
      setAuthError(err.message || 'Popup closed or blocked by browser');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <div
      role="status"
      aria-label={isThai ? 'สถานะการเชื่อมต่อและการซิงค์ข้อมูล' : 'Authentication and sync status'}
      className="w-full bg-slate-900/80 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-2 text-xs"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Identity & Cloud Sync status (Color + Icon + Descriptive Text) */}
        <div className="flex flex-wrap items-center gap-3 text-slate-300">
          <div className="flex items-center gap-1.5">
            {currentUser ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
            ) : (
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
            )}
            <span className="font-medium text-slate-200">
              {currentUser
                ? isThai ? 'คลาวด์ Firestore พร้อมใช้งาน (Cloud Synced)' : 'Firestore Cloud Active'
                : isThai ? 'โหมดเครื่องเดี่ยว (Local Storage Mode)' : 'Local Storage Mode'}
            </span>
          </div>
          <span className="text-slate-400 hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-slate-300 tabular-nums">
            {isThai ? `บันทึกประวัติแล้ว ${historyCount} รายการ` : `${historyCount} generations logged`}
          </span>
        </div>

        {/* Right: User Authentication Action */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || currentUser.email || 'Authenticated user profile avatar'}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover border border-slate-700"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px]"
                  >
                    {currentUser.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <span className="text-slate-200 font-medium">
                  {currentUser.displayName || currentUser.email || 'thitiwas.k@nrru.ac.th'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                aria-label={isThai ? 'ออกจากระบบบัญชีผู้ใช้' : 'Sign out of current account'}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 text-xs focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-300 shrink-0" aria-hidden="true" />
                <span>{isThai ? 'ออกจากระบบ' : 'Sign Out'}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {authError && (
                <span role="alert" className="text-rose-300 text-xs hidden md:inline">
                  {authError}
                </span>
              )}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                aria-label={isThai ? 'เข้าสู่ระบบด้วยบัญชี Google เพื่อซิงค์ประวัติบนคลาวด์' : 'Sign in with Google to sync history to Cloud'}
                className="px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors flex items-center gap-1.5 shadow-sm text-xs focus-visible:ring-2 focus-visible:ring-amber-300 disabled:opacity-60"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-950 shrink-0" aria-hidden="true" />
                <span>
                  {loading
                    ? isThai ? 'กำลังเชื่อมต่อ...' : 'Connecting...'
                    : isThai ? 'เข้าสู่ระบบด้วย Google' : 'Sign in with Google'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
