document.addEventListener('DOMContentLoaded', function(){
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const addtaskForm = document.getElementById('addtaskForm');
    const taskslist = document.getElementById('taskslist');
    const taskAssignedto = document.getElementById('taskAssignedto');


let map;
let latitude;
let longitude;

function initMap(){
    const mapOptions = {
        center: new google.maps.LatLng(44.4268, 26.1025),
        zoom:6
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    google.maps.event.addListener(map, 'click', function(event){
        latitude=event.LatLng.lat();
        longitude=event.LatLng.lng();
        document.getElementById('register-address').value = 'lat: ${latitude}, Lng: ${logitude}';

    });
}

initMap();

loginForm/addEventListener('submit', async function(e){
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pass').value;

    const response = await this.fetch('/api/login', {
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})

    });
    const data = await response.json();
    if(response.ok){
        this.alert('Login Successfully!');
        document.getElementById('login').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadTasks();
        losdUsers();

    } else {
        alert(data.message);
    }

});

registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const mobile = document.getElementById('register-mobile').value;
    const password = document.getElementById('register-password').value;
    const address = document.getElementById('register-address').value;

    const response = await fetch('/api/register', {
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, password, address, latitude, longitude})

    });
    const data = await response.json();
    if(response.ok) {
        alert('Registration successful!');
    } else {
        alert('Registration failed. ');
    }

});

addtaskForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const dateTime = document.getElementById('task-date-time').value;
    const assignedTo = document.getElementById('task-assigned-to').value;

    const response = await fetch('/api/add-task', {
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({taskName, dateTime, assignedTo})

});
const data = await response.json();
if(response.ok) {
    alert('Task added successfully!');
    loadTasks();
} else {
    alert('failed to add task. ');
}
});

async function loadTasks() {
    const response = await fetch('/api/tasks');
    const tasks=await response.json();
    tasksList.innerHTML='';
    tasks.forEach(task=>{
        const li=document.createElement('li');
        li.textContent=`${task.name}-${task.dateTime}-assigned to:${task.assignedTo}`;
        tasksList.appendChild(li);
    });
}

async function loadUsers()
{
    const response = await fetch('/api/users');
    const tasks=await response.json();
    users.forEach(user=>{
        const option=document.createElement('option');
        option.value=user.id;
        option.textContent=user.name;
        taskAssignedto.appendChild(option);
    });
}
});