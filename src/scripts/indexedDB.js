// Membuka atau membuat IndexedDB

function openDB() {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open('storyDB', 1);

    dbRequest.onerror = (event) => reject(event);

    dbRequest.onsuccess = (event) => resolve(event.target.result);

    dbRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('stories')) {
        db.createObjectStore('stories', { keyPath: 'id' }); // Menggunakan ID sebagai key
      }
    };
  });
}

// Menyimpan data story ke IndexedDB
export async function storeStoryData(stories) {
  const db = await openDB();
  const transaction = db.transaction('stories', 'readwrite');
  const store = transaction.objectStore('stories');
  
  stories.forEach((story) => {
    store.put({
      id: story.id,  // Pastikan setiap story punya ID unik
      name: story.name,
      description: story.description,
      photoUrl: story.photoUrl,  // Gambar URL atau DataURL untuk offline
      lat: story.lat,
      lon: story.lon,
      createdAt: story.createdAt,
    });
  });

  transaction.oncomplete = () => {
    console.log('Data stored in IndexedDB');
  };

  transaction.onerror = (error) => {
    console.error('Failed to store data:', error);
  };
}

// Mengambil data stories dari IndexedDB
export async function getStoredStories() {
  const db = await openDB();
  const transaction = db.transaction('stories', 'readonly');
  const store = transaction.objectStore('stories');
  
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = (error) => reject(error);
  });
}


