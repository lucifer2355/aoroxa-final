<?php
if(isset($_POST['email'])) {
 
    
    $email_to = "info@aoroxa.com";
    $email_subject = "Wellcome to Aoroxa";
    $name = $_POST['name']; 
    $email_from = $_POST['email']; 
    $subject = $_POST['subject']; 
    $phone = $_POST['phone']; 
    $message = $_POST['message']; 
 
    $from_message .= "Thank you ".$name." for getting in touch!.\n\nWe appreciate you contacting us. One of our team-member will get back in touch with you soon.\n\nIf your inquiry is urgent, please use the telephone number listed below to talk to one of our staff members. Otherwise, we will reply by email as soon as possible.\n\n Our Phone number is +91-8347077244 and \n Email: info@aoroxa.com  " ;
    $email_message = "Form details below.\n\n";
 
    $subject_thanks = "Welcome! Aoroxa is ready to taking you forward.";
     
    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }
 
     
 
    $email_message .= "name: ".clean_string($name)."\n";
    $email_message .= "email: ".clean_string($email_from)."\n";
    $email_message .= "subject: ".clean_string($subject)."\n";
    $email_message .= "phone: ".clean_string($phone)."\n";
    $email_message .= "message: ".clean_string($message)."\n";
    
 

$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_to."\r\n" .
'X-Mailer: PHP/' . phpversion();

$headers_from = 'From: '.$email_to."\r\n".
'Reply-To: '.$email_From."\r\n" .
'X-Mailer: PHP/' . phpversion();

mail($email_from, $subject_thanks,$from_message, $header_from);
mail($email_to, $email_subject, $email_message, $headers); 

header("location:javascript://history.go(-1)");



}
?>