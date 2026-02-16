import {
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    User
} from 'firebase/auth';
import { auth } from './config';
import { AuthUser } from '@/types';

const provider = new GoogleAuthProvider();
const ALLOWED_UID = process.env.NEXT_PUBLIC_ALLOWED_UID!;

console.log('ALLOWED_UID from env:', ALLOWED_UID);

// Firebase User → AuthUser 変換
function toAuthUser(user: User): AuthUser {
    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
    };
}

// 許可UIDチェック
export function isAllowedUser(uid: string): boolean {
    return uid === ALLOWED_UID;
}

// Googleログイン
export async function signIn(): Promise<void> {
    try {
        const result = await signInWithPopup(auth, provider);
        if (!isAllowedUser(result.user.uid)) {
            await firebaseSignOut(auth);
            throw new Error('Unauthorized user');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// ログアウト
export async function signOut(): Promise<void> {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

// 認証状態監視
export function subscribeAuth(
    callback: (user: AuthUser | null, isAllowed: boolean) => void
): () => void {
    console.log('Subscribing to auth state changes...');
    return onAuthStateChanged(auth, (user) => {
        console.log('onAuthStateChanged fired. User:', user?.uid);
        if (user) {
            const allowed = isAllowedUser(user.uid);
            console.log('isAllowedUser check:', allowed);
            if (!allowed) {
                firebaseSignOut(auth);
                callback(null, false);
            } else {
                callback(toAuthUser(user), true);
            }
        } else {
            callback(null, false);
        }
    });
}
