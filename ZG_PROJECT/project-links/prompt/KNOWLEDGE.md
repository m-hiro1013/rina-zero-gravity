# Project Knowledge Base

## Tech Stack Notes
- **Pico.css**: Class-less CSS framework. Semantic HTML is key.
- **Firebase V9 Modular SDK**: Tree-shakable, import only what you need.
- **SortableJS**: For drag-and-drop reordering.

## Development Tips
- Put Firebase config in `js/firebase-config.js`.
- Use `type="module"` in script tags for ES Module support.

## Lessons Learned
- **Firebase SDK Version Mismatch**: Mixing versions (e.g., 11.1.0 and 12.9.0) causes initialization errors. Must ensure all imports use the exact same version string.
- **Security**: Hardcoding `ALLOWED_UID` in client-side logic (`auth.js`) provides an immediate "log out " mechanism for unauthorized users, complementing Firestore security rules.
