const form = document.getElementById('login');
const register = document.getElementById('register');
try {
    var data = {};
    
    form.addEventListener('submit', async(e) => {
        e.preventDefault();

        let button = document.getElementById('login_button');
        let spinner = document.getElementById('login_spinner');
        button.setAttribute('disabled', true);
        spinner.classList.toggle('d-none');
    
        let email = form.email.value;
        let password = form.password.value;
        let remember = form.remember.checked;
    
        var data = JSON.stringify({
            email,
            password,
            remember
        });

        try {
            let response = await fetch('/login', {
                method: 'POST',
                body: data,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            let result = await response.json();
            if (!result.status) {
                Swal.fire({title: "", text: result.email, icon: "error"});
            } else {
              Swal.fire({
                title: result.message,
                html: `<span style="font-size: 12px; font-weight: bolder; background-color: #FF000035; color: black; padding: 5px; margin: 5px;">
                  <i class="fa-regular fa-lightbulb"></i> Kindly check your spam folder if the email is not in your inbox and mark it as "not spam"
                </span>`,
                input: "text",
                inputAttributes: {
                  autocapitalize: "off"
                },
                showCancelButton: true,
                confirmButtonText: "Confirm",
                showLoaderOnConfirm: true,
                preConfirm: async (code) => {
                  try {
                    let otp_result = await fetch('/login', {
                        method: 'POST',
                        body: JSON.stringify({email, code, password, remember}),
                        credentials: 'include',
                        headers: {
                          'Content-Type': 'application/json'
                        }
                    });
                      const response = await otp_result.json();
                      if (!response.status) {
                        return Swal.showValidationMessage(response.message);
                      } else {
                        return response
                      }
                  } catch (error) {
                    console.log(error);
                    Swal.showValidationMessage(`Request failed: ${error.message}`);
                  }
                },
                allowOutsideClick: () => !Swal.isLoading()
                }).then(async(async_result) => {
                  if (async_result.isConfirmed) {
                    location.assign('/dashboard');   
                  }
                });
            }
        } catch (error) {
            Swal.fire({title: "", text: "Unable to reach server", icon: "error"});
        } finally {
            spinner.classList.toggle('d-none');
            button.removeAttribute('disabled');
        }
    });

    register.addEventListener('submit', async(e) => {
        e.preventDefault();

        let button = document.getElementById('register_button');
        let spinner = document.getElementById('register_spinner');
        button.setAttribute('disabled', true);
        spinner.classList.toggle('d-none');

        let email = register.email.value;
        let password = register.password.value;
        let firstname = register.firstname.value;
        let lastname = register.lastname.value;
        let mobile = register.mobile.value;
        let country = register.country.value;
        let state = register.state.value;
        let address = register.address.value;

        data = JSON.stringify({
            email,
            password,
            firstname,
            lastname,
            mobile,
            country,
            state,
            address,
        });

        try {
            const validation_response = await validateEmail(data);
            if (validation_response.status) {
                Swal.fire({
                    title: validation_response.message,
                    html: `<span style="font-size: 12px; font-weight: bolder; background-color: #FF000035; color: black; padding: 5px; margin: 5px;">
                      <i class="fa-regular fa-lightbulb"></i> Kindly check your spam folder if the email is not in your inbox and mark it as "not spam"
                    </span>`,
                    input: "text",
                    inputAttributes: {
                      autocapitalize: "off"
                    },
                    showCancelButton: true,
                    confirmButtonText: "Confirm",
                    showLoaderOnConfirm: true,
                    preConfirm: async (otp) => {
                      console.log(otp);
                      try {
                        let otp_result = await fetch('/verify-otp', {
                            method: 'POST',
                            body: JSON.stringify({email, otp}),
                            credentials: 'include',
                            headers: {
                              'Content-Type': 'application/json'
                            }
                        });
                        const response = await otp_result.json();
                        if (!response.status) {
                          return Swal.showValidationMessage(response.message);
                        } else {
                          return response
                        }
                      } catch (error) {
                        console.log(error);
                        Swal.showValidationMessage(`
                          Request failed: ${error.message}
                        `);
                      }
                    },
                    allowOutsideClick: () => !Swal.isLoading()
                  }).then(async(async_result) => {
                    if (async_result.isConfirmed) {
                        let response = await fetch('/signup', {
                            method: 'POST',
                            body: data,
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                
                        let result = await response.json();
                        if (!result.status) {
                            Swal.fire({title: "", text: result.email, icon: "error"});
                        } else {
                            location.assign('/dashboard');
                        }
                    }
                  });
            } else {
                Swal.fire({title: "", text: validation_response.message, icon: "error"});
            }
        } catch (error) {
            console.log(error);
            Swal.fire({title: "", text: "Unable to reach server", icon: "error"});
        } finally {
            spinner.classList.toggle('d-none');
            button.removeAttribute('disabled');
        }
    });
} catch (error) {
    console.log(error);
}

(function() {
  try {
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', async(e) => {
      e.preventDefault();

      let button = document.getElementById('button');
      let spinner = document.getElementById('spinner');
      button.setAttribute('disabled', true);
      spinner.classList.toggle('d-none');
  
      let email = contactForm.email.value;
      let name = contactForm.name.value;
      let message = contactForm.message.value;
  
      var data = JSON.stringify({
          email,
          name,
          message
      });

      try {
          let response = await fetch('/contact', {
              method: 'POST',
              body: data,
              credentials: 'include',
              headers: {
                  'Content-Type': 'application/json'
              }
          });
  
          let result = await response.json();
          if (!result.status) {
              Swal.fire({title: "", text: result.message, icon: "error"});
          } else {
            Swal.fire({title: "", text: result.message, icon: "success"});
            contactForm.reset();
          }
      } catch (error) {
          Swal.fire({title: "", text: "Unable to reach server", icon: "error"});
          console.log(error);
      } finally {
          spinner.classList.toggle('d-none');
          button.removeAttribute('disabled');
      }
  });
  } catch (error) {
    console.log(error);
  }
})();

function showResetPasswordDialog(event) {
    event.preventDefault();
    Swal.fire({
        title: "Type your email address",
        input: "email",
        inputAttributes: {
          autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Proceed",
        showLoaderOnConfirm: true,
        preConfirm: async (email) => {
          try {
            const response = await fetch('/reset-password-mail', {
                method: 'POST',
                body: JSON.stringify({email}),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (!result.status) {
              return Swal.showValidationMessage(result.email);
            }
            return result;
          } catch (error) {
            Swal.showValidationMessage(`Request failed: Unable to reach server`);
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: ``,
            text: result.value.message,
            icon: 'success'
          });
        }
    });
}

async function validateEmail(data) {
  let validation_response = await fetch('/validate', {
      method: 'POST',
      body: data,
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json'
      }
  });
  validation_response = await validation_response.json();
  return validation_response;
}