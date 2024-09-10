document.addEventListener('DOMContentLoaded', () => {
  const squares = document.querySelectorAll('.grid div');
  const resultDisplay = document.querySelector('#score');
  var width = 15;
  var currentShooterIndex = 202;
  var currentInvaderIndex = 0;
  var alienInvadersTakenDown = [];
  var result = 0;
  var direction = 1;
  var invaderId;

  //definerer fiendene sin start posisjon på skjermen
  const alienInvaders = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      15,16,17,18,19,20,21,22,23,24,
      30,31,32,33,34,35,36,37,38,39,
      45,46,47,48,49,50,51,52,53,54
    ];

  //viser invaderene
  alienInvaders.forEach( invader => squares[currentInvaderIndex + invader].classList.add('invader'));

  //viser spilleren
  squares[currentShooterIndex].classList.add('shooter');

  //måten man flytter på spilleren
  function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter');
    switch(e.keyCode) {
      case 37:
        if(currentShooterIndex % width !== 0) currentShooterIndex -= 1;
        break;
      case 39:
        if(currentShooterIndex % width < width - 1) currentShooterIndex += 1;
        break;
    }
    squares[currentShooterIndex].classList.add('shooter');
  }
  document.addEventListener('keydown', moveShooter);

  //flytter på fiendene
  function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

      if((leftEdge && direction === -1) || (rightEdge && direction === 1)){
        direction = width;
      } else if (direction === width) {
      if (leftEdge) direction = 1;
      else direction = -1;
      }
      for (let i = 0; i <= alienInvaders.length - 1; i++) {
        squares[alienInvaders[i]].classList.remove('invader');
      }
      for (let i = 0; i <= alienInvaders.length - 1; i++) {
        alienInvaders[i] += direction;
      }
      for (let i = 0; i <= alienInvaders.length - 1; i++) {
        if (!alienInvadersTakenDown.includes(i)){
          squares[alienInvaders[i]].classList.add('invader');
        }
      }
    //conditions for å tape
    if(squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
      resultDisplay.textContent = 'Du tapte';
      squares[currentShooterIndex].classList.add('boom');
      clearInterval(invaderId);
    }

    for (let i = 0; i <= alienInvaders.length - 1; i++){
      if(alienInvaders[i] > (squares.length - (width -1))){
        resultDisplay.textContent = 'Du tapte';
        clearInterval(invaderId);
      }
    }
    //condition for å vinne
    if(alienInvadersTakenDown.length === alienInvaders.length) {
      console.log(alienInvadersTakenDown.length);
      console.log(alienInvaders.length);
      resultDisplay.textContent = 'VINNER';
      clearInterval(invaderId);
    }
  }
  invaderId = setInterval(moveInvaders, 250);

  //funksjon for skyting
  function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;
    //flytter laseren bort fra spilleren
    function moveLaser() {
      squares[currentLaserIndex].classList.remove('laser');
      currentLaserIndex -= width;
      squares[currentLaserIndex].classList.add('laser');
      if(squares[currentLaserIndex].classList.contains('invader')) {
        squares[currentLaserIndex].classList.remove('laser');
        squares[currentLaserIndex].classList.remove('invader');
        squares[currentLaserIndex].classList.add('boom');

        setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250);
        clearInterval(laserId);

        const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
        alienInvadersTakenDown.push(alienTakenDown);
        result++;
        resultDisplay.textContent = result;
      }

      if(currentLaserIndex < width) {
        clearInterval(laserId);
        setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100);
      }
    }

    //bestemmer hastighet til laseren
    switch(e.keyCode) {
      case 32:
        laserId = setInterval(moveLaser, 20);
        break;
    }
  }

  //eventlistener for skyting
  document.addEventListener('keydown', shoot);
})
