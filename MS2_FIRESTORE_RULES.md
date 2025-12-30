# MS2 Firestore Security Rules

Add these rules to Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // EXISTING RULES - KEEP THESE
    match /liveQuizSessions/{sessionId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
      allow delete: if true;
    }

    match /liveQuizAttempts/{attemptId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
      allow delete: if true;
    }

    match /evidenceSubmissions/{submissionId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
      allow delete: if true;
      
      match /reviews/{reviewId} {
        allow read: if true;
        allow create: if true;
        allow update: if true;
      }
    }

    // NEW RULES FOR MS2 - ADD THESE
    match /quizAttemptHistory/{attemptId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
    }

    match /questionMetadata/{questionId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
    }

    match /quizRetakePermissions/{permId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
    }
  }
}
```

**Apply these in Firebase Console now!**
