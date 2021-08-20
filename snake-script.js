


function randomInt(min, max) {
  return Math.round(min - 0.5 + Math.random() * (max + 1 - min));
}

function startSnake () {
  
  let [pos, pos_start] = [randomInt(0, 29), randomInt(0, 28)];
  let flag = !!randomInt(0, 1);

  if (randomInt(0, 1)) {
    for (let i = pos_start; i < pos_start + 2; i++) {
      table.rows[pos].cells[i].classList.add('snake-body');  
    };
    if (flag) {
      table.rows[pos].cells[pos_start + 1].id = 'snake-eyes';
      table.rows[pos].cells[pos_start].id = 'snake-ass';
      vector.add('right');
      vector.add(pos, pos_start + 1, 'right');
    } else {
      table.rows[pos].cells[pos_start].id = 'snake-eyes';
      table.rows[pos].cells[pos_start + 1].id = 'snake-ass';
      vector.add('left');
      vector.add(pos, pos_start, 'left');
    }
  } else {
    for (let i = pos_start; i < pos_start + 2; i++) {
      table.rows[i].cells[pos].classList.add('snake-body');  
    };
    if (flag) {
      table.rows[pos_start + 1].cells[pos].id = 'snake-eyes';
      table.rows[pos_start].cells[pos].id = 'snake-ass';
      vector.add('down');
      vector.add(pos_start + 1, pos, 'down');
    } else {
      table.rows[pos_start].cells[pos].id = 'snake-eyes';
      table.rows[pos_start + 1].cells[pos].id = 'snake-ass';
      vector.add('up');
      vector.add(pos_start, pos, 'up');
    }
  };
};

function postTrap () {

  let coll_snakeFood = table.getElementsByClassName('snake-food');
  let coll_snakeBody = table.getElementsByClassName('snake-body');
  let coll_snakeTrap = table.getElementsByClassName('snake-trap');
    
    do {

      let [row, cell] = [randomInt(0, 29), randomInt(0, 29)];

      if (Array.from(coll_snakeFood).concat(Array.from(coll_snakeBody), Array.from(coll_snakeTrap)).length >= 900) break;
      if (table.rows[row].cells[cell].classList.contains('snake-trap') || table.rows[row].cells[cell].classList.contains('snake-body') || table.rows[row].cells[cell].classList.contains('snake-food')) continue;

      table.rows[row].cells[cell].classList.add('snake-trap');
      break;
      
    } while (true);

};

function postFood () {

  let coll_snakeFood = table.getElementsByClassName('snake-food');
  let coll_snakeBody = table.getElementsByClassName('snake-body');
  let coll_snakeTrap = table.getElementsByClassName('snake-trap');
    
    do {

      let [row, cell] = [randomInt(0, 29), randomInt(0, 29)];

      if (Array.from(coll_snakeFood).concat(Array.from(coll_snakeBody), Array.from(coll_snakeTrap)).length >= 900) break;
      if (table.rows[row].cells[cell].classList.contains('snake-trap') || table.rows[row].cells[cell].classList.contains('snake-body') || table.rows[row].cells[cell].classList.contains('snake-food')) continue;

      table.rows[row].cells[cell].classList.add('snake-food');
      break;
      
    } while (true);

};


function snakeMove () {
  nextFood = false;
  let firstElement = document.querySelector('#snake-eyes');
  let lastElement = document.querySelector('#snake-ass');
  
    
  if (vector.first == 'left') vectorMethods.left(firstElement, false);
  else if (vector.first == 'right') vectorMethods.right(firstElement, false);
  else if (vector.first == 'up') vectorMethods.up(firstElement, false);
  else vectorMethods.down(firstElement, false);

  if (mainContinue) {
    if (vector.last[0].curs == 'left') vectorMethods.left(lastElement, true);
    else if (vector.last[0].curs == 'right') vectorMethods.right(lastElement, true);
    else if (vector.last[0].curs == 'up') vectorMethods.up(lastElement, true);
    else if (vector.last[0].curs == 'down') vectorMethods.down(lastElement, true);

    counter += document.querySelectorAll('.snake-body').length != counter + 1 ? 1 : 0;
  }

  window['score-now'].innerHTML = document.querySelectorAll('.snake-body').length - 2;
}

function game (speed, isTrap) {
  window['for-menu'].hidden = true;
  startSnake();
  snakeMove()
  postFood();

  move = setInterval(() => {
    snakeMove();
  }, speed);
  postF = setInterval(() => {
    postFood();
  }, 2000);
  if (isTrap) postT = setInterval(() => {
    postTrap();
  }, 10000);
}

function endGame () {
  useMouse = false;
  clearInterval(move);
  clearInterval(postF);
  clearInterval(postT);
  scoreInfo.latest = document.querySelectorAll('.snake-body').length - 2;
  window['score-latest'].innerHTML = scoreInfo.latest;
  window['score-best'].innerHTML = scoreInfo.best;
  wrapper.style.background = 'hsla(0, 0%, 0%, 0.35)';
  window['for-help_menu'].style.display = 'flex';
  window['help_menu-score-latest'].innerHTML = `<strong>${scoreInfo.latest}</strong>`;
  window['help_menu-score-best'].innerHTML = `<strong>${scoreInfo.best}</strong>`;
  mainContinue = false;
  counter = 0;
  nextFood = true;
  vector.first = null;
  vector.last = [];
  let coll_helpMove = document.querySelectorAll('.help_move-block');
  for (let element of coll_helpMove) {
    element.style.background = 'rgba(255, 255, 255, 0)';
  };
};


let vectorMethods = {

  left(element, isLast) {

    let nextElement = table.rows[element.parentElement.rowIndex];
    nextElement = element.cellIndex > 0 ? nextElement.cells[element.cellIndex - 1] : nextElement.cells[29];


    if (isLast) {
      if (!nextFood && vector.last.length > 1 && nextElement.cellIndex == vector.last[1].cell) {
        vector.last.shift();
      }
      if (!nextFood) {
        element.classList.remove('snake-body');
        nextElement.id = 'snake-ass'; 
        element.id = '';
      }
    } else {
      if (nextElement.classList.contains('snake-trap') || (nextElement.classList.contains('snake-body') && (!nextElement.id || nextElement.id && vector.first != vector.last[0].curs))) {
        endGame();
      } else {
        if (nextElement.classList.contains('snake-food')) {
          nextFood = true;
          counter++;
        }
        nextElement.classList.add('snake-body');
        nextElement.classList.remove('snake-food');
        if (!nextElement.id) {
          nextElement.id = element.id; 
          element.id = '';
        }
      }
    }
  }, 
  
  right(element, isLast) {

    let nextElement = table.rows[element.parentElement.rowIndex];
    nextElement = element.cellIndex == 29 ? nextElement.cells[0] : nextElement.cells[element.cellIndex + 1];

  
    

    if (isLast) {
      if (!nextFood && vector.last.length > 1 && nextElement.cellIndex == vector.last[1].cell) {
        vector.last.shift();
      }
      if (!nextFood) {
        element.classList.remove('snake-body');
        nextElement.id = 'snake-ass';
        element.id = '';
      }
    } else {
      if (nextElement.classList.contains('snake-trap') || (nextElement.classList.contains('snake-body') && (!nextElement.id || nextElement.id && vector.first != vector.last[0].curs))) {
        endGame();
      } else {
        if (nextElement.classList.contains('snake-food')) {
          nextFood = true;
          counter++;
        }
        nextElement.classList.add('snake-body');
        nextElement.classList.remove('snake-food');
        if (!nextElement.id) {
          nextElement.id = element.id; 
          element.id = '';
        }
      }
    }
  },

  up(element, isLast) {

    let nextElement = element.parentElement.rowIndex > 0 ? table.rows[element.parentElement.rowIndex - 1].cells[element.cellIndex] : table.rows[29].cells[element.cellIndex];

    
    

    if (isLast) {
      if (!nextFood && vector.last.length > 1 && nextElement.parentElement.rowIndex == vector.last[1].row) {
        vector.last.shift();
      }
      if (!nextFood) {
        element.classList.remove('snake-body');
        nextElement.id = 'snake-ass';
        element.id = '';
      }
    } else {
      if (nextElement.classList.contains('snake-trap') || (nextElement.classList.contains('snake-body') && (!nextElement.id || nextElement.id && vector.first != vector.last[0].curs))) {
        endGame();
      } else {
        if (nextElement.classList.contains('snake-food')) {
          nextFood = true;
          counter++;
        }
        nextElement.classList.add('snake-body');
        nextElement.classList.remove('snake-food');
        if (!nextElement.id) {
          nextElement.id = element.id; 
          element.id = '';
        }
      }
    }

  },

  down(element, isLast) {

    let nextElement = element.parentElement.rowIndex == 29 ? table.rows[0].cells[element.cellIndex] : table.rows[element.parentElement.rowIndex + 1].cells[element.cellIndex];

     
    
    

    if (isLast) {
      if (!nextFood && vector.last.length > 1 && nextElement.parentElement.rowIndex == vector.last[1].row) {
        vector.last.shift();
      }
      if (!nextFood) {
        element.classList.remove('snake-body');
        nextElement.id = 'snake-ass';
        element.id = '';
      }
      
    } else {
      if (nextElement.classList.contains('snake-trap') || (nextElement.classList.contains('snake-body') && (!nextElement.id || nextElement.id && vector.first != vector.last[0].curs))) {
        endGame();
      } else {
        if (nextElement.classList.contains('snake-food')) {
          nextFood = true;
          counter++;
        }
        nextElement.classList.add('snake-body');
        nextElement.classList.remove('snake-food');
        if (!nextElement.id) {
          nextElement.id = element.id; 
          element.id = '';
        }
      }
    }
  }
};

let vector = {

  first: null,

  last: [],


  add(...args) {
    if (args.length > 1) {
      this.last.push({
        row: args[0],
        cell: args[1],
        curs: args[2]
      })
    } else {
      this.first = args[0];
    }
  },

  delete() {
    this.last.shift();
  }

};

function getMove (event) {
  let mass = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
  
  if ((event.key == mass[0] || event.keyCode == 65 || event.target.id == 'left-animate') && !['left', 'right'].includes(vector.last[vector.last.length - 1].curs) && counter) {
    vector.add('left');
    vector.add(document.querySelector('#snake-eyes').parentElement.rowIndex, document.querySelector('#snake-eyes').cellIndex - counter, 'left');
    counter = 0;
  } else if ((event.key == mass[1] || event.keyCode == 68 || event.target.id == 'right-animate') && !['left', 'right'].includes(vector.last[vector.last.length - 1].curs) && counter) {
    vector.add('right');
    vector.add(document.querySelector('#snake-eyes').parentElement.rowIndex, document.querySelector('#snake-eyes').cellIndex + counter, 'right');
    counter = 0;
  } else if ((event.key == mass[2] || event.keyCode == 87 || event.target.id == 'up-animate') && !['up', 'down'].includes(vector.last[vector.last.length - 1].curs) && counter) {
    vector.add('up');
    vector.add(document.querySelector('#snake-eyes').parentElement.rowIndex - counter, document.querySelector('#snake-eyes').cellIndex, 'up');
    counter = 0;
  } else if ((event.key == mass[3] || event.keyCode == 83 || event.target.id == 'down-animate') && !['up', 'down'].includes(vector.last[vector.last.length - 1].curs) && counter) {
    vector.add('down');
    vector.add(document.querySelector('#snake-eyes').parentElement.rowIndex + counter, document.querySelector('#snake-eyes').cellIndex, 'down');
    counter = 0;
  }
};

document.addEventListener('keydown', getMove);

start.onmousedown = function () {
  this.style.background = 'black';
  this.style.color = 'white';
}

start.onmouseover = function() {
  this.style.background = 'rgb(54, 54, 54)';
  this.style.color = 'white';
}

start.onmouseout = function() {
  this.style.background = 'white';
  this.style.color = 'black';
}

document.addEventListener('click', () => (start.style.background = 'white', start.style.color = 'black'));



window['btn-new_game'].onmousedown = function () {
  this.style.background = 'black';
  this.style.color = 'white';
}

window['btn-new_game'].onmouseover = function() {
  this.style.background = 'rgb(54, 54, 54)';
  this.style.color = 'white';
}

