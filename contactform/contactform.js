jQuery(document).ready(function($) {
  "use strict";

  // Contact Form Validation and Submission
  $('form.contactForm').submit(function(event) {
    event.preventDefault(); // Prevent default form submission

    var f = $(this).find('.form-group'),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function() { // run all inputs
      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case 'checked':
            if (!i.is(':checked')) {
              ferror = ierror = true;
            }
            break;

          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });

    f.children('textarea').each(function() { // run all textareas
      var i = $(this); // current textarea
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false;
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });

    // If there are errors, prevent submission
    if (ferror) return false;

    // No errors, proceed with form submission
    var form = this;
    var formData = new FormData(form); // Use FormData for submission

    fetch('https://formspree.io/f/xvgpjnjq', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(function(response) {
      if (response.ok) {
        $("#sendmessage").addClass("show");
        $("#errormessage").removeClass("show");
        $(form).find("input, textarea").val(""); // Clear the form
      } else {
        return response.json().then(function(data) {
          if (data.errors) {
            $('#errormessage').html(data.errors.map(error => error.message).join(", "));
            $("#errormessage").addClass("show");
            $("#sendmessage").removeClass("show");
          } else {
            $("#errormessage").html("Oops! There was a problem submitting your form.");
            $("#errormessage").addClass("show");
            $("#sendmessage").removeClass("show");
          }
        });
      }
    }).catch(function(error) {
      $("#errormessage").html("Oops! There was a problem submitting your form.");
      $("#errormessage").addClass("show");
      $("#sendmessage").removeClass("show");
    });

    return false; // Prevent default form submission
  });
});
