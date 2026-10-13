import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { DatosEmpresaImportadora, ExpedienteOperacion } from '../types';
import { DATOS_EMPRESA_DEFAULT, EXPEDIENTES_INICIALES } from '../data/initialData';

const activeFirebaseConfig = {
  ...firebaseConfig,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey || '',
};

const app = initializeApp(activeFirebaseConfig);
export const db = getFirestore(app, activeFirebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);

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
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validar conexión a Firestore al iniciar
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or connecting...');
      return false;
    }
    return true;
  }
}

/**
 * Guarda o actualiza un expediente en la base de datos
 */
export async function saveExpedienteToFirestore(expediente: ExpedienteOperacion): Promise<void> {
  const path = `expedientes/${expediente.id}`;
  try {
    await setDoc(doc(db, 'expedientes', expediente.id), expediente);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Elimina un expediente de la base de datos
 */
export async function deleteExpedienteFromFirestore(expedienteId: string): Promise<void> {
  const path = `expedientes/${expedienteId}`;
  try {
    await deleteDoc(doc(db, 'expedientes', expedienteId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Elimina todos los expedientes de la base de datos Firestore (limpieza total de datos simulados)
 */
export async function clearAllExpedientesFromFirestore(): Promise<number> {
  try {
    const snap = await getDocs(collection(db, 'expedientes'));
    let count = 0;
    for (const d of snap.docs) {
      await deleteDoc(doc(db, 'expedientes', d.id));
      count++;
    }
    await logAuditoria(
      'Limpieza Total',
      `Se eliminaron ${count} registros simulados de Firestore. Base de datos limpia lista para carga real.`,
      'Administrador'
    );
    return count;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'expedientes');
    return 0;
  }
}

/**
 * Guarda los datos de configuración de la empresa
 */
export async function saveEmpresaToFirestore(empresa: DatosEmpresaImportadora): Promise<void> {
  const path = 'empresa/config';
  try {
    await setDoc(doc(db, 'empresa', 'config'), empresa);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Registra un evento en la bitácora de auditoría y seguridad
 */
export async function logAuditoria(accion: string, detalles: string, usuario: string = 'Administrador'): Promise<void> {
  const id = `audit-${Date.now()}`;
  const path = `auditoria/${id}`;
  try {
    await setDoc(doc(db, 'auditoria', id), {
      id,
      fecha: new Date().toISOString(),
      accion,
      detalles,
      usuario,
    });
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
}