window['btn-new_game'].onmouseout = function() {
  this.style.background = 'white';
  this.style.color = 'black';
}

document.addEventListener('click', () => (window['btn-new_game'].style.background = 'white', window['btn-new_game'].style.color = 'black'));


window['btn-continue_game'].onmousedown = function () {
  this.style.background = 'white';
  this.style.color = 'black';
}

window['btn-continue_game'].onmouseover = function() {
  this.style.background = 'rgb(225, 225, 225)';
  this.style.color = 'black';
}

window['btn-continue_game'].onmouseout = function() {
  this.style.background = 'rgb(80, 80, 80)';
  this.style.color = 'white';
}

document.addEventListener('click', () => (window['btn-continue_game'].style.background = 'rgb(80, 80, 80)', window['btn-continue_game'].style.color = 'white'));



let counter = 0;
let mainContinue = true;
let nextFood = true;
let useMouse = false;
let move, postF, postT, form = document.forms.mainForm;
let snakeInfo = {
  set speed (string) {
    if (string == 'slow') this._speed = 170;
    else if (string == 'medium') this._speed = 120;
    else if (string == 'fast') this._speed = 70;
    else this._speed = 40;
  },

  get speed () {
    return this._speed;
  }
}; 
let scoreInfo = {
  
  best: 0, 

  get latest () {
    return this._latest;
  },

  set latest (score) {
    this._latest = score;
    this.best = Math.max(score, this.best);
  }

};
start.onclick = function () {

  useMouse = true;
  let coll_radio = form.elements.speed;
  for (let element of coll_radio) {
    if (element.checked) snakeInfo.speed = element.value;
  };

  wrapper.style.background = 'hsla(0, 0%, 0%, 0)';
  game(snakeInfo.speed, traps.checked);

}

window['btn-continue_game'].onclick = function () {

  wrapper.style.background = 'hsla(0, 0%, 0%, 0)';
  mainContinue = true;
  useMouse = true;

  let coll_snakeBody = document.querySelectorAll('.snake-body');
  let coll_snakeTrap = document.querySelectorAll('.snake-trap');
  let coll_snakeFood = document.querySelectorAll('.snake-food');

  for (let element of coll_snakeBody) {
    element.classList.remove('snake-body');
  };
  for (let element of coll_snakeTrap) {
    element.classList.remove('snake-trap');
  };
  for (let element of coll_snakeFood) {
    element.classList.remove('snake-food');
  };
  window['snake-eyes'].id = '';
  window['snake-ass'].id = '';

  window['for-help_menu'].style.display = 'none';
  game(snakeInfo.speed, traps.checked);

}

window['btn-new_game'].onclick = function () {

  scoreInfo.best = 0;
  scoreInfo.latest = 0;
  mainContinue = true;
  useMouse = false;

  let coll_snakeBody = document.querySelectorAll('.snake-body');
  let coll_snakeTrap = document.querySelectorAll('.snake-trap');
  let coll_snakeFood = document.querySelectorAll('.snake-food');

  for (let element of coll_snakeBody) {
    element.classList.remove('snake-body');
  };
  for (let element of coll_snakeTrap) {
    element.classList.remove('snake-trap');
  };
  for (let element of coll_snakeFood) {
    element.classList.remove('snake-food');
  };
  window['snake-eyes'].id = '';
  window['snake-ass'].id = '';

  window['score-now'].innerHTML = '0';
  window['score-latest'].innerHTML = '0';
  window['score-best'].innerHTML = '0';

  window['for-help_menu'].style.display = 'none';
  window['for-menu'].hidden = false;

}

let prevChecked = document.querySelectorAll('.label')[1];
form.addEventListener('click', function(event) {
  let target = event.target;
  if (['LABEL', 'INPUT'].includes(target.tagName)) {
    if (target.tagName == 'LABEL') {
      if (target.id) {
        target.style.color = target.previousSibling.checked ? 'rgb(85, 85, 85)' : 'grey';
        
      } else {
        prevChecked.style.color = 'grey';
        target.style.color = 'rgb(85, 85, 85)';
        prevChecked = target;
      }
    } else {
      if (target.id == 'traps') {
        target = target.nextSibling;
        target.style.color = target.style.color == 'grey' ? 'rgb(85, 85, 85)' : 'grey';
      } else {
        prevChecked.style.color = 'grey';
        target.parentElement.style.color = 'rgb(85, 85, 85)';
        prevChecked = target.parentElement;
      }
    }
  }
  
})



