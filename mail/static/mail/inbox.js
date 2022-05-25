document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('form').onsubmit = sending_email;
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
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';


  // Show the mailbox name
  const emailsview = document.querySelector('#emails-view');
  emailsview.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
    
   fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      
  console.log(emails);
  emails.forEach(email => {

    emails_data = document.createElement('p')
    emails_data.className = "box";
    emails_data.innerHTML += email.sender  + "&nbsp &nbsp &nbsp";
    emails_data.innerHTML += email.subject + "&nbsp &nbsp &nbsp";
    emails_data.innerHTML += email.timestamp + "<br>";
    
    emailsview.appendChild(emails_data)

    

  });
    
  });//End Fetch-Emails




}//End load_mailbox()




function sending_email(){
  


  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: 'trancer@email99.com',
        subject: 'Meeting time',
        body: 'How about we meet tomorrow at 3pm?'
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      alert(result.message);
      
    
  });
  localStorage.clear();
  load_mailbox('sent')




}
