let isGameRunning = false;
let lives = 10
let score = 0
let combo = 0
let combomodifier = 1
let highscore = 0
let timeleft = 30
let spawntimer
const maxmoles = 6
// dome selectors
const holes = document.querySelectorAll(".hole")
const startbutton = document.querySelector("#start-button")
const scoreLabel = document.querySelector("#score-tracker")
const highscoreLabel = document.querySelector("#high-score-tracker")
const comboLabel = document.querySelector("#combo-tracker")

// buttonm calling different function on a timer
startbutton.addEventListener("click",()=> {
    if(!isGameRunning){
        settime()
        spawnMole()
        spawntimer = setInterval(() => {
            spawnMole()
        },1000)
    }  
})


// mole types//
let moles = [
    {
        image: "images/first-mole.png",
        type:"normal" ,
        hits: 0,
        maxhits:1,
        damage:1
    },

    {   image:"images/Rengar_Render.webp",
        type:"tough",
        hits: 0,
        maxhits:3,
        damage:3
    },

    {   image:"images/Hecarim_Render.webp",
        type:"fast",
        hits:0,
        maxhits:1,
        damage:1,
        timebonus:4

    },
    {
        image:"images/Pantheon_Render.webp",
        type:"trap",
        hits:0,
        maxhits:1,
        damage:1
    }
]

let activeMoles = {}

// creating new mole objects from the template//
function spawnMole (){
    if (Object.keys(activeMoles).length < maxmoles){
        //randomgen//
        let randoMole = Math.floor(Math.random() * moles.length) // number of moles 
        let selectedMole = moles[randoMole]
        let randomHole = Math.floor(Math.random() * holes.length) // 16 is thenumber of holes// 
        while (activeMoles[randomHole]) {
            randomHole = Math.floor(Math.random() * holes.length)
        }
        let selectedHole =  holes[randomHole]
        
        let moleImage = selectedHole.querySelector(".mole")
        console.log(moleImage)
        moleImage.style.backgroundImage = `url("${selectedMole.image}")`
        
        moleImage.classList.add("show")
    let activeMole = {
    image: selectedMole.image,
    type: selectedMole.type,
    hits: 0,
    maxhits: selectedMole.maxhits,
    damage: selectedMole.damage,
    timebonus: selectedMole.timebonus
}
    activeMoles[randomHole] = activeMole
//exception for the fast mole
if (selectedMole.type === "fast") {

activeMole.timer = setTimeout(() => {
    if (activeMoles[randomHole]) {

        combo = 0
        comboLabel.textContent = combo

        moleImage.classList.remove("show")
        delete activeMoles[randomHole]
    }
}, 850)

} else {

setTimeout(() => {
    if (activeMoles[randomHole]) {
        combo = 0
        comboLabel.textContent = combo
        moleImage.classList.remove("show")
        delete activeMoles[randomHole]
    }
}, 2000)

}}
    }

// clicking a hole function//

holes.forEach((hole,index) =>{
    hole.addEventListener("click",() =>{
        if (activeMoles[index]) {
            let mole = activeMoles[index]
            mole.hits += 1
            // NORMAL
            if(mole.type === "normal") {
                if (mole.hits >= mole.maxhits){
                    console.log("mole was defeated")
                    combo += 1
                    comboLabel.textContent = combo
                    hole.querySelector(".mole").classList.remove("show")
                    delete activeMoles[index]
                    updatecombomodifier()
                }
            }
            // TOUGH
            else if (mole.type === "tough"){
                if(mole.hits >= mole.maxhits){
                    console.log("tough mole defeated")
                    hole.querySelector(".mole").classList.remove("show")
                    combo += 1
                    comboLabel.textContent = combo
                    delete activeMoles[index]
                    updatecombomodifier()
                }
            }
            // TRAP
            else if(mole.type === "trap") {
                lives -= mole.damage
                combo = 0
                comboLabel.textContent = combo
                console.log("you lost a life")
                console.log("Lives", lives)
                hole.querySelector(".mole").classList.remove("show")
                delete activeMoles[index]
                updatecombomodifier()
            }
            // FAST
            else if (mole.type === "fast") {
                timeleft += mole.timebonus
                clearTimeout(mole.timer)
                combo += 1
                comboLabel.textContent = combo
                hole.querySelector(".mole").classList.remove("show")
                delete activeMoles[index]
                updatecombomodifier()
            }
        }
    })
})


// game counter //
function settime (){
    isGameRunning = true
    let timer = setInterval(() => {
        timeleft -=1 // what we will display
        console.log("Time",timeleft)
        if(timeleft<=0) {
            timeleft=0
            clearInterval(timer)
            clearInterval(spawntimer)
            isGameRunning = false
            console.log("game over")
            return
        }
    },2000) //ms to timer end
}

function updatecombomodifier(){
    if (combo >= 20) {
        combomodifier = 3
    }

    else if (combo >= 10) {
        combomodifier = 2
    }

    else if (combo >= 5) {
        combomodifier = 1.5
    }

    else {
        combomodifier = 1
    }
}