let isGameRunning = false;
let lives = 10
let holes = document.querySelectorAll(".hole")
let score = 0
let combo = 0
let highscore = 0
let timeleft = 30
const maxmoles = 6


// mole types//
let moles = [
    {
        image: "image/first-mole.png",
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
        damage:1

    },
    {
        image:"images/Pantheon_Render.webp",
        type:"safe",
        hits:0
    }
]





//randomgen//
let activeMoles = {}
let randoMole = Math.floor(Math.random() * moles.length) // number of moles 
let selectedMole = moles[randoMole]
let randomHole = Math.floor(Math.random() * holes.length) // 16 is thenumber of holes// 
while (activeMoles[randomHole]) {
    randomHole = Math.floor(Math.random() * holes.length)
}
let selectedHole =  holes[randomHole]
let moleImage = document.createElement("img")
moleImage.src = selectedMole.image
selectedHole.appendChild(moleImage)





let activeMole = {
    image: selectedMole.image,
    type: selectedMole.type,
    hits: 0,
    maxhits: selectedMole.maxhits,
    damage: selectedMole.damage
}

activeMoles[randomHole] = activeMole
