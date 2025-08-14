import { RoofInspectionReport } from './RoofAnalysisService';

export class IndexedDBService {
  private dbName = 'roofAnalysisDB';
  private storeName = 'reports';
  private version = 1;

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async saveReport(key: string, report: RoofInspectionReport): Promise<void> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);

        const data = {
          id: key,
          report,
          timestamp: Date.now()
        };

        const request = store.put(data);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();

        transaction.oncomplete = () => db.close();
      });
    } catch (error) {
      console.error('Error saving to IndexedDB:', error);
      throw error;
    }
  }

  async getReport(key: string): Promise<RoofInspectionReport | null> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const data = request.result;
          if (!data) {
            resolve(null);
            return;
          }

          // Check if report is older than 24 hours
          const age = Date.now() - data.timestamp;
          if (age > 24 * 60 * 60 * 1000) {
            // Delete old report
            const deleteTransaction = db.transaction(this.storeName, 'readwrite');
            const deleteStore = deleteTransaction.objectStore(this.storeName);
            deleteStore.delete(key);
            resolve(null);
          } else {
            resolve(data.report);
          }
        };

        transaction.oncomplete = () => db.close();
      });
    } catch (error) {
      console.error('Error reading from IndexedDB:', error);
      return null;
    }
  }

  async clearOldReports(): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.openCursor();

      const twentyFourHours = 24 * 60 * 60 * 1000;
      const now = Date.now();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          if (now - cursor.value.timestamp > twentyFourHours) {
            store.delete(cursor.key);
          }
          cursor.continue();
        }
      };

      transaction.oncomplete = () => db.close();
    } catch (error) {
      console.error('Error clearing old reports:', error);
    }
  }
} 