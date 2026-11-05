import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
export type { User };
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with the provisioned named database
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export interface GenerationRecord {
  id: string;
  userId: string;
  userEmail?: string;
  prompt: string;
  mode: string;
  commands: string[];
  responseMode: string;
  finalOptimizedPrompt: string;
  threePassPrompt: {
    pass1Intent: string;
    pass2Visualization: string;
    pass3Control: string;
    finalOptimizedPrompt: string;
    negativePrompt?: string;
  };
  visualSpecification: Record<string, any>;
  qaStatus: string;
  qaSummary: string;
  qaChecks?: Array<{ id: string; point: string; status: string; note: string }>;
  researchFigure?: {
    isResearchActive?: boolean;
    figureType?: string;
    title?: string;
    apaCaption?: string;
    provenance?: string;
    empiricalBoundary?: string;
  };
  technicalDrawing?: {
    isTechnicalActive?: boolean;
    viewsSelected?: string[];
    componentsIdentified?: string[];
    dimensionStatus?: string;
    engineeringLogic?: string;
  };
  imageUrl?: string | null;
  aspectRatio: string;
  createdAt: string;
  timestamp?: number;
  tags?: string[];
  notes?: string;
  isFavorite?: boolean;
  updatedAt?: string;
}

// Auth helpers
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      // Save or update user profile document
      await setDoc(
        doc(db, 'users', result.user.uid),
        {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return result.user;
  } catch (error) {
    console.error('Error during Google sign-in:', error);
    throw error;
  }
}

export async function signOutUser() {
  return firebaseSignOut(auth);
}

// Generation History Firestore operations
export async function saveGenerationLog(record: GenerationRecord): Promise<void> {
  // Always update local storage for immediate offline and fast rollback
  try {
    const local = getLocalHistory();
    const updated = [record, ...local.filter((r) => r.id !== record.id)].slice(0, 50);
    localStorage.setItem('visual_os_history', JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }

  // If user is authenticated, sync to Firestore
  if (record.userId) {
    try {
      await setDoc(doc(db, 'generation_history', record.id), {
        ...record,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.warn('Firestore sync skipped or error:', error);
    }
  }
}

export async function loadUserHistory(userId?: string): Promise<GenerationRecord[]> {
  const localHistory = getLocalHistory();

  if (!userId) {
    return localHistory;
  }

  try {
    const q = query(
      collection(db, 'generation_history'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    const remoteRecords: GenerationRecord[] = [];
    snapshot.forEach((d) => {
      remoteRecords.push(d.data() as GenerationRecord);
    });

    if (remoteRecords.length > 0) {
      // Merge with local history and save
      const mergedMap = new Map<string, GenerationRecord>();
      [...remoteRecords, ...localHistory].forEach((item) => {
        mergedMap.set(item.id, item);
      });
      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      localStorage.setItem('visual_os_history', JSON.stringify(merged));
      return merged;
    }
  } catch (error) {
    console.warn('Could not fetch from Firestore, using local cache:', error);
  }

  return localHistory;
}

export async function deleteGenerationLog(id: string, userId?: string): Promise<void> {
  try {
    const local = getLocalHistory().filter((r) => r.id !== id);
    localStorage.setItem('visual_os_history', JSON.stringify(local));
  } catch (e) {
    console.warn(e);
  }

  if (userId) {
    try {
      await deleteDoc(doc(db, 'generation_history', id));
    } catch (err) {
      console.warn('Failed to delete from Firestore:', err);
    }
  }
}

export async function updateGenerationLog(
  id: string,
  updates: Partial<GenerationRecord>,
  userId?: string
): Promise<void> {
  const updatedAt = new Date().toISOString();
  try {
    const local = getLocalHistory().map((r) => {
      if (r.id === id) {
        return { ...r, ...updates, updatedAt };
      }
      return r;
    });
    localStorage.setItem('visual_os_history', JSON.stringify(local));
  } catch (e) {
    console.warn('Could not update localStorage record:', e);
  }

  if (userId) {
    try {
      await setDoc(
        doc(db, 'generation_history', id),
        {
          ...updates,
          updatedAt,
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Failed to update in Firestore:', err);
    }
  }
}

export async function bulkUpdateGenerationLogs(
  recordIds: string[],
  changes: {
    tagsToAdd?: string[];
    tagsToRemove?: string[];
    replaceAllTags?: string[];
    notes?: string;
    appendNotes?: boolean;
    clearNotes?: boolean;
  },
  userId?: string
): Promise<GenerationRecord[]> {
  const updatedAt = new Date().toISOString();
  const idSet = new Set(recordIds);
  const local = getLocalHistory();

  const updatedRecords = local.map((record) => {
    if (!idSet.has(record.id)) {
      return record;
    }

    let nextTags: string[] = record.tags ? [...record.tags] : [];

    if (changes.replaceAllTags !== undefined) {
      nextTags = [...changes.replaceAllTags];
    } else {
      if (changes.tagsToRemove && changes.tagsToRemove.length > 0) {
        const removeSet = new Set(changes.tagsToRemove);
        nextTags = nextTags.filter((t) => !removeSet.has(t));
      }
      if (changes.tagsToAdd && changes.tagsToAdd.length > 0) {
        changes.tagsToAdd.forEach((tag) => {
          const trimmed = tag.trim();
          if (trimmed && !nextTags.includes(trimmed)) {
            nextTags.push(trimmed);
          }
        });
      }
    }

    let nextNotes: string | undefined = record.notes;
    if (changes.clearNotes) {
      nextNotes = '';
    } else if (changes.notes !== undefined) {
      const trimmedNotes = changes.notes.trim();
      if (trimmedNotes) {
        if (changes.appendNotes && record.notes && record.notes.trim()) {
          const dateLabel = new Date().toLocaleDateString();
          nextNotes = `${record.notes}\n[${dateLabel}] ${trimmedNotes}`;
        } else {
          nextNotes = trimmedNotes;
        }
      }
    }

    return {
      ...record,
      tags: nextTags,
      notes: nextNotes,
      updatedAt,
    };
  });

  try {
    localStorage.setItem('visual_os_history', JSON.stringify(updatedRecords));
  } catch (e) {
    console.warn('Could not save bulk update to localStorage:', e);
  }

  // Sync to Firestore if authenticated
  if (userId) {
    const promises = updatedRecords
      .filter((r) => idSet.has(r.id))
      .map((r) =>
        setDoc(
          doc(db, 'generation_history', r.id),
          {
            tags: r.tags || [],
            notes: r.notes || '',
            updatedAt,
          },
          { merge: true }
        ).catch((err) => console.warn(`Error updating doc ${r.id}:`, err))
      );
    await Promise.all(promises);
  }

  return updatedRecords;
}

export function getLocalHistory(): GenerationRecord[] {
  try {
    const raw = localStorage.getItem('visual_os_history');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not parse local history:', e);
  }
  return [];
}
