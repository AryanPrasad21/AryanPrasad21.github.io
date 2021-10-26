const grid = document.querySelector('.grid')
const resultDisplay = document.querySelector('.results')
let currentShooterIndex = 202
let width = 15
let direction = 1
let invadersId 
let goingRight = true
let aliensRemoved = []
let results = 0

for (let i=0;i<225;i++) {
  const square = document.createElement('div')
  grid.appendChild(square)                          //Creating separate boxes for the invaders and shooters
}

const squares = Array.from(document.querySelectorAll('.grid div'))


const alienInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
]

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    
      if(!aliensRemoved.includes(i) && alienInvaders[i] < (squares.length)-15) {                        //If the invaders have been shot then do not draw them again
      squares[alienInvaders[i]].classList.add('invader')
      }
  }
}

draw()

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    
      if(alienInvaders.length != aliensRemoved.length && alienInvaders[i] < (squares.length)-15)
      squares[alienInvaders[i]].classList.remove('invader')
    
  }
}


squares[currentShooterIndex].classList.add('shooter')

function moveShooter(e) {
  squares[currentShooterIndex].classList.remove('shooter')
  //console.log("currentShooterIndex % width (initial) = " + (currentShooterIndex % width) )
  switch(e.key) {
    case 'ArrowLeft' :
      if (currentShooterIndex % width !== 0) currentShooterIndex -=1 
      //console.log("CurrentShooterIndex (going left) = " +currentShooterIndex )
      //console.log("currentShooterIndex % width (going left) = " + (currentShooterIndex % width) )
      break
    case 'ArrowRight' :
      if(currentShooterIndex % width < width-1) currentShooterIndex +=1
      //console.log("CurrentShooterIndex (going right) = " +currentShooterIndex )
      //console.log("currentShooterIndex % width (going right) = " + (currentShooterIndex % width) )
      break

  }

  squares[currentShooterIndex].classList.add('shooter')

}



//document.addEventListener('keydown',moveShooter)
/*
window.onload = function() {
console.log(document.getElementById("Play_button").innerHTML)
}
*/

document.getElementById("Play_button").addEventListener('click',function() {        //After clicking play button

document.addEventListener('keydown',moveShooter)

})





function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
  remove()

  //If all invaders are to the right and still going right (go down)
  if(rightEdge && goingRight) {
    for(let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width  + 1
      direction = -1
      goingRight = false
    }
  }

  //If all invaders are to the left and still going left (go down)
  if(leftEdge && !goingRight) {
    for(let i = 0; i< alienInvaders.length; i++) {
      alienInvaders[i] += width - 1
      direction = 1
      goingRight = true
    }
  }




  //moving the invaders one by one
  for(let i = 0;i < alienInvaders.length; i++) {
    alienInvaders[i] += direction
  }
  draw()

  //If the invaders hit the shooter
  if(squares[currentShooterIndex].classList.contains('invader','shooter'))
  {
    resultDisplay.innerHTML = 'Game Over !'
    clearInterval(invadersId)
    document.removeEventListener('keydown',moveShooter)
  }

  //If the invaders hit the bottom of the grid (not necessary)
 
  for(let i = 0; i <alienInvaders.length; i++) {
    //console.log("alienInvaders[i] = ",alienInvaders[i]," and squares.length = ",squares.length)
    if(alienInvaders[i] > (squares.length)-15) {
      resultDisplay.innerHTML = 'Game Over !'
      clearInterval(invadersId)
      document.removeEventListener('keydown',moveShooter)
    }
  }
  if(aliensRemoved.length === alienInvaders.length) {
    resultDisplay.innerHTML = 'You Win !'
    clearInterval(invadersId)
  }

}



//invadersId = setInterval(moveInvaders, 500)


//function to shoot the laser
function shoot(e) {
  
  let laserId
  let currentLaserIndex = currentShooterIndex       //laser starts coming from the shooter

  function moveLaser() {
    if(squares[currentLaserIndex]) {                                //If the square grid (div) has the current laser index assigned
    squares[currentLaserIndex].classList.remove('laser')
    }

    currentLaserIndex -= width

    if(squares[currentLaserIndex]){
    squares[currentLaserIndex].classList.add('laser')
    }

    if(squares[currentLaserIndex]) {
    if(squares[currentLaserIndex].classList.contains('invader')) {

      squares[currentLaserIndex].classList.remove('laser')
      squares[currentLaserIndex].classList.remove('invader')
      squares[currentLaserIndex].classList.add('boom')

      setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'),100)      //time interval when the invader has been shot by the laser 
      clearInterval(laserId)        //clearout the laser after it hits the invader

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex)  //getting the index (div) of the collision of invader and laser

      aliensRemoved.push(alienRemoved)      //storing the aliens that had been shot in an array
      results++
      resultDisplay.innerHTML = "Score : "+results
      //console.log(aliensRemoved)
    }

  }
}
  if(resultDisplay.innerHTML !== 'Game Over !') {         //Can't shoot the invaders after the game is over
  switch(e.key) {
    case 'ArrowUp' : 
      laserId = setInterval(moveLaser,100)
  }
}

}


document.getElementById("Play_button").addEventListener('click',function() {

  invadersId = setInterval(moveInvaders, 500)
  document.addEventListener('keydown',shoot)
  
  })

