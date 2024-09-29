jQuery(document).ready(function($) {
  "use strict";

  // Newsletter Form Validation and Submission
  $('form.newsletterForm').submit(function(event) {
    event.preventDefault(); // Prevent default form submission

    var f = $(this).find('.form-group-newsletter'),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function() {
      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false;
        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html(ierror ? i.attr('data-msg') : '').show('blind');
      }
    });

    // If there are errors, prevent submission
    if (ferror) return false;

    // No errors, proceed with form submission
    var form = this;
    var formData = new FormData(form);

    fetch('https://formspree.io/f/mkgwdzkn', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(function(response) {
      if (response.ok) {
        $("#successmessage").show();
        $("#failuremessage").hide();
        $(form).find("input").val("");
      } else {
        return response.json().then(function(data) {
          if (data.errors) {
            $('#failuremessage').html(data.errors.map(error => error.message).join(", "));
            $("#failuremessage").show();
            $("#successmessage").hide();
          } else {
            $("#failuremessage").html("Oops! There was a problem submitting your form.");
            $("#failuremessage").show();
            $("#successmessage").hide();
          }
        });
      }
    }).catch(function(error) {
      $("#failuremessage").html("Oops! There was a problem submitting your form.");
      $("#failuremessage").show();
      $("#successmessage").hide();
    });

    return false; // Prevent default form submission
  });
});
