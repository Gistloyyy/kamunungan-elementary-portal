# Firebase setup for Kamunungan Elementary School

The front end is already wired to the Firebase project `kamunungan-es` using the configuration provided for this website. The Firebase web configuration is not a secret; the security boundary is enforced by Authentication and Firestore Rules.

## Enable sign-in providers

In Firebase Console, open **Authentication → Sign-in method** and enable **Email/Password**. Enable **Google** as well if teachers should use the Google button on the access page. Add the deployed site domain under **Authentication → Settings → Authorized domains** if Firebase asks for it.

## Create the content collection

Open **Firestore Database**, create a database if needed, and create a collection named `posts`. The first teacher post will create its document automatically, so no seed documents are required.

## Recommended Firestore rules

These rules make announcements publicly readable while requiring a signed-in teacher to create content. Teachers can only edit or delete content whose `authorId` matches their own Firebase user ID.

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.resource.data.authorId == request.auth.uid;
      allow update, delete: if request.auth != null
        && resource.data.authorId == request.auth.uid;
    }
  }
}
```

## Notes

The site displays a small editorial starter set until Firestore contains posts, which keeps the public homepage meaningful while the board is being set up. Once the first Firestore post exists, the public page and teacher dashboard use the live collection. If Firestore rules have not been published yet, the UI shows the starter notices and reports the Firebase error when a teacher tries to publish.
