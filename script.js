let bg_music = new Audio("sounds effect/guitar.mp3");


let move_speed = 3,
  grativy = 0.5;
let witcher = document.querySelector(".witcher");
let img = document.getElementById("witcher-1");
let sound_point = new Audio("sounds effect/get.mp3");
let sound_die = new Audio("sounds effect/game-over.mp3");

// getting witcher element properties
let witcher_props = witcher.getBoundingClientRect();

// This method returns DOMReact -> top, right, bottom, left, x, y, width and height
let background = document.querySelector(".background").getBoundingClientRect();

let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");
let score_title = document.querySelector(".score_title");

let game_state = "Start";
img.style.display = "none";
message.classList.add("messageStyle");


bg_music.loop = true; // pour que la musique se répète en boucle
bg_music.volume = 1.0;
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && game_state !== "Play") {

    // Supprimer tous les tuyaux existants
    document.querySelectorAll(".pipe_sprite").forEach(pipe => {
      pipe.remove();
    });

    // Afficher le Witcher et réinitialiser sa position
    img.style.display = "block";
    witcher.style.top = "100vh";

    // Changer l'état du jeu
    game_state = "Play";

    // Réinitialiser l'affichage du score et du message
    message.innerHTML = "";
    score_title.innerHTML = "Score : ";
    score_val.innerHTML = "0";
    message.classList.remove("messageStyle");

    // Lancer la musique de fond (optionnel)
    if (bg_music) {
      bg_music.play().catch(err => console.log("Musique bloquée :", err));
    }

    // Démarrer le jeu
    play();
  }
});

function play() {
  function move() {
    if (game_state != "Play") return;

    let pipe_sprite = document.querySelectorAll(".pipe_sprite");
    pipe_sprite.forEach((element) => {
      let pipe_sprite_props = element.getBoundingClientRect();
      witcher_props = witcher.getBoundingClientRect();

      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        if (
          witcher_props.left <
            pipe_sprite_props.left + pipe_sprite_props.width &&
          witcher_props.left + witcher_props.width > pipe_sprite_props.left &&
          witcher_props.top <
            pipe_sprite_props.top + pipe_sprite_props.height &&
          witcher_props.top + witcher_props.height > pipe_sprite_props.top
        ) {
          game_state = "End";
          message.innerHTML = `🧙‍♀️ <span class="game-over-text">GAME OVER</span> 🧙‍♀️<br><small>Appuie sur <span class="key">Enter</span> pour rejouer</small>`;

          message.classList.add("gameOverStyle");

          message.classList.add("messageStyle");
          img.style.display = "none";
          sound_die.play();
          return;
        } else {
          if (
            pipe_sprite_props.right < witcher_props.left &&
            pipe_sprite_props.right + move_speed >= witcher_props.left &&
            element.increase_score == "1"
          ) {
            score_val.innerHTML = +score_val.innerHTML + 1;
            sound_point.play();
          }
          element.style.left = pipe_sprite_props.left - move_speed + "px";
        }
      }
    });
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);

  let witcher_dy = 0;
  function apply_gravity() {
    if (game_state != "Play") return;
    witcher_dy = witcher_dy + grativy;
    document.addEventListener("keydown", (e) => {
      if (e.key == "ArrowUp" || e.key == " ") {
        img.src = "images/sorciere.png";
        witcher_dy = -7.6;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key == "ArrowUp" || e.key == " ") {
        img.src = "images/sorciere.png";
      }
    });

    if (witcher_props.top <= 0 || witcher_props.bottom >= background.bottom) {
      game_state = "End";
      message.style.left = "28vw";
      window.location.reload();
      message.classList.remove("messageStyle");
      return;
    }
    witcher.style.top = witcher_props.top + witcher_dy + "px";
    witcher_props = witcher.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let pipe_seperation = 0;

  let pipe_gap = 35;

  function create_pipe() {
    if (game_state != "Play") return;

    if (pipe_seperation > 115) {
      pipe_seperation = 0;

      let pipe_posi = Math.floor(Math.random() * 43) + 8;
      let pipe_sprite_inv = document.createElement("div");
      pipe_sprite_inv.className = "pipe_sprite";
      pipe_sprite_inv.style.top = pipe_posi - 70 + "vh";
      pipe_sprite_inv.style.left = "100vw";

      document.body.appendChild(pipe_sprite_inv);
      let pipe_sprite = document.createElement("div");
      pipe_sprite.className = "pipe_sprite";
      pipe_sprite.style.top = pipe_posi + pipe_gap + "vh";
      pipe_sprite.style.left = "100vw";
      pipe_sprite.increase_score = "1";

      document.body.appendChild(pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);
}
