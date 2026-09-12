let isGameRunning = false;
let lives = 10
let score = 0
let combo = 0
let combomodifier = 1
let highscore = 0
let timeleft = 30
let hitsound = new Audio("sounds/panthsound.ogg")
let spawntimer
let timer
let activeMoles = {}
const maxmoles = 6
// mole types
let moles = [
    {
        image: "images/first-mole.png",
        type: "normal",
        hits: 0,
        maxhits: 1,
        damage: 1
    },
    {
        image: "images/Rengar_Render.webp",
        type: "tough",
        hits: 0,
        maxhits: 2,
        damage: 2
    },
    {
        image: "images/Hecarim_Render.webp",
        type: "fast",
        hits: 0,
        maxhits: 1,
        damage: 1,
        timebonus: 2
    },
    {
        image: "images/Pantheon_Render.webp",
        type: "trap",
        hits: 0,
        maxhits: 1,
        damage: 1
    }
]
// DOM selectors
const holes = document.querySelectorAll(".hole")
const startbutton = document.querySelector("#start-button")
const scoreLabel = document.querySelector("#score-tracker")
const highscoreLabel = document.querySelector("#high-score-tracker")
const comboLabel = document.querySelector("#combo-tracker")
const livesLabel = document.querySelector("#lives-tracker")
const timeLabel = document.querySelector("#time-tracker")
// load high score
highscore = Number(localStorage.getItem("highscore")) || 0
highscoreLabel.textContent = highscore
// start button
startbutton.addEventListener("click", () => {
    if (!isGameRunning) {
        settime()
        spawnMole()
        spawntimer = setInterval(() => {
            spawnMole()
        }, 600)
    }
})
//  reset function
function resetgame() {
    updatehighscore()
    // stop timers
    clearInterval(timer)
    clearInterval(spawntimer)
    isGameRunning = false
    lives = 10
    score = 0
    combo = 0
    livesLabel.textContent = "Lives: " + lives
    timeLabel.textContent = "Time: " + timeleft
    combomodifier = 1
    timeleft = 30
    activeMoles = {}
    // remove all visible moles
    holes.forEach(hole => {
        hole.querySelector(".mole").classList.remove("show")
    })
    // update UI
    scoreLabel.textContent = score
    comboLabel.textContent = combo
    console.log("GAME OVER")
}
// creating new mole objects from the template
function spawnMole() {
    if (Object.keys(activeMoles).length < maxmoles) {
        // random mole
        let randoMole = Math.floor(Math.random() * moles.length)
        let selectedMole = moles[randoMole]
        // random hole
        let randomHole = Math.floor(Math.random() * holes.length)
        while (activeMoles[randomHole]) {
            randomHole = Math.floor(Math.random() * holes.length)
        }
        let selectedHole = holes[randomHole]
        let moleImage = selectedHole.querySelector(".mole")
        moleImage.style.backgroundImage = `url("${selectedMole.image}")`
        moleImage.classList.add("show")
        // create active mole
        let activeMole = {
            image: selectedMole.image,
            type: selectedMole.type,
            hits: 0,
            maxhits: selectedMole.maxhits,
            damage: selectedMole.damage,
            timebonus: selectedMole.timebonus
        }
        activeMoles[randomHole] = activeMole
        // FAST MOLE
        if (selectedMole.type === "fast") {
            activeMole.timer = setTimeout(() => {
                if (activeMoles[randomHole] === activeMole) {
                    // fast mole escaped → damage
                    lives -= activeMole.damage
                    livesLabel.textContent= "lives: "+ lives
                    // escaped mole resets combo
                    combo = 0
                    comboLabel.textContent = "Combo " + combo
                    updatecombomodifier()
                    console.log("Fast mole escaped")
                    console.log("Lives: ", lives)
                    moleImage.classList.remove("show")
                    delete activeMoles[randomHole]
                    // game over if no lives
                    if (lives <= 0) {
                        resetgame()
                    }
                }
            }, 1200)
        }
        // NORMAL / TOUGH / TRAP
        else {
            setTimeout(() => {
                if (activeMoles[randomHole] === activeMole) {
                    // Trap escaping does NOT cause damage
                    if (activeMole.type !== "trap") {
                        // normal/tough escaping → damage
                        lives -= activeMole.damage
                        livesLabel.textContent= "lives: "+ lives
                        // escaping resets combo
                        combo = 0
                        comboLabel.textContent = "Combo: " + combo
                        updatecombomodifier()
                        console.log(activeMole.type + " mole escaped")
                        console.log("Lives:", lives)
                    }
                    moleImage.classList.remove("show")
                    delete activeMoles[randomHole]
                    // game over if no lives
                    if (lives <= 0) {
                        resetgame()
                    }
                }
            }, 2200)
        }
    }
}
// clicking a hole
holes.forEach((hole, index) => {
    hole.addEventListener("click", () => {
        if (activeMoles[index]) {
            let mole = activeMoles[index]
            mole.hits += 1
            // NORMAL
            if (mole.type === "normal") {
                if (mole.hits >= mole.maxhits) {
                    hitsound.currentTime =0
                    hitsound.play()
                    console.log("mole was defeated")
                    combo += 1
                    comboLabel.textContent = combo
                    hole.querySelector(".mole").classList.remove("show")
                    delete activeMoles[index]
                    updatecombomodifier()
                    addscore(1)
                }
            }
            // TOUGH
            else if (mole.type === "tough") {
                if (mole.hits >= mole.maxhits) {
                    hitsound.currentTime =0
                    hitsound.play()
                    console.log("tough mole defeated")
                    hole.querySelector(".mole").classList.remove("show")
                    combo += 1
                    comboLabel.textContent = combo
                    delete activeMoles[index]
                    updatecombomodifier()
                    addscore(1)
                }
            }
            // TRAP
            else if (mole.type === "trap") {
                // clicking trap → damage
                lives -= mole.damage
                livesLabel.textContent = "Lives: " + lives
                hitsound.currentTime =0
                hitsound.play()
                combo = 0
                comboLabel.textContent = combo
                console.log("you lost a life")
                console.log("Lives:", lives)
                hole.querySelector(".mole").classList.remove("show")
                delete activeMoles[index]
                updatecombomodifier()
                // game over
                if (lives <= 0) {
                    resetgame()
                }
            }
            // FAST
            else if (mole.type === "fast") {
                // fast mole gives extra time
                timeleft += mole.timebonus
                timeLabel.textContent = "time: " + timeleft
                hitsound.currentTime =0
                hitsound.play()
                clearTimeout(mole.timer)
                combo += 1
                comboLabel.textContent = combo
                hole.querySelector(".mole").classList.remove("show")
                delete activeMoles[index]
                updatecombomodifier()
                addscore(1)
            }
        }
    })
})
// game timer
function settime() {
    isGameRunning = true
    timer = setInterval(() => {
        timeleft -= 1
        timeLabel.textContent = "time: " + timeleft
        console.log("Time:", timeleft)
        if (timeleft <= 0) {
            timeleft = 0
            resetgame()
        }
    }, 1000)
}
// combo modifier
function updatecombomodifier() {
    if (combo >= 50) {
        combomodifier = 4
    }
    else if (combo >= 30) {
        combomodifier = 3
    }
    else if (combo >= 15) {
        combomodifier = 2
    }
    else {
        combomodifier = 1
    }
}
// score
function addscore(points) {
    score += points * combomodifier
    scoreLabel.textContent = score
}
// update high score
function updatehighscore() {
    if (score > highscore) {
        highscore = score
        localStorage.setItem("highscore", highscore)
        highscoreLabel.textContent = highscore
    }
}
