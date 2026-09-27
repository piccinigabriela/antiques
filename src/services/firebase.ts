import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  deleteDoc, 
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AntiqueItem, Dealer, NegotiationOffer } from '../types';
import { INITIAL_DEALERS, INITIAL_ITEMS, INITIAL_OFFERS } from '../data/mockData';

// Initialize Firebase App
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with configured databaseId if provided
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId)
  : getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp);

// Collection References
export const ITEMS_COLLECTION = 'antique_items';
export const DEALERS_COLLECTION = 'dealers';
export const OFFERS_COLLECTION = 'negotiation_offers';
export const META_COLLECTION = 'system_meta';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validates connection to Firestore backend
 */
export async function validateConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, META_COLLECTION, 'connection_check'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline mode or waiting for connection.');
    }
    return false;
  }
}

/**
 * Seed initial catalog data to Firestore if collections are empty.
 * Runs once only; once seeded, it will never re-seed or resurrect user-deleted items.
 */
export async function seedInitialDataIfEmpty() {
  try {
    const isLocalInit = typeof window !== 'undefined' && localStorage.getItem('anticuario_catalog_initialized_v3') === 'true';

    const seedStatusDoc = await getDoc(doc(db, META_COLLECTION, 'catalog_seed_status'));
    if (seedStatusDoc.exists()) {
      // Seeding has already been completed; do not touch or re-insert deleted items!
      return;
    }

    // If already marked as initialized in local storage, mark cloud seeded status as well
    if (isLocalInit) {
      await setDoc(doc(db, META_COLLECTION, 'catalog_seed_status'), {
        seeded: true,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const itemsSnapshot = await getDocs(collection(db, ITEMS_COLLECTION));
    if (itemsSnapshot.empty) {
      console.log('Seeding initial items to Firestore...');
      for (const item of INITIAL_ITEMS) {
        await setDoc(doc(db, ITEMS_COLLECTION, item.id), item);
      }
    }

    const dealersSnapshot = await getDocs(collection(db, DEALERS_COLLECTION));
    if (dealersSnapshot.empty) {
      console.log('Seeding initial dealers to Firestore...');
      for (const dealer of INITIAL_DEALERS) {
        await setDoc(doc(db, DEALERS_COLLECTION, dealer.id), dealer);
      }
    }

    const offersSnapshot = await getDocs(collection(db, OFFERS_COLLECTION));
    if (offersSnapshot.empty) {
      console.log('Seeding initial offers to Firestore...');
      for (const offer of INITIAL_OFFERS) {
        await setDoc(doc(db, OFFERS_COLLECTION, offer.id), offer);
      }
    }

    // Mark as permanently seeded so future reloads will never resurrect deleted items
    await setDoc(doc(db, META_COLLECTION, 'catalog_seed_status'), {
      seeded: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Notice during Firestore initial seed:', err);
  }
}

/**
 * Save or update an antique item in Firestore
 */
export async function saveItemToFirestore(item: AntiqueItem): Promise<void> {
  try {
    // Sanitize item to remove undefined values which cause Firestore setDoc to fail or drop
    const sanitized = JSON.parse(JSON.stringify(item));
    await setDoc(doc(db, ITEMS_COLLECTION, item.id), sanitized, { merge: true });
  } catch (err) {
    console.error('Error saving item to Firestore:', err);
    throw err;
  }
}

/**
 * Delete an antique item from Firestore
 */
export async function deleteItemFromFirestore(itemId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, ITEMS_COLLECTION, itemId));
  } catch (err) {
    console.error('Error deleting item from Firestore:', err);
    throw err;
  }
}

/**
 * Save or update an offer/negotiation in Firestore
 */
export async function saveOfferToFirestore(offer: NegotiationOffer): Promise<void> {
  try {
    await setDoc(doc(db, OFFERS_COLLECTION, offer.id), offer, { merge: true });
  } catch (err) {
    console.error('Error saving offer to Firestore:', err);
    throw err;
  }
}

/**
 * Save or update a dealer profile in Firestore
 */
export async function saveDealerToFirestore(dealer: Dealer): Promise<void> {
  try {
    await setDoc(doc(db, DEALERS_COLLECTION, dealer.id), dealer, { merge: true });
  } catch (err) {
    console.error('Error saving dealer to Firestore:', err);
    throw err;
  }
}

/**
 * Delete a dealer profile from Firestore
 */
export async function deleteDealerFromFirestore(dealerId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, DEALERS_COLLECTION, dealerId));
  } catch (err) {
    console.error('Error deleting dealer from Firestore:', err);
    throw err;
  }
}

/**
 * Delete multiple antique items from Firestore in batch/sequence
 */
export async function deleteMultipleItemsFromFirestore(itemIds: string[]): Promise<void> {
  try {
    for (const id of itemIds) {
      await deleteDoc(doc(db, ITEMS_COLLECTION, id));
    }
  } catch (err) {
    console.error('Error deleting multiple items from Firestore:', err);
    throw err;
  }
}

