function onDocumentLoad(){
    location.href = location.origin+'/?#';
    onClickLogin();
}

function onClickLogin(){
    var loginForm    = document.getElementById('loginForm');
    var signupForm   = document.getElementById('signupForm');
    var userData     = localStorage.getItem('userData');
    var fields       = loginForm.querySelectorAll('input');
    var rememberMeChkbox = loginForm.querySelector('#rememberMeChkbox');
    var username         = fields[0].value;
    var password         = fields[1].value;
    
    signupForm.style.display = "none";
    loginForm.style.display = "block";

    if(userData){
        userData = JSON.parse(userData);
        fields[0].value = userData.username;
        fields[1].value = userData.password;
        rememberMeChkbox.checked = true;
    }
}

function onClickLogOut(){
    var url = window.location.href;

    location.href = url;
}

function onClicksignupForm(){
    var signupForm = document.getElementById('signupForm');
    var loginForm = document.getElementById('loginForm');

    loginForm.style.display = "none";

    signupForm.style.display = "block";
}

function onLogin(){
    var loginForm = document.getElementById('loginForm');
    var fields = loginForm.querySelectorAll('input');
    var rememberMeChkbox = loginForm.querySelector('#rememberMeChkbox');
    var username = document.getElementById('username');
    var password = document.getElementById('password');

    if(username.value && password.value){
        hideShowLoadmask('show');
        
        fetch('/getUser?username='+username.value+'&password='+password.value)
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log('Success:', response);

            hideShowLoadmask('hide');
            if(response){
                if(response.status){
                    if(rememberMeChkbox.checked){
                        var data = {
                            username : username.value,
                            password : password.value
                        };
            
                        localStorage.setItem('userData', JSON.stringify(data));
                    }
                    else{
                        localStorage.removeItem('userData');
                    }
                    
                    console.log("User found!!");
                    loginForm.style.display = "none";
                    displayUserProfile(response.data);
                }
                else{
                    alert(response.data);
                }
            }
            else{
                alert('Unable to fetch response, Please try again');
            }
        });
    }
    else{
        alert("Enter username and password");
    }
}

function displayUserProfile(data){
    var navbarItems = document.getElementById('navbarItems');
    var loginLink   = document.getElementById("loginLink");
    var signUpLink  =  document.getElementById("signUpLink");
    var userPanel   = document.getElementById('userPanel');
    var firstName   = capitaliseFirstLetter(data.firstName);
    var lastName    = capitaliseFirstLetter(data.lastName);

    navbarItems.innerHTML = `<li id="profileLink">
            <a class="font-formatting" href="#" style="color: greenyellow;">`+firstName+`</a>
        </li>
        <li>
            <a class="font-formatting" style="color:red;" href="#" onclick="onClickLogOut()">LogOut</a>
        </li>`;

    userPanel.innerHTML = `<div>Hello, `+firstName+` `+lastName+` !!</div>`;
    userPanel.style.display = "block";
}

function capitaliseFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function onClickLogOut(){
    var url = window.location.origin;

    location.href = url;
}

function onSignUp(){
    var signupForm = document.getElementById('signupForm');
    var loginForm  = document.getElementById('loginForm');
    var fields     = signupForm.querySelectorAll('input');
    var firstName  = fields[0].value;
    var lastName   = fields[1].value;
    var email      = fields[2].value;
    var password   = fields[3].value;

    if(firstName && lastName && email && password){
        var userData = {
            "firstName" : firstName,
            "lastName"  : lastName,
            "email"     : email,
            "password"  : password
        };

        hideShowLoadmask('show');

        fetch('/saveUser',{
            method : 'post',
            headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
            body   : JSON.stringify({data : userData})
        })
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log('Success:', response);
            hideShowLoadmask('hide');

            if(response.status){
                console.log("User details saved!!");
                loginForm.style.display = "block";
                signupForm.style.display = "none";
                clearForm(loginForm);
                clearForm(signupForm);
            }
            else{
                if(response.data){
                    alert(response.data);
                }
                else{
                    alert('Unable to fetch response, Please try again');
                }
            }
        });
    }
    else{
        alert("Please enter all the details!!");
    }
}

function clearForm(form){
    var fields = form.querySelectorAll('input');

    for(var i=0;i<fields.length;i++){
        fields[i].value = "";
        fields[i].checked && (fields[i].checked=false);
    }
}

function hideShowLoadmask(type){
    var loadmask = document.getElementById('loading');

    loadmask.style.display = (type=="show") ? "block" : "none";
}