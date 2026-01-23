const formDOM = document.querySelector('.form');
const usernameInputDOM = document.querySelector('.username-input');
const passwordInputDOM = document.querySelector('.password-input');
const formAlertDOM = document.querySelector('.form-alert');
const resultDOM = document.querySelector('.result');
const btnDOM = document.querySelector('#data');
const logoutBtnDOM = document.querySelector('#logout');
const tokenDOM = document.querySelector('.token');
const containerDOM = document.querySelector('.container');
const welcomeDOM = document.querySelector('.welcome-message');

formDOM.addEventListener('submit', async (event) => {
  formAlertDOM.classList.remove('text-success');
  tokenDOM.classList.remove('text-success');

  event.preventDefault();
  const username = usernameInputDOM.value;
  const password = passwordInputDOM.value;

  try {
    const { data } = await axios.post('/api/v1/logon', { username, password });
    
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = data.msg;

    formAlertDOM.classList.add('text-success');
    usernameInputDOM.value = '';
    passwordInputDOM.value = '';

    localStorage.setItem('token', data.token);
    resultDOM.innerHTML = '';
    tokenDOM.textContent = 'token present';
    tokenDOM.classList.add('text-success');
    welcomeDOM.textContent = `Welcome, ${data.username}`;

    containerDOM.classList.remove('hidden'); // SHOW container
    
  } catch (error) {
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = error.response.data.msg;
    localStorage.removeItem('token');
    resultDOM.innerHTML = '';
    tokenDOM.textContent = 'no token present';
    tokenDOM.classList.remove('text-success');

    containerDOM.classList.add('hidden'); // HIDE container
    
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none';
  }, 2000);
});

btnDOM.addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  try {
    const { data } = await axios.get('/api/v1/hello', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    resultDOM.innerHTML = `<h5>${data.msg}</h5><p>${data.secret}</p>`;
    data.secret;
    console.log(data);

  } catch (error) {
    localStorage.removeItem('token');
    resultDOM.innerHTML = `<p>${error.response.data.msg}</p>`;
  }

});

logoutBtnDOM.addEventListener('click', () => {
  // 1. Remove token
  localStorage.removeItem('token');

  // 2. Reset UI
  containerDOM.classList.add('hidden');
  resultDOM.innerHTML = '';
  tokenDOM.textContent = 'no token present';
  tokenDOM.classList.remove('text-success');

  // 3. Optional UX nicety
  formAlertDOM.textContent = 'Logged out';
  formAlertDOM.classList.add('text-success');
  formAlertDOM.style.display = 'block';

  setTimeout(() => {
    formAlertDOM.style.display = 'none';
  }, 1500);
});

const checkToken = () => {
  tokenDOM.classList.remove('text-success');

  const token = localStorage.getItem('token');
  if (token) {
    tokenDOM.textContent = 'token present';
    tokenDOM.classList.add('text-success');
    containerDOM.classList.remove('hidden');
  } else {
    tokenDOM.textContent = 'no token present';
    containerDOM.classList.add('hidden');
  }
};

checkToken();