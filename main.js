var game = new Phaser.Game(405, 445, Phaser.CANVAS, "game_div", {
  preload: preload,
  create: create,
  update: update,
  top_sort: top_sort,
  left_sort: left_sort,
  down_sort: down_sort,
  right_sort: right_sort,
  con_map: con_map,
  line_sort: line_sort,
});

var top_key, left_key, down_key, right_key, create_rand_num;
var bmd2,
  title = 40;
var GameOver;
var scoreText,
  score = 0,
  backScore = 0;
var line = [0, 0, 0, 0];
var text = [],
  cube = [];
window.debug = false;

var map = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

var backMap = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function preload() {
  game.stage.backgroundColor = "#c6d4e1";
  game.load.spritesheet("bg", "bg.png", 100, 100, 5);
  game.load.image("gameover", "gover.png");
}

function create() {
  bmd2 = game.add.bitmapData(400, 40);
  bmd2.ctx.beginPath();
  bmd2.ctx.rect(5, 5, 400, 400);
  bmd2.ctx.fillStyle = "#effdc0";
  bmd2.ctx.fill();

  rand_num();
  rand_num();
  con_map(" - New Game - ");
  draw_game();
  draw_table();

  scoreText = game.add.text(10, 12, "0", {
    font: "17pt Arial Black",
    fill: "#44749d",
  });

  var restartText = game.add.text(200, 12, "Restart", {
    font: "17pt Arial Black",
    fill: "#44749d",
  });
  restartText.inputEnabled = true;
  restartText.events.onInputOver.add(function () {
    restartText.fill = "#c6d4e1";
  }, this);
  restartText.events.onInputOut.add(function () {
    restartText.fill = "#44749d";
  }, this);
  restartText.events.onInputDown.add(restartGame, this);

  var cancelText = game.add.text(307, 12, "Cancel", {
    font: "17pt Arial Black",
    fill: "#44749d",
  });
  cancelText.inputEnabled = true;
  cancelText.events.onInputOver.add(function () {
    cancelText.fill = "#c6d4e1";
  }, this);
  cancelText.events.onInputOut.add(function () {
    cancelText.fill = "#44749d";
  }, this);
  cancelText.events.onInputDown.add(cancelGame, this);

  top_key = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  left_key = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  down_key = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  right_key = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
}

function con_map(dir) {
  if (!window.debug) return;
  console.log(" ");
  console.info(dir);
  console.log(map[0][0], map[0][1], map[0][2], map[0][3]);
  console.log(map[1][0], map[1][1], map[1][2], map[1][3]);
  console.log(map[2][0], map[2][1], map[2][2], map[2][3]);
  console.log(map[3][0], map[3][1], map[3][2], map[3][3]);
  console.log(".:Ghost_R1dEr:.");
}

function draw_game() {
  var k = 0;
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map.length; j++) {
      cube[k] = game.add.sprite(i * 100 + 5, j * 100 + 5 + title, "bg", 4);
      text[k] = game.add.text(i * 100 + 40, j * 100 + 38 + title, map[j][i], {
        font: "bold 22pt Arial Black",
        fill: "#44749d",
      });
      k++;
    }
  }
  game.add.sprite(0, 0, bmd2);
}

function draw_table() {
  var k = 0;
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map.length; j++) {
      if (map[j][i] == 0) {
        text[k].text = " ";
        text[k].x = i * 100 + 40;
        text[k].fill = "#44749d";
        cube[k].frame = 4;
      }
      if (0 != map[j][i] && map[j][i] < 10) {
        text[k].text = "" + map[j][i];
        text[k].x = i * 100 + 40;
        text[k].fill = "#44749d";
        cube[k].frame = 3;
      }
      if (10 <= map[j][i] && map[j][i] < 100) {
        text[k].text = "" + map[j][i];
        text[k].x = i * 100 + 30;
        text[k].fill = "#44749d";
        cube[k].frame = 2;
      }
      if (100 <= map[j][i] && map[j][i] < 1000) {
        text[k].text = "" + map[j][i];
        text[k].x = i * 100 + 20;
        text[k].fill = "#44749d";
        cube[k].frame = 1;
      }
      if (1000 <= map[j][i] && map[j][i] < 10000) {
        text[k].text = "" + map[j][i];
        text[k].x = i * 100 + 10;
        text[k].fill = "#effdc0";
        cube[k].frame = 0;
      }
      k++;
    }
  }
}

function top_sort() {
  backScore = score;
  create_rand_num = false;
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map.length; j++) {
      line[j] = map[j][i];
      backMap[i][j] = map[j][i];
    }
    line_sort();
    for (var j = 0; j < map.length; j++) {
      map[j][i] = line[j];
    }
  }
  if (create_rand_num) {
    rand_num();
    draw_table();
    con_map(" - Top Sort - ");
  }
  gameOver();
}

function left_sort() {
  backScore = score;
  create_rand_num = false;
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map.length; j++) {
      line[j] = map[i][j];
      backMap[j][i] = map[i][j];
    }
    line_sort();
    for (var j = 0; j < map.length; j++) {
      map[i][j] = line[j];
    }
  }
  if (create_rand_num) {
    rand_num();
    draw_table();
    con_map(" - Left Sort - ");
  }
  gameOver();
}

function down_sort() {
  backScore = score;
  create_rand_num = false;
  for (var i = 0; i < map.length; i++) {
    var k = 0;
    for (var j = map.length - 1; j >= 0; j--) {
      line[k] = map[j][i];
      backMap[i][j] = map[j][i];
      k++;
    }
    line_sort();
    k = 0;
    for (var j = map.length - 1; j >= 0; j--) {
      map[j][i] = line[k];
      k++;
    }
  }
  if (create_rand_num) {
    rand_num();
    draw_table();
    con_map(" - Down Sort - ");
  }
  gameOver();
}

function right_sort() {
  backScore = score;
  create_rand_num = false;
  for (var i = 0; i < map.length; i++) {
    var k = 0;
    for (var j = map.length - 1; j >= 0; j--) {
      line[k] = map[i][j];
      backMap[j][i] = map[i][j];
      k++;
    }
    line_sort();
    k = 0;
    for (var j = map.length - 1; j >= 0; j--) {
      map[i][j] = line[k];
      k++;
    }
  }
  if (create_rand_num) {
    rand_num();
    draw_table();
    con_map(" - Right Sort - ");
  }

  gameOver();
}

function line_sort() {
  for (var i = 0; i < line.length; i++) {
    for (var j = i + 1; j < line.length; j++) {
      if (line[i] != 0) {
        if (line[i] == line[j]) {
          line[i] += line[j];
          line[j] = 0;
          score += line[i];
          scoreText.text = "" + score;
          create_rand_num = true;
          break;
        } else {
          if (line[j] != 0) {
            break;
          } else {
            continue;
          }
        }
      } else {
        if (line[j] != 0) {
          line[i] += line[j];
          line[j] = 0;
          create_rand_num = true;
        } else if (line[j] == 0) {
          continue;
        }
      }
    }
  }
}

function rand_num() {
  var i = game.rnd.integerInRange(0, map.length - 1);
  var j = game.rnd.integerInRange(0, map.length - 1);
  if (map[i][j] == 0) {
    if (game.rnd.integerInRange(0, 4) == 0) {
      map[i][j] = 4;
    } else {
      map[i][j] = 2;
    }
  } else {
    rand_num();
  }
}

function update() {
  if (top_key.justDown) {
    top_sort();
  } else if (left_key.justDown) {
    left_sort();
  } else if (down_key.justDown) {
    down_sort();
  } else if (right_key.justDown) {
    right_sort();
  }
}

function cancelGame() {
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map.length; j++) {
      map[j][i] = backMap[i][j];
    }
  }
  score = backScore;
  scoreText.text = "" + backScore;
  draw_table();
  con_map(" - Cancel Game - ");
}

function restartGame() {
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map.length; j++) {
      map[j][i] = 0;
    }
  }
  rand_num();
  rand_num();
  score = 0;
  scoreText.text = "" + score;
  draw_table();
  con_map(" - Restart Game - ");
  GameOver.destroy();
}

function gameOver() {
  var gameOver = true;
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map.length; j++) {
      if (map[i][j] == 0) {
        gameOver = false;
      }
      if (i != map.length - 1) {
        if (map[i][j] == map[i + 1][j]) {
          gameOver = false;
        }
      }
      if (j != map.length - 1) {
        if (map[i][j] == map[i][j + 1]) {
          gameOver = false;
        }
      }
    }
  }

  if (gameOver && !GameOver) {
    GameOver = game.add.sprite(50, game.world.centerY - 37, "gameover");
    con_map(" - GAME OVER - ");
  }
}
