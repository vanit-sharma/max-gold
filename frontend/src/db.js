import Dexie from "dexie";
export const db = new Dexie("BpReact");
// Define tables and indexes
db.version(1).stores({
  sessions: "++id,key,value",
  evenodd: "++id,key,value",
  figure: "++id,key,value"
});

export const addSession = async (key, value) => {
  await db.sessions.put({ key: key, value: value });
};

export const getAllSession = async () => {
  const allSession = await db.sessions.toArray();
  return allSession;
};

export const addEvenOdd = async (key, value) => {
  const existingList = await getAllEvenOddList();

  if (existingList !== undefined && existingList.length > 0) {
    let isFoundId = 0;
    for (let i = 0; i < existingList.length; i++) {
      let obj = existingList[i];
      let searchKey = obj.key;
      let keyId = obj.id;
      if (searchKey == key) {
        isFoundId = keyId;
        break;
      }
    }
    if (isFoundId !== 0) {
      await db.evenodd.update(isFoundId, { key: key, value: value });
    } else {
      await db.evenodd.add({ key: key, value: value });
    }
  } else {
    await db.evenodd.add({ key: key, value: value });
    //await db.evenodd.add(key, { value });
    //console.log("Added new record:", key);
  }
};

export const getAllEvenOddList = async () => {
  const allEvenodd = await db.evenodd.toArray();
  return allEvenodd;
};

export const getAllTablesList = async () => {
  debugger;
  console.log(db.tables.map((t) => t.name));
};

export const deletAllTables = async () => {
  await db.sessions.clear();
  await db.evenodd.clear();
  await db.figure.clear();
  //await db.table3.clear();
};

export const addFigure = async (key, value) => {
  const existingList = await getAllFigureist();
  if (existingList !== undefined && existingList.length > 0) {
    let isFoundId = 0;
    for (let i = 0; i < existingList.length; i++) {
      let obj = existingList[i];
      let searchKey = obj.key;
      let keyId = obj.id;
      if (searchKey == key) {
        isFoundId = keyId;
        break;
      }
    }
    if (isFoundId !== 0) {
      await db.figure.update(isFoundId, { key: key, value: value });
    } else {
      await db.figure.add({ key: key, value: value });
    }
  } else {
    await db.figure.add({ key: key, value: value });
    //await db.evenodd.add(key, { value });
    //console.log("Added new record:", key);
  }
};

export const getAllFigureist = async () => {
  const allFigureList = await db.figure.toArray();
  return allFigureList;
};



