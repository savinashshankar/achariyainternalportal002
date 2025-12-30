# Content Storage Architecture

## 📦 **Dual Storage Strategy**

Your generated content uses **two storage locations** working together:

---

## 1️⃣ **Google Drive** (File Storage)

### **What's Stored:**
All the actual generated files (the big stuff):
- 🎥 Avatar videos (`.mp4`)
- 🎧 Audio files (`.mp3`)
- 📊 Slide decks (`.pptx`, `.pdf`)
- 🖼️ Infographics (`.png`, `.jpg`)
- 🎬 Explainer videos (`.mp4`)
- ✏️ Whiteboard videos (`.mp4`)
- 💻 Simulators (`.html`)

### **Where in Drive:**
```
Achariya-Content/
└── Course-001/
    └── Module-001/
        ├── source/
        │   └── Quantum_Physics.pdf  ← YOU upload here
        └── generated/
            ├── quantum_physics_avatar_video.mp4      ← System saves here
            ├── quantum_physics_audio.mp3
            ├── quantum_physics_slides.pptx
            ├── quantum_physics_infographic.png
            ├── quantum_physics_explainer.mp4
            ├── quantum_physics_whiteboard.mp4
            └── quantum_physics_simulator.html
```

### **File Access:**
- Files are made **publicly accessible** (via Google Drive share links)
- Each file gets a unique URL like:
  ```
  https://drive.google.com/uc?id=FILE_ID&export=download
  ```

---

## 2️⃣ **Firestore** (Metadata & Tracking)

### **What's Stored:**
Metadata about the generation process (the database records):

**Collection: `content_generations`**
```javascript
{
  id: "uuid-12345",
  course_id: "Course-001",
  module_id: "Module-001",
  source_file_id: "1a2B3c4D...",
  source_file_name: "Quantum_Physics.pdf",
  
  // Generated content details
  output_type: "avatar-video",
  output_file_id: "9X8y7W...",
  output_url: "https://drive.google.com/uc?id=9X8y7W...",
  
  // Quality & status
  fidelity_score: 0.92,
  status: "completed",
  
  // Timestamps
  created_at: "2024-12-24T10:00:00Z",
  completed_at: "2024-12-24T10:15:00Z",
  
  // Publishing
  published_to_lms: true,
  published_at: "2024-12-24T10:16:00Z"
}
```

**Collection: `generation_tasks`**
```javascript
{
  id: "task-uuid-67890",
  course_id: "Course-001",
  module_id: "Module-001",
  source_file_id: "1a2B3c4D...",
  
  total_tasks: 7,
  completed_tasks: 7,
  failed_tasks: 0,
  status: "completed"
}
```

---

## 🔄 **How They Work Together:**

### **Generation Flow:**
```
1. YOU upload → Google Drive (/source/)
2. System detects → Reads from Drive
3. System generates → Creates 7 files
4. System saves → Uploads to Drive (/generated/)
5. System records → Saves metadata to Firestore
6. System publishes → LMS reads URLs from Firestore
```

### **LMS Integration:**
```javascript
// Your LMS queries Firestore to get content
const moduleContent = await firestore
  .collection('content_generations')
  .where('course_id', '==', 'Course-001')
  .where('module_id', '==', 'Module-001')
  .where('published_to_lms', '==', true)
  .get();

// Results
[
  { type: 'avatar-video', url: 'https://drive.google.com/...' },
  { type: 'audio', url: 'https://drive.google.com/...' },
  { type: 'slides', url: 'https://drive.google.com/...' },
  // ... etc
]

// LMS displays these links to students
```

---

## 💡 **Why This Approach?**

### **Google Drive Benefits:**
- ✅ Unlimited storage (with your plan)
- ✅ Already set up
- ✅ Easy file management
- ✅ Can browse/download files manually
- ✅ Automatic CDN (Google's servers)

### **Firestore Benefits:**
- ✅ Fast queries for LMS
- ✅ Tracks generation status
- ✅ Stores quality metrics
- ✅ Easy filtering (by course, module, status)
- ✅ Real-time updates

---

## 🎯 **Student Experience:**

When a student opens Module-001 in your LMS:

1. **LMS queries Firestore:** "Get all content for Module-001"
2. **Firestore returns:** URLs to Google Drive files
3. **LMS displays:** 
   - 🎥 Watch Avatar Video → (streams from Drive)
   - 🎧 Listen to Audio → (plays from Drive)
   - 📊 View Slides → (opens from Drive)
   - etc.

**All files served directly from Google Drive, but organized via Firestore!**

---

## ✅ **Summary:**

| Storage | Purpose | What's Stored |
|---------|---------|---------------|
| **Google Drive** | File hosting | Actual MP4s, PDFs, images, etc. |
| **Firestore** | Metadata & tracking | URLs, status, quality scores |
| **LMS** | Display layer | Reads from Firestore, links to Drive |

**Best of both worlds:** Drive handles the heavy files, Firestore handles the data! 🚀
