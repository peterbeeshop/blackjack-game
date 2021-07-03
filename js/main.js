let blackjackGame = {
  you: { scoreSpan: "#your-blackjack-result", div: "#your-box", score: 0 },
  dealer: {
    scoreSpan: "#dealer-blackjack-result",
    div: "#dealer-box",
    score: 0,
  },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
  cardsMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    Q: 10,
    K: 10,
    J: 10,
    A: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  turnsOver: false,
};

const You = blackjackGame["you"];
const Dealer = blackjackGame["dealer"];

const hitSound = new Audio("./sounds/swish.m4a");
const winSound = new Audio("./sounds/cash.mp3");
const lossSound = new Audio("./sounds/aww.mp3");

//EVENT LISTENERS
document
  .querySelector("#blackjack-hit-button")
  .addEventListener("click", blackjackHit);
document
  .querySelector("#blackjack-deal-button")
  .addEventListener("click", blackjackDeal);
document
  .querySelector("#blackjack-stand-button")
  .addEventListener("click", dealerLogic);

function blackjackHit() {
  if (blackjackGame.isStand === false) {
    let card = randomCard();
    showCard(card, You);
    updateScore(card, You);
    showScore(You);
  }
}
function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame["cards"][randomIndex];
}

function showCard(card, activePlayer) {
  if (activePlayer.score <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `./images/${card}.png`;
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    hitSound.play();
  }
}
function blackjackDeal() {
  if (blackjackGame.turnsOver === true) {
    let yourImage = document.querySelector("#your-box").querySelectorAll("img");
    let dealerImage = document
      .querySelector("#dealer-box")
      .querySelectorAll("img");
    for (i = 0; i < yourImage.length; i++) {
      yourImage[i].remove();
    }
    for (i = 0; i < dealerImage.length; i++) {
      dealerImage[i].remove();
    }
    You.score = 0;
    Dealer.score = 0;
    document.querySelector("#your-blackjack-result").textContent = 0;
    document.querySelector("#dealer-blackjack-result").textContent = 0;
    document.querySelector("#your-blackjack-result").style.color = "#ffffff";
    document.querySelector("#dealer-blackjack-result").style.color = "#ffffff";
    document.querySelector("#blackjack-result").textContent = "Lets Play";
    document.querySelector("#blackjack-result").style.color = "black";
    blackjackGame.turnsOver = true;
  }
}

function updateScore(card, activePlayer) {
  if (card === "A") {
    //if adding 11 keeps score below 21, add 11 else add 1;
    if (activePlayer["score"] + blackjackGame["cardsMap"][card][1] <= 21) {
      activePlayer["score"] += blackjackGame["cardsMap"][card][1];
    } else {
      activePlayer["score"] += blackjackGame["cardsMap"][card][0];
    }
  } else {
    activePlayer["score"] += blackjackGame["cardsMap"][card];
  }
}
function showScore(activePlayer) {
  if (activePlayer.score >= 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "BUSTED!!!";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent =
      activePlayer["score"];
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function dealerLogic() {
  blackjackGame.isStand = true;
  while (Dealer.score < 16 && blackjackGame.isStand === true) {
    let card = randomCard();
    showCard(card, Dealer);
    updateScore(card, Dealer);
    showScore(Dealer);
    await sleep(1000);
  }

  blackjackGame.turnsOver = true;
  let winner = computerWinner();
  showResult(winner);
  blackjackGame.isStand = false;
}

function computerWinner() {
  let winner;
  if (You.score < 21) {
    if (You.score > Dealer["score"] || Dealer.score > 21) {
      blackjackGame.wins++;
      winner = You;
    } else if (You["score"] < Dealer.score && Dealer.score < 21) {
      blackjackGame.losses++;

      winner = Dealer;
    } else if (You.score === Dealer["score"]) {
      blackjackGame["draws"]++;
    }
  } else if (You.score >= 21 && Dealer["score"] <= 21) {
    blackjackGame.losses++;

    winner = Dealer;
  } else if (You["score"] > 21 && Dealer["score"] > 21) {
    blackjackGame["draws"]++;
  }
  console.log("winner is:", winner);
  return winner;
}

function showResult(winner) {
  let message, messageColor;
  if (blackjackGame.turnsOver === true) {
    if (winner === You) {
      document.querySelector("#wins").textContent = blackjackGame.wins;
      message = "You won";
      messageColor = "green";
      winSound.play();
    } else if (winner === Dealer) {
      document.querySelector("#losses").textContent = blackjackGame.losses;

      message = "You lost";
      messageColor = "red";
      lossSound.play();
    } else {
      document.querySelector("#draws").textContent = blackjackGame.draws;

      message = "you drew";
      messageColor = "black";
    }
    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messageColor;
  }
}
