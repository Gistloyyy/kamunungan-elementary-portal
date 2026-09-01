# Firebase setup

The front end is wired to the Firebase project `kamunungan-es` using the configuration provided for this website. The Firebase web configuration is not a secret; the security boundary is enforced by Authentication, Firestore Rules, and Storage Rules.

## Enable sign-in providers

In Firebase Console, open **Authentication → Sign-in method** and enable **Email/Password**. Enable **Google** as well if teachers should use the Google button. Add the deployed site domain under **Authentication → Settings → Authorized domains** when required.

## Create Firestore and Storage

Create a Firestore database and a Storage bucket if they do not already exist. The application creates `posts` and `teacherProfiles` documents when the first teacher registers or publishes. Storage uses `post-images/` for inline editor images and `post-attachments/` for downloadable activity files.

## Administrator bootstrap

The default administrator email is `admin@kamunungan.edu.ph`, or the value supplied through `VITE_ADMIN_EMAIL`. Change that value before deployment if needed. The first administrator must register with that exact email, then the profile should be checked in Firestore under `teacherProfiles/{uid}`. If rules reject client-side admin bootstrap in your project, create this profile manually with `role: "admin"` and `status: "approved"`. Treat the administrator email and any manual profile change as deployment configuration, not public content.

## Approval-aware Firestore rules

These rules keep announcements publicly readable while requiring a teacher profile with `status: "approved"` before publishing. Only an administrator can change teacher status. Replace the bootstrap email with the same administrator email used by the app.

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }
    function isAdmin() {
      return signedIn() && (
        request.auth.token.email == "admin@kamunungan.edu.ph" ||
        (exists(/databases/$(database)/documents/teacherProfiles/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/teacherProfiles/$(request.auth.uid)).data.role == "admin" &&
         get(/databases/$(database)/documents/teacherProfiles/$(request.auth.uid)).data.status == "approved")
      );
    }
    function isApprovedTeacher() {
      return signedIn() && (
        isAdmin() ||
        (exists(/databases/$(database)/documents/teacherProfiles/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/teacherProfiles/$(request.auth.uid)).data.role == "teacher" &&
         get(/databases/$(database)/documents/teacherProfiles/$(request.auth.uid)).data.status == "approved")
      );
    }

    match /teacherProfiles/{uid} {
      allow read: if signedIn() && (request.auth.uid == uid || isAdmin());
      allow create: if signedIn() && request.auth.uid == uid
        && ((request.auth.token.email == "admin@kamunungan.edu.ph"
          && request.resource.data.role == "admin"
          && request.resource.data.status == "approved")
          || (request.resource.data.role == "teacher"
          && request.resource.data.status == "pending"));
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }

    match /posts/{postId} {
      allow read: if true;
      allow create: if isApprovedTeacher()
        && request.resource.data.authorId == request.auth.uid;
      allow update, delete: if isApprovedTeacher()
        && resource.data.authorId == request.auth.uid;
    }
  }
}
```

## Storage rules

Inline editor images are limited to 5 MB. Downloadable worksheets and documents are limited to 10 MB and can be read publicly so families can access published activity materials. Only approved teachers and administrators can write files.

```text
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function signedIn() { return request.auth != null; }
    function approved() {
      return signedIn() && firestore.get(/databases/(default)/documents/teacherProfiles/$(request.auth.uid)).data.status == "approved";
    }
    match /post-images/{imageId} {
      allow read: if true;
      allow write: if approved()
        && request.resource.contentType.matches('image/.*')
        && request.resource.size < 5 * 1024 * 1024;
    }
    match /post-attachments/{fileId} {
      allow read: if true;
      allow write: if approved()
        && request.resource.size < 10 * 1024 * 1024
        && request.resource.contentType in [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];
    }
  }
}
```

The teacher editor accepts PDF, Word, spreadsheet, and presentation files for activity posts. Uploads display progress, store download metadata with the post, and render as public download links. Publish the rules in Firebase Console before using live approvals or uploads.
