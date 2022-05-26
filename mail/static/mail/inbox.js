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
    var archive;
    emails_data = document.createElement('p');
    const button_archived = document.createElement('button');
   
    emails_data.className = "box";
    emails_data.innerHTML += email.sender  + "&nbsp &nbsp &nbsp";
    emails_data.innerHTML += email.subject + "&nbsp &nbsp &nbsp";
    emails_data.innerHTML += email.timestamp +"&nbsp &nbsp &nbsp";
    var label = archive_label(email.archived); 
  
    button_archived.innerHTML= `${label}`;
    button_archived.className ='btn btn-primary';
    button_archived.addEventListener('click', () => archive_emails(email.id, email.archived));
    emails_data.appendChild(button_archived);
    emailsview.appendChild(emails_data)

      //No readed emails color
      if (email.read === false) { 
        emails_data.style.backgroundColor = "white";
      }
      else {
        emails_data.style.backgroundColor = '#CDCDCD';
      }

    

  });
    
  });//End Fetch-Emails




}//End load_mailbox()




function sending_email(){
   
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
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

function archive_emails(email_id, email_archived){
  
var newValue = !email_archived;
  
  alert(`${email_id}  ${email_archived}`);

    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: newValue
      })
    })
 
   
    load_mailbox('archive');
    window.location.reload();
}//End archive function

  
    

function archive_label(email_archived){

  if (email_archived === false){

  
    archive = 'Archive';
    email_archived = true;

  }

  else{

    
    archive = 'Unarchive';
    email_archived = false;
  }
  return archive ;




} //Ends archive_label function



