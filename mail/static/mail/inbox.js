document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Add event listener to the compose form submit button
  document.querySelector('#compose-form').addEventListener('submit', send_email);
}

function send_email(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get input values from the compose form
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;


  // Make a POST request to the /emails endpoint
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    })
  })
  .then(response => response.json())
  .then(result => {
    // Print result
    console.log(result);

    // Load the user's sent mailbox after sending the email
    load_mailbox('sent');
  });
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3 class="mb-4">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Make a GET request to fetch the emails for the specified mailbox
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Render the emails in the mailbox
      emails.forEach(email => render_email(email, mailbox));
    });
}

function render_email(email, mailbox) {
  // Create a new div element for the email
  const emailDiv = document.createElement('div');
  emailDiv.className = 'email card mb-3';
  
  // Set the background color based on read/unread status
  if (email.read) {
    emailDiv.classList.add('bg-light');
  }

  // Set the email content inside the div
  emailDiv.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${email.subject}</h5>
      <p class="card-text">${email.sender}</p>
      <p class="card-text">${email.timestamp}</p>
    </div>
  `;

  // Add click event listener to open the email
  emailDiv.addEventListener('click', () => open_email(email.id, mailbox));

  // Append the email div to the emails view
  document.querySelector('#emails-view').appendChild(emailDiv);
}

function open_email(emailId, mailbox) {
  // Make a GET request to fetch the full email details
  fetch(`/emails/${emailId}`)
    .then(response => response.json())
    .then(email => {
      // Display the full email details in a separate view or modal
      // Update the code below to match your UI requirements
      const emailDetails = `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${email.subject}</h5>
            <p class="card-text">From: ${email.sender}</p>
            <p class="card-text">To: ${email.recipients.join(', ')}</p>
            <p class="card-text">Timestamp: ${email.timestamp}</p>
            <p class="card-text">${email.body}</p>
          </div>
        </div>
        <button class="btn btn-primary" id="reply">Reply</button>
        <button class="btn btn-primary" id="archive-btn">${email.archived ? 'Unarchive' : 'Archive'}</button>
      `;
      document.querySelector('#emails-view').innerHTML = emailDetails;
      document.querySelector('#reply').addEventListener('click', () => reply_to_email(email.sender, email.subject, email.timestamp, email.body));
      document.querySelector('#archive-btn').addEventListener('click', () => archive_email(email.id, email.archived));

      // Mark the email as read if it was opened from the inbox
      if (mailbox === 'inbox' && !email.read) {
        mark_email_as_read(emailId);
      }
    });
}

function mark_email_as_read(emailId) {
  fetch(`/emails/${emailId}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  });
}

function archive_email(emailId, archiveStatus) {
  fetch(`/emails/${emailId}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: !archiveStatus
    })
  })
    .then(() => load_mailbox('inbox'));
}

function reply_to_email(sender, subject, timestamp, body) {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Pre-fill the composition fields
  document.querySelector('#compose-recipients').value = sender;
  document.querySelector('#compose-subject').value = addReplyPrefix(subject);
  document.querySelector('#compose-body').value = generateReplyBody(sender, timestamp, body);
}

function addReplyPrefix(subject) {
  if (subject.startsWith('Re: ')) {
    return subject;
  } else {
    return 'Re: ' + subject;
  }
}

function generateReplyBody(sender, timestamp, body) {
  const formattedTimestamp = new Date(timestamp).toLocaleString();
  return `On ${formattedTimestamp} ${sender} wrote:\n\n${body}`;
}
