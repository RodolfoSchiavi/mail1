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
  document.querySelector('#emails-detail-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#emails-detail-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';


  // Show the mailbox name
  const emailsview = document.querySelector('#emails-view');
  emailsview.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
    
   fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      
  console.log(emails);
  emails.forEach(email => {
    const row_data = document.createElement('div');
    row_data.className= "row row-data"
    emails_data = document.createElement('div');
    const button_archived = document.createElement('button');
    const button_detail = document.createElement('button');
   
    emails_data.className = "box col-7";
    emails_data.innerHTML += email.sender  + "&nbsp &nbsp &nbsp";
    emails_data.innerHTML += email.subject + "&nbsp &nbsp &nbsp";
    emails_data.innerHTML += email.timestamp +"&nbsp";
    var label = archive_label(email.archived); 
  
    button_archived.innerHTML= `${label}`;
    button_archived.className ='btn btn-primary col-1';
    button_archived.addEventListener('click', () => archive_emails(email.id, email.archived));
    
    button_detail.innerHTML = 'View Email Detail'
    button_detail.className ='btn btn-dark col-3';
    button_detail.addEventListener('click', () => email_detail(email.id));
    
    row_data.appendChild(emails_data)
    row_data.appendChild(button_archived);
    row_data.appendChild(button_detail);
    
    emailsview.appendChild(row_data)
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

function email_detail(email_detail_id){

  

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#emails-detail-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';


  fetch(`/emails/${email_detail_id}`)
  .then(response => response.json())
  .then(email => {

 
    document.querySelector('#detail-timestamp').innerHTML = ` ${ email.timestamp}`
    document.querySelector('#detail-sender').innerHTML = ` ${ email.sender}`
    document.querySelector('#detail-recipients').innerHTML = ` ${ email.recipients}`
    document.querySelector('#detail-subject').innerHTML = ` ${ email.subject}`
    document.querySelector('#detail-body').innerHTML = ` ${ email.body}`
   
    const reply_button_div = document.querySelector('#reply-button')
    reply_button_div.addEventListener('click', () => reply_email(email.id , email.sender, email.subject, email.body));
    
  }
    );
    

}//Ends email detail function

function reply_email(email_id, email_sender ,email_subject, email_body){
  
  alert(`${email_id} ${email_sender} ${email_subject} ${email_body}`);
  
  
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#emails-detail-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  document.querySelector('#compose-recipients').setAttribute('value', email_sender); 
  document.querySelector('#compose-subject').setAttribute('value', email_subject) ;
  document.querySelector('#compose-body').innerHTML = email_body;

  
}//Ends reply email function



