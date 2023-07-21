# Email Client

This is a front-end for an email client that interacts with a Django-based API to send and receive emails. The application is designed as a single-page app using JavaScript, HTML, and CSS.

## Functionality

### Inbox Page

The Inbox page displays a list of emails received by the user. Each email is represented as a box containing information about the sender, subject, and timestamp. Unread emails have a white background, while read emails have a gray background. Clicking on an email will take you to the Email page where you can view the content of the email.

### Sent and Archived Mailboxes

The application also supports Sent and Archived mailboxes, which display the emails sent by the user and the archived emails, respectively. You can navigate between these mailboxes using the buttons provided on the page.

### Compose Email

You can compose a new email by clicking the "Compose" button on the Inbox page. This action will display a form where you can enter the recipient's email address, subject, and body of the email. To send the email, simply click the "Send" button.

### View Email

Clicking on an email in the Inbox will take you to the Email page, where you can see the email's sender, recipients, subject, timestamp, and body. The email will be marked as read once it is viewed.

### Archive and Unarchive

When viewing an Inbox email, you have the option to archive the email, and when viewing an Archive email, you can unarchive it. This feature helps to organize your mailbox. Archived emails will be moved to the Archived mailbox.

### Reply

The application allows you to reply to an email easily. When viewing an email, click the "Reply" button, and it will take you to the email composition form with the recipient field prefilled with the original sender's email address, the subject line prefilled with "Re: original_subject," and the body prefilled with a reply template.

## API Routes

The application uses the following API routes for data retrieval and manipulation:

- **GET /emails/<str:mailbox>**: Returns a list of emails in the specified mailbox in JSON format. The mailboxes supported are inbox, sent, and archive.

- **GET /emails/<int:email_id>**: Returns a single email with the given email_id in JSON format.

- **POST /emails**: Sends a new email. Requires recipients, subject, and body data to be submitted in the request body.

- **PUT /emails/<int:email_id>**: Modifies an email with the given email_id. Used to mark emails as read/unread or archived/unarchived.

## Dependencies

The application uses Django for backend functionality and relies on JavaScript for handling the user interface.
