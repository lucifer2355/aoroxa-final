function validateName() {
  var name = document.getElementById('name').value;

  if (name.length == 0) {
    producePrompt('Name is required', 'name-error', 'red');
    return false;
  }

  if (!name.match(/^[A-Za-z]*\s{1}[A-Za-z]*$/)) {
    producePrompt('First and last name, please.', 'name-error', 'red');
    return false;
  }

  producePrompt('Valid', 'name-error', 'green');
  return true;
}

function validatePhone() {
  var phone = document.getElementById('phone').value;

  if (phone.length == 0) {
    producePrompt('Phone number is required.', 'phone-error', 'red');
    return false;
  }

  if (phone.length != 10) {
    producePrompt('Include area code.', 'phone-error', 'red');
    return false;
  }

  if (!phone.match(/^[0-9]{10}$/)) {
    producePrompt('Only digits, please.', 'phone-error', 'red');
    return false;
  }

  producePrompt('Valid', 'phone-error', 'green');
  return true;
}

function validateEmail() {
  var email = document.getElementById('email').value;

  if (email.length == 0) {
    producePrompt('Email Invalid', 'email-error', 'red');
    return false;
  }

  if (!email.match(/^[A-Za-z\._\-[0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)) {
    producePrompt('Email Invalid', 'email-error', 'red');
    return false;
  }

  producePrompt('Valid', 'email-error', 'green');
  return true;
}

function validateForm() {
  if (!validateName() || !validatePhone() || !validateEmail()) {
    jsShow('submit-error');
    producePrompt('Please fix errors to submit.', 'submit-error', 'red');
    setTimeout(function() {
      jsHide('submit-error');
    }, 2000);
  } else {
  }
}

function jsShow(id) {
  document.getElementById(id).style.display = 'block';
}

function jsHide(id) {
  document.getElementById(id).style.display = 'none';
}
