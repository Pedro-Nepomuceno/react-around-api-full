/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('mongodb+srv://pedrohnlima:palavrachave@around-us.r1sp21o.mongodb.net');

// Insert a few documents into the sales collection.
db.getCollection('cards').insertMany([
 [
  {
    
    "name": "Fall",
    "link": "https://avatars.mds.yandex.net/i?id=b06ff5dd50cde73ed72b7bffcb3ba3402b1b4836-8378316-images-thumbs&n=13",
    "owner": ObjectId("64f0d5095ff7dc0cdd2042c5"),
    "likes": []
  },
  {
   
    "name": "winter",
    "link": "https://avatars.mds.yandex.net/i?id=04e4bc09d4337ef9bbcf7aa0a8df37437f018b8e-9727996-images-thumbs&n=13",
    "owner": ObjectId("64f0d5095ff7dc0cdd2042c5"),
    "likes": []
  },
  {
   
    "name": "Summer",
    "link": "https://plus.unsplash.com/premium_photo-1682535209719-839f625f8770?q=80&w=1984&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "owner": bjectId("64f0d5095ff7dc0cdd2042c5"),
    "likes": []
  }
]
]);

