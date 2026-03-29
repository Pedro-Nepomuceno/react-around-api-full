/* global use, db, ObjectId */

use("test");

db.getCollection("cards").insertMany([
  {
    name: "Fall",
    link: "https://avatars.mds.yandex.net/i?id=b06ff5dd50cde73ed72b7bffcb3ba3402b1b4836-8378316-images-thumbs&n=13",
    owner: ObjectId("64f0d5095ff7dc0cdd2042c5"),
    likes: [],
  },
  {
    name: "winter",
    link: "https://avatars.mds.yandex.net/i?id=04e4bc09d4337ef9bbcf7aa0a8df37437f018b8e-9727996-images-thumbs&n=13",
    owner: ObjectId("64f0d5095ff7dc0cdd2042c5"),
    likes: [],
  },
  {
    name: "Summer",
    link: "https://plus.unsplash.com/premium_photo-1682535209719-839f625f8770?q=80&w=1984&auto=format&fit=crop",
    owner: ObjectId("64f0d5095ff7dc0cdd2042c5"),
    likes: [],
  },
]);
