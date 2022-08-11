'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: "Joao Sobrenomes",
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    pin: 1111,
  
    movementsDates: [
      "2019-11-18T21:31:17.178Z",
      "2019-12-23T07:42:02.383Z",
      "2020-01-28T09:15:04.904Z",
      "2020-04-01T10:17:24.185Z",
      "2020-05-08T14:11:59.604Z",
      "2020-07-26T17:01:17.194Z",
      "2020-07-28T23:36:17.929Z",
      "2020-08-01T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "pt-PT", 
};
  
  const account2 = {
    owner: "Jessica Davis",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    pin: 2222,
  
    movementsDates: [
      "2019-11-01T13:15:33.035Z",
      "2019-11-30T09:48:16.867Z",
      "2019-12-25T06:04:23.907Z",
      "2020-01-25T14:18:46.235Z",
      "2020-02-05T16:33:06.386Z",
      "2020-04-10T14:43:26.374Z",
      "2020-06-25T18:49:59.371Z",
      "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};

const account3 = {
  owner: 'Anurag Kashyap',
  movements: [2000, -200, 3400, -300, -20, 50, 400, -460],
  pin: 3333,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2021-01-28T09:15:04.904Z",
    "2021-04-01T10:17:24.185Z",
    "2022-02-05T16:33:06.386Z",
    "2022-04-10T14:43:26.374Z",
    "2022-06-25T18:49:59.371Z",
    "2022-08-02T12:01:20.894Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const account4 = {
  owner: 'Abdullah Al Salem',
  movements: [430, 1000, 700, 50, -90, 1000, -100, 40000],
  pin: 4444,
  movementsDates: [
    "2018-11-18T21:31:17.178Z",
    "2018-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2021-02-05T16:33:06.386Z",
    "2021-04-10T14:43:26.374Z",
    "2022-06-25T18:49:59.371Z",
    "2022-08-11T12:01:20.894Z",
  ],
  currency: "QAR",
  locale: "en-QA",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.current-balance-value');
const labelSumIn = document.querySelector('.in-amount-2');
const labelSumOut = document.querySelector('.out-amount-2');
const labelTimer = document.querySelector('.logout-timer');
const labelLoginMessage = document.querySelector(`.login-message`);
const labelTransferMessage = document.querySelector(`.transfer-message`);
const labelLoanMessage = document.querySelector(`.loan-message`);
const labelCloseMessage = document.querySelector(`.close-message`);

////////////////////////////////////////////////////////////////////////////////////////////

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

////////////////////////////////////////////////////////////////////////////////////////////

const btnLogin = document.querySelector('.right-enter-key');
const btnTransfer = document.querySelector('.btn-transfer');
const btnLoan = document.querySelector('.btn-loan');
const btnClose = document.querySelector('.btn-close');
const btnSort = document.querySelector('.btn--sort');
const btnLogOut = document.querySelector(`.btn-logout`);

////////////////////////////////////////////////////////////////////////////////////////////

const inputLoginUsername = document.querySelector('.login-user-2');
const inputLoginPin = document.querySelector('.login-password-2');
const inputTransferTo = document.querySelector('.transfer-input-2');
const inputTransferAmount = document.querySelector('.amount-input-2');
const inputLoanAmount = document.querySelector(`.loan-input-2`);
const inputCloseUsername = document.querySelector('.close-input-2');
const inputClosePin = document.querySelector('.close-password-input-2');

////////////////////////////////////////////////////////////////////////////////////////////

const popMessage = function() {
    labelLoginMessage.style.opacity = `0`;
    labelLoginMessage.style.zIndex = -1;
    labelTransferMessage.style.opacity = `0`;
    labelTransferMessage.style.zIndex = -1;
    labelLoanMessage.style.opacity = `0`;
    labelLoanMessage.style.zIndex = -1;
    labelCloseMessage.style.opacity = `0`;
    labelCloseMessage.style.zIndex = -1;
}

const startLogoutTimer = function() {
    const tick = function() {
      const min = `${Math.trunc(time/60)}`.padStart(2,0);
      const sec = `${time%60}`.padStart(2,0);
      labelTimer.textContent = `${min}:${sec}`;
      if(time === 0) {
        clearInterval(timer);
        containerApp.style.opacity = 0;
        containerApp.style.zIndex = -1;
        btnLogin.disabled = false;
        labelWelcome.textContent = `Login to get started`
      }
      time--;
    }
    let time = 300;
    const timer = setInterval(tick,1000);
    return timer;
};

const formatMovementDate = function(date, locale) {
    const calcDaysPassed =  (date1, date2) =>  Math.round(Math.abs((date1 - date2)/(1000 * 60 * 60 * 24)));
    const daysPassed = calcDaysPassed(new Date(), date);
 

    if(daysPassed === 0) return `Today`;
    if(daysPassed === 1) return `Yesterday`;
    if(daysPassed <=7) return `${daysPassed} days ago`;

    return new Intl.DateTimeFormat(locale).format(date);
}

const formatAmount = function(amount, locale, currency) {
    return new Intl.NumberFormat(locale,{
        style: `currency`,
        currency: currency
    }).format(amount);
}

const displayMovements = function(acc, sort = false) {
    const movs = sort ? acc.movements.slice().sort( (a,b) => a-b): acc.movements;
    containerMovements.innerHTML = ``;
    movs.forEach( function(mov,i) {
        const type = mov>0 ? `deposit`:`withdrawal`;
        const date = new Date(acc.movementsDates[i]);
        const displayDate = formatMovementDate(date,acc.locale);
        const html = `
        <div class="movement-row">
            <div class="movement-type movement-type-${type}">
                ${i+1} ${type}
            </div>
            <div class="movement-time">
                ${displayDate}
            </div>
            <div class="movement-value">
                ${formatAmount(mov,acc.locale,acc.currency)}
            </div>
        </div>
    `;
    containerMovements.insertAdjacentHTML(`afterbegin`,html);
    });
 
};

const bal = account1.movements.reduce( (acc,mov) => acc+mov,0);
console.log(bal);
const displayBalance = function(acc) {
    acc.balance = acc.movements.reduce( (acc, mov) => acc + mov,0);
    labelBalance.textContent = `${formatAmount(acc.balance,acc.locale,acc.currency)}`;
}

displayBalance(account1);

const displaySummary = function(acc) {
    const income = acc.movements
        .filter( mov => mov>0)
        .reduce( (acc,mov) => acc+mov,0);
    labelSumIn.textContent = `${formatAmount(income,acc.locale,acc.currency)}`;

    const out = acc.movements
        .filter( mov => mov<0)
        .reduce( (acc,mov) => acc+mov,0);
    labelSumOut.textContent = `${formatAmount(Math.abs(out),acc.locale,acc.currency)}`;

};

displaySummary(account1);

const createUserName = function(accs) {
    accs.forEach( function(acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(` `)
            .map( name => name[0])
            .join(``);
    });
}

createUserName(accounts);

const updateUI = function(acc) {
    displayMovements(acc);
    displaySummary(acc);
    displayBalance(acc);
}

let currentAccount = 0, timer;
const now = new Date();
const date = `${now.getDate()}`.padStart(2,0);
const month = `${now.getMonth()+1}`.padStart(2,0);
const year = `${now.getFullYear()}`;


btnLogin.addEventListener(`click`,function(e) {
    e.preventDefault();
    currentAccount = accounts.find( acc => acc.username === inputLoginUsername.value);
    
    console.log(currentAccount);
    if(currentAccount?.pin === +(inputLoginPin.value)) {
        console.log(currentAccount);
        btnLogin.disabled = true;
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(` `)[0]}`;
        const options = {
            hour: `numeric`,
            minute: `numeric`,
            day: `numeric`,
            month: `numeric`,
            year: `numeric`,
        }
        labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale,options).format(now);
        updateUI(currentAccount);
        containerApp.style.opacity = 100;
        containerApp.style.zIndex = 0;
        timer = startLogoutTimer();
        popMessage();
        
    } else {
        popMessage();
        labelLoginMessage.style.opacity = 100;
        labelLoginMessage.style.zIndex = 0;
    }
    inputLoginUsername.value = inputLoginPin.value = ``;
});

btnTransfer.addEventListener(`click`, function(e) {
    e.preventDefault();
    const amount = +(inputTransferAmount.value);
    const receiverAcc = accounts.find( acc => acc.username === inputTransferTo.value);
    console.log(receiverAcc);
    inputTransferAmount.value = inputTransferTo.value = ``;
    if( receiverAcc && amount> 0 && currentAccount.balance> amount && receiverAcc?.usename !== currentAccount.username) {
        currentAccount.movements.push(-amount);
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcc.movements.push(amount);
        receiverAcc.movementsDates.push(new Date().toISOString());
        console.log(currentAccount.movements);
        console.log(receiverAcc.movements);
        updateUI(currentAccount);
        popMessage();
    } else {
        popMessage();
        labelTransferMessage.style.opacity = 100;
        labelTransferMessage.style.zIndex = 0;
    }
    clearInterval(timer);
    timer = startLogoutTimer();
});

btnLoan.addEventListener(`click`, function(e) {
    e.preventDefault();
    const amount = Math.round(inputLoanAmount.value);
    if(amount>0 && currentAccount.movements.some( mov => mov >= amount*0.1)) {
        popMessage();
        setTimeout( function() {
            currentAccount.movements.push(amount);
            currentAccount.movementsDates.push(new Date().toISOString());
            console.log(currentAccount.movementsDates);
            console.log((new Date).toISOString());
            updateUI(currentAccount);
        },6000);
    } else {
        popMessage();
        labelLoanMessage.style.opacity = 100;
        labelLoanMessage.style.zIndex = 0;
        
    }
    inputLoanAmount.value = ``;
    clearInterval(timer);
    timer = startLogoutTimer();
})

btnClose.addEventListener(`click`, function(e) {
    e.preventDefault();
    if(inputCloseUsername.value === currentAccount.username && +(inputClosePin.value) === (currentAccount.pin)) {
        popMessage();
        const index = accounts.findIndex( acc => acc.username === inputCloseUsername.value);
        accounts.splice(index,1);
        containerApp.style.opacity = 0;
        containerApp.style.zIndex = -1;
        labelWelcome.textContent = `Login to get started`;
    } else {
        popMessage();
        labelCloseMessage.style.opacity = 100;
        labelCloseMessage.style.zIndex = 0;
    }
    inputClosePin.value = inputCloseUsername.value = ``;
});

let sorted = false;
btnSort.addEventListener(`click`, function() {
    displayMovements(currentAccount,!sorted);
    sorted = !sorted;
})

btnLogOut.addEventListener(`click`, function() {
    containerApp.style.opacity = `0`;
    containerApp.style.zIndex = `-10`;
    btnLogin.disabled = false;
    clearTimeout(timer);
    labelTimer.textContent = `05:00`;
    labelWelcome.textContent = `Login to get started`;
})


/////////////////////////////////////////////////
