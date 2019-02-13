import app from 'firebase/app'
import "firebase/auth"
import 'firebase/firestore'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();
  }

  // Auth API
  doCreateUserWithEmailAndPassword = (email, password) => 
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () =>
    this.auth.signOut();

  doPasswordReset = email => 
    this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password)

  // User API
  user = uid => this.db.collection("users").doc(uid);

  doAddUser = ({ ...userdata }) => {
    if (!userdata.email) {
      throw new Error('Невозможно добавить пользователя без email');
    }

    this.db.collection("users").add({
      userdata
    })
  }

  doGetUsers = () => 
    this.db.collection("users").get();

  doGetCurrentUser = () => 
    this.auth.currentUser;

  // Blanks API
  doCreateBlank = title => {
    const user = this.doGetCurrentUser();
    
    let users = [];
    users.push(user.uid);

    const createdAt = Date.now();
    const dateNow = new Date();
    const place = '';
    const current = true;

    let month = dateNow.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;

    let day = dateNow.getDate() + 1;
    day = day < 10 ? `0${day}` : day;

    const date = `${day}.${month}.${dateNow.getFullYear()}`;


    return this.db.collection("blanks").add({
      title,
      users,
      createdAt,
      date,
      place,
      current,
      stocktaker: '',
      fields: []
    })
  }

  doRemoveBlank = blankID => {
    this.db.collection("blanks").doc(blankID).delete();
  }

  doUpdateBlank = (blankID, { ...newData }) => {
    const blankRef = this.db.collection("blanks").doc(blankID);

    this.db.runTransaction(transaction =>
      transaction
        .get(blankRef)
        .then(blank => {
          if (!blank.exists) {
            throw new Error('Бланк не существует!');
          }

          transaction.update(blankRef, newData);
        })
    )
  }

  doChangeCurrentBlank = (selectedBlank) => {
    const user = this.doGetCurrentUser();
    const userBlanks = this.db.collection("blanks");
    let activeBlanks = [];

    return userBlanks.where("users", "array-contains", user.uid).where("current", "==", true).get()
      .then(snapshots => {
        
        return new Promise((resolve, reject) => {
          debugger;
          if (snapshots.size < 1) {
            if (selectedBlank) {
              userBlanks.doc(selectedBlank)
                .update({ current: true })
                .then(() => resolve())
                .catch(e => reject(e))
            } else {
              resolve()
            }
          }

          snapshots.forEach(snapshot => activeBlanks.push(snapshot.id))

          activeBlanks.forEach(blank => {
            userBlanks.doc(blank)
              .update({ "current": false })
              .then(() => {
                if (selectedBlank) {
                  userBlanks.doc(selectedBlank)
                    .update({ current: true })
                    .then(() => resolve())
                    .catch(e => reject(e))
                } else {
                  resolve()
                }
              })
              .catch(e => reject(e))
            }
          )
        })
        
      })
  }

  doGetCurrentBlank = () => {
    const user = this.doGetCurrentUser();

    return this.db.collection("blanks").where("users", "array-contains", user.uid).where("current", "==", true).limit(1);
  }

  doGetBlanks = () => {
    const user = this.doGetCurrentUser();

    return this.db.collection("blanks").where("users", "array-contains", user.uid);
  }

  // Fields API
  doSaveFields = (fields, blank) => {
    return this.db.collection("blanks").doc(blank).update({ fields });
  }

  doSaveBlankMetaField = (blank, field, value) => {
    return this.db.collection("blanks").doc(blank).update({ [field]: value })
  }
}

export default Firebase;