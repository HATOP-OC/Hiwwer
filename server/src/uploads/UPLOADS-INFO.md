# Uploads Directory Documentation

This directory is used for storing user-uploaded files from chat messages in the order system.

## What gets stored here:
- Message attachments from order chats
- Images (jpg, png, gif, etc.)
- Documents (pdf, doc, docx, txt, etc.)
- Archives (zip, rar, 7z, etc.)

## Important notes:
- Files are automatically deleted when messages with attachments are deleted
- User-uploaded files are not committed to git repository
- Maximum file size: 10MB
- Directory is created automatically on first upload

## File naming convention:
Files are stored with timestamp prefix for uniqueness:
`{timestamp}-{original_filename}`

Example: `1640995200000-document.pdf`
