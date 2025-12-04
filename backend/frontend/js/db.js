// js/db.js
const DB_NAME = 'distortion-db';
const DB_VERSION = 1;
const STORE_INSTRUMENTS = 'instrumentos';

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      const db = event.target.result;

      // Creamos el object store solo si no existe
      if (!db.objectStoreNames.contains(STORE_INSTRUMENTS)) {
        // Usamos _id de Mongo como clave
        db.createObjectStore(STORE_INSTRUMENTS, { keyPath: '_id' });
      }
    };

    request.onsuccess = event => {
      resolve(event.target.result);
    };

    request.onerror = event => {
      console.error('Error abriendo IndexedDB', event.target.error);
      reject(event.target.error);
    };
  });
}

export async function saveInstruments(instruments) {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_INSTRUMENTS, 'readwrite');
    const store = tx.objectStore(STORE_INSTRUMENTS);

    // Limpia y vuelve a guardar
    store.clear();
    instruments.forEach(item => {
      // Aseguramos que tenga _id (por si un día pruebas datos mock)
      if (!item._id) {
        item._id = crypto.randomUUID();
      }
      store.put(item);
    });

    return tx.complete;
  } catch (err) {
    console.error('Error guardando instrumentos en IndexedDB', err);
  }
}

export async function getAllInstruments() {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_INSTRUMENTS, 'readonly');
    const store = tx.objectStore(STORE_INSTRUMENTS);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = event => reject(event.target.error);
    });
  } catch (err) {
    console.error('Error leyendo instrumentos desde IndexedDB', err);
    return [];
  }
}
