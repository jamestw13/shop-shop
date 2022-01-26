export function pluralize(name, count) {
  if (count === 1) {
    return name;
  }
  return name + 's';
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connection to the database
    const request = window.indexedDB.open('shop-shop', 1);

    // create variables to reference database, transaction, and store
    let db, tx, store;

    // if version has changed, or first time using db
    request.onupgradeneeded = function (e) {
      const db = request.result;
      // object stores for different data type
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    // request error handling
    request.onerror = function (e) {
      console.log('There was an error');
    };

    // on database open success
    request.onsuccess = function (e) {
      // save a reference of the database to the `db` variable
      db = request.result;
      // open a transaction to whatever we pass into `storeName`
      tx = db.transaction(storeName, 'readwrite');
      // save a reference to the store object
      store = tx.objectStore(storeName);

      // db error handling
      db.onerror = function (e) {
        console.log('error', e);
      };

      // take action of method passed in
      switch (method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function () {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }

      // close connection on complete transaction
      tx.oncomplete = function () {
        db.close();
      };
    };
  });
}