window['help_move'].onmouseover = function (event) {
  if (useMouse) {
    if (event.target.id == 'left-animate') {
      event.target.style.background = 'linear-gradient(90deg,  rgba(100, 100, 100, 0.5), rgba(100, 100, 100, 0.05))';
    }
    else if (event.target.id == 'right-animate') {
      event.target.style.background = 'linear-gradient(270deg,  rgba(100, 100, 100, 0.5), rgba(100, 100, 100, 0.05))';
    }
    else if (event.target.id == 'up-animate') {
      event.target.style.background = 'linear-gradient(180deg,  rgba(100, 100, 100, 0.5), rgba(100, 100, 100, 0.05))';
    }
    else if (event.target.id == 'down-animate') {
      event.target.style.background = 'linear-gradient(0deg, rgba(100, 100, 100, 0.5), rgba(100, 100, 100, 0.05))';
    }
  }
};

window['help_move'].onmouseout = function (event) {
  if (useMouse) {
    event.target.style.background = 'rgba(255, 255, 255, 0)';
  }
};

window['help_move'].onmousedown = function (event) {
  if (useMouse) {
    if (event.target.id == 'left-animate') {
      event.target.style.background = 'linear-gradient(90deg,  rgba(100, 100, 100, 0.5), rgba(100, 100, 100, 0.2))';
    }
    else if (event.target.id == 'right-animate') {
      event.target.style.background = 'linear-gradient(270deg,  rgba(100, 100, 100, 0.5), rgba(100, 100, 100, 0.2))';
    }
    else if (event.target.id == 'up-animate') {
      event.target.style.background = 'linear-gradient(180deg,  rgba(100, 100, 100, 0.5), rgba(100, 100, 100, 0.2))';
    }
    else if (event.target.id == 'down-animate') {
      event.target.style.background = 'linear-gradient(0deg, rgba(100, 100, 100, 0.5), rgba(100, 100, 100, 0.2))';
    }
  }
};

window['help_move'].onclick = function (event) {
  if (useMouse) {
    getMove(event);
    if (event.target.id == 'left-animate') {
      event.target.style.background = 'linear-gradient(90deg,  rgba(100, 100, 100, 0.5), rgba(100, 100, 100, 0.05))';
    }
    else if (event.target.id == 'right-animate') {
      event.target.style.background = 'linear-gradient(270deg,  rgba(100, 100, 100, 0.5), rgba(100, 100, 100, 0.05))';
    }
    else if (event.target.id == 'up-animate') {
      event.target.style.background = 'linear-gradient(180deg,  rgba(100, 100, 100, 0.5), rgba(100, 100, 100, 0.05))';
    }
    else if (event.target.id == 'down-animate') {
      event.target.style.background = 'linear-gradient(0deg, rgba(100, 100, 100, 0.5), rgba(100, 100, 100, 0.05))';
    }
  }
};

let coll_helpMove = document.querySelectorAll('.help_move-block');
let wdt_forTable = window['for-table'].offsetWidth;
window['help_move'].style.width = wdt_forTable + 'px';
window['help_move'].style.height = wdt_forTable + 'px';
for (let element of coll_helpMove) {
  element.style.width = wdt_forTable + 'px';
  element.style.height = wdt_forTable + 'px';
};

let marginTop = window['for-score'].offsetHeight;
window['help_move'].style.marginTop = marginTop + 'px';

window.onresize = function (event) {
  wdt_forTable = window['for-table'].offsetWidth;
  marginTop = window['for-score'].offsetHeight;
  window['help_move'].style.width = wdt_forTable + 'px';
  window['help_move'].style.height = wdt_forTable + 'px';
  for (let element of coll_helpMove) {
    element.style.width = wdt_forTable + 'px';
    element.style.height = wdt_forTable + 'px';
  };
  window['help_move'].style.marginTop = marginTop + 'px';
};
