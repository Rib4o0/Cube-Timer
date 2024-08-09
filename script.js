import {createChart} from "./chart/chart.js";

const chartContainer = document.querySelector(".chartContainer")
const scrambleDisplay = document.querySelector(".scramble")
const settingsBtn = document.querySelector(".settings")
const darker = document.querySelector(".darker")
const settingsClose = document.querySelector(".settingsClose")
const settingsPanel = document.querySelector(".settingsPanel")
const timeText = document.querySelector(".time")
const header = document.querySelector("header")
const avgTimes = document.querySelector(".avgTimes")
const bestSingle = document.querySelector(".bestSingle")
const mean3 = document.querySelector(".Mean3")
const avg5 = document.querySelector(".Avg5");
const avg12 = document.querySelector(".Avg12")
const scrambleDisplayContainer = document.querySelector(".scrambleDisplayContainer")

// Settings Buttons, Inputs, and Toggles
let lightMode = "light";
const darkModeBtn = document.querySelector(".dark")
const lightModeBtn = document.querySelector(".light")
let timeDisplayMethod = "full";
const fullModeBtn = document.querySelector(".full")
const wholeModeBtn = document.querySelector(".whole")
const hiddenModeBtn = document.querySelector(".hidden")
let scrambleLength = 10;
const scrLenInput = document.querySelector(".scrambleLength");
let hideElementsWhenSolving = false;
const hideElements = document.querySelector(".hideElem");
const showElements = document.querySelector(".showElem");
const graph = document.querySelector(".graph")
const scrambleDisplaySetting = document.querySelector(".scrambleSetting");
const noTool = document.querySelector(".noTool");

const centers = document.querySelectorAll(".center")

let cube = [
    [
        0,0,0,
        0,0,0,
        0,0,0
    ],
    [
        1,1,1,
        1,1,1,
        1,1,1
    ],
    [
        2,2,2,
        2,2,2,
        2,2,2
    ],
    [
        3,3,3,
        3,3,3,
        3,3,3
    ],
    [
        4,4,4,
        4,4,4,
        4,4,4
    ],
    [
        5,5,5,
        5,5,5,
        5,5,5
    ],
];

function generateScramble() {
    const moves = ["U", "L", "R", "F"];
    const modifiers = ["", "'", "2"];
    let scramble = [];
    let lastMove = "";

    for (let i = 0; i < scrambleLength; i++) {
        let move;
        do {
            move = moves[Math.floor(Math.random() * moves.length)];
        } while (move === lastMove);
        lastMove = move;
        let modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        scramble.push(move + modifier);
    }

    for (let move of scramble) {
        let multiplier = 1;
        if (move.charAt(move.length - 1) === "2") {
            multiplier = 2;
        } else if (move.charAt(move.length - 1) === "'") {
            multiplier = 3
        }
        for (let i = 0; i < multiplier; i++) rotateCube(move.charAt(0));
    }

    scrambleDisplay.textContent = scramble.join(" ");
}

loadSettings()

settingsBtn.addEventListener("click", () => {
    darker.classList.add('show');
    settingsPanel.classList.add('show');
})

settingsClose.addEventListener("click", () => {
    darker.classList.remove('show');
    settingsPanel.classList.remove('show');
})

darkModeBtn.addEventListener("click", () => {
    lightMode = "dark"
    changeTheme();
    saveSettings()
})

lightModeBtn.addEventListener("click", () => {
    lightMode = "light"
    changeTheme();
    saveSettings()
})

fullModeBtn.addEventListener("click", () => {
    timeDisplayMethod = "full";
    fullModeBtn.classList.add('selected');
    wholeModeBtn.classList.remove('selected');
    hiddenModeBtn.classList.remove('selected');
    saveSettings()
})

wholeModeBtn.addEventListener("click", () => {
    timeDisplayMethod = "whole";
    fullModeBtn.classList.remove('selected');
    wholeModeBtn.classList.add('selected');
    hiddenModeBtn.classList.remove('selected');
    saveSettings()
})

hiddenModeBtn.addEventListener("click", () => {
    timeDisplayMethod = "hidden";
    fullModeBtn.classList.remove('selected');
    wholeModeBtn.classList.remove('selected');
    hiddenModeBtn.classList.add('selected');
    saveSettings()
})

scrLenInput.addEventListener("input", e => {
    scrambleLength = parseInt(e.target.value);
    generateScramble();
    saveSettings()
})

hideElements.addEventListener("click", () => {
    hideElementsWhenSolving = true;
    hideElements.classList.add("selected");
    showElements.classList.remove("selected");
})

showElements.addEventListener("click", () => {
    hideElementsWhenSolving = false;
    hideElements.classList.remove("selected");
    showElements.classList.add("selected");
})

graph.addEventListener("click", () => {
    chartContainer.classList.remove("permahide");
    scrambleDisplayContainer.classList.add("permahide");
    graph.classList.add("selected");
    scrambleDisplaySetting.classList.remove("selected");
    noTool.classList.remove("selected");
})

scrambleDisplaySetting.addEventListener("click", () => {
    chartContainer.classList.add("permahide");
    scrambleDisplayContainer.classList.remove("permahide");
    graph.classList.remove("selected");
    scrambleDisplaySetting.classList.add("selected");
    noTool.classList.remove("selected");
})

noTool.addEventListener("click", () => {
    chartContainer.classList.add("permahide");
    scrambleDisplayContainer.classList.add("permahide");
    graph.classList.remove("selected");
    scrambleDisplaySetting.classList.remove("selected");
    noTool.classList.add("selected");
})

function changeTheme() {
    if (lightMode === "dark") {
        document.documentElement.style.setProperty("--background", "#0D0D0D");
        document.documentElement.style.setProperty("--border", "#191919");
        document.documentElement.style.setProperty("--text", "#fff");
        document.documentElement.style.setProperty("--lighter-shade", "#222222");
        darkModeBtn.classList.add("selected");
        lightModeBtn.classList.remove("selected");
    } else if (lightMode === "light") {
        document.documentElement.style.setProperty("--background", "#fff");
        document.documentElement.style.setProperty("--border", "#ddd");
        document.documentElement.style.setProperty("--text", "#000");
        document.documentElement.style.setProperty("--lighter-shade", "#e1e1e1");
        darkModeBtn.classList.remove("selected");
        lightModeBtn.classList.add("selected");
    }
}

let spacePressed = false;
let timerReady = false;
let timing = false;
let startTime
let updateTimerInterval

let solveTimes = [];
updateAverages()

window.addEventListener("keydown", e => {
    if (!spacePressed) {
        if (e.key === " ") {
            if (!timing) {
                spacePressed = true;
                timeText.classList.add("gettingReady");
                setTimeout(() => {
                    if (spacePressed) {
                        timeText.classList.add("ready");
                        timerReady = true;
                    }
                }, 500)
            } else {
                clearTimeout(updateTimerInterval);
                timing = false;
                let finalTime = getElapsedTime();
                timeText.textContent = finalTime.seconds + "." + finalTime.milliseconds;
                solveTimes.push(finalTime.seconds * 1000 + finalTime.milliseconds);
                if (hideElementsWhenSolving) {
                    header.classList.remove("hide");
                    chartContainer.classList.remove("hide");
                    avgTimes.classList.remove("hide");
                }
                updateAverages()
                updateTimesChart()
                generateScramble();
            }
        }
    }
})

window.addEventListener("keyup", e => {
    if (spacePressed) {
        if (e.key === " ") {
            timeText.classList.remove("gettingReady");
            timeText.classList.remove("ready");
            spacePressed = false;
            if (timerReady) {
                timing = true;
                timerReady = false;
                startTime = new Date();
                if (hideElementsWhenSolving) {
                    header.classList.add("hide");
                    chartContainer.classList.add("hide");
                    avgTimes.classList.add("hide");
                }
                updateTimerInterval = setInterval(() => {
                    if (timeDisplayMethod === "full") {
                        timeText.textContent = getElapsedTime().seconds + "." + (getElapsedTime().milliseconds.toString().substring(0,1));
                    } else if (timeDisplayMethod === "whole") {
                        timeText.textContent = getElapsedTime().seconds.toString();
                    } else {
                        timeText.textContent = "Solving";
                    }
                }, 100)
            }
        }
    }
})

function getElapsedTime() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime; // in milliseconds
    const seconds = Math.floor(elapsedTime / 1000);
    const milliseconds = elapsedTime % 1000;
    return { seconds, milliseconds };
}

function updateTimesChart() {
    chartContainer.innerHTML = "";
    console.log(solveTimes)
    createChart(solveTimes, "Solve Times", false, chartContainer);
}

function saveSettings() {
    localStorage.setItem("lightMode", lightMode);
    localStorage.setItem("timeDisplayMethod", timeDisplayMethod);
    localStorage.setItem("scrambleLength", scrambleLength);
}

function loadSettings() {
    if (localStorage.getItem("lightMode")) {
        lightMode = localStorage.getItem("lightMode")
        timeDisplayMethod = localStorage.getItem("timeDisplayMethod")
        scrambleLength = localStorage.getItem("scrambleLength")
        if (timeDisplayMethod === "whole") {
            fullModeBtn.classList.remove('selected');
            wholeModeBtn.classList.add('selected');
            hiddenModeBtn.classList.remove('selected');
        } else if (timeDisplayMethod === "hidden") {
            fullModeBtn.classList.remove('selected');
            wholeModeBtn.classList.remove('selected');
            hiddenModeBtn.classList.add('selected');
        }
    } else {
        localStorage.setItem("lightMode", lightMode);
        localStorage.setItem("timeDisplayMethod", timeDisplayMethod);
        localStorage.setItem("scrambleLength", scrambleLength);
    }
    scrLenInput.value = scrambleLength;
    generateScramble();
    changeTheme()
}

function updateAverages() {
    let bestSolve = Infinity;
    for (let solve of solveTimes) {
        if (solve < bestSolve) {
            bestSolve = solve;
        }
    }
    bestSingle.textContent = "Best: " + bestSolve/1000;
    if (bestSolve === Infinity) bestSingle.textContent = "Best: -";
    mean3.textContent = "Mean of 3: -";
    avg5.textContent = "Average of 5: -";
    avg12.textContent = "Average of 12: -";
    if (solveTimes.length >= 3) {
        let lastSolves = [];
        for (let i = solveTimes.length - 1; i > solveTimes.length - 4; i--) {
            const solveTime = solveTimes[i];
            lastSolves.push(solveTime);
        }
        let sumOfSolves = 0;
        for (let solve of lastSolves) {
            sumOfSolves += solve;
        }
        let meanOf3 = sumOfSolves / 3000;
        let rounded = Math.floor(meanOf3 * 1000)/1000;
        mean3.textContent = "Mean of 3: " + rounded;
    }
    if (solveTimes.length >= 5) {
        let bestSolve = Infinity;
        let worstSolve = -Infinity;
        let lastSolves = [];
        for (let i = solveTimes.length - 1; i > solveTimes.length - 6; i--) {
            const solveTime = solveTimes[i];
            lastSolves.push(solveTime);
            if (solveTime > worstSolve) worstSolve = solveTime;
            if (solveTime < bestSolve) bestSolve = solveTime;
        }
        let sumOfSolves = 0;
        for (let solve of lastSolves) {
            sumOfSolves += solve;
        }
        sumOfSolves -= bestSolve;
        sumOfSolves -= worstSolve;
        let avgOf5 = sumOfSolves / 3000;
        let rounded = Math.floor(avgOf5 * 1000)/1000;
        avg5.textContent = "Average of 5: " + rounded;
    }
    if (solveTimes.length >= 12) {
        let bestSolve = Infinity;
        let worstSolve = -Infinity;
        let lastSolves = [];
        for (let i = solveTimes.length - 1; i > solveTimes.length - 13; i--) {
            const solveTime = solveTimes[i];
            lastSolves.push(solveTime);
            if (solveTime > worstSolve) worstSolve = solveTime;
            if (solveTime < bestSolve) bestSolve = solveTime;
        }
        let sumOfSolves = 0;
        for (let solve of lastSolves) {
            sumOfSolves += solve;
        }
        sumOfSolves -= bestSolve;
        sumOfSolves -= worstSolve;
        let avgOf12 = sumOfSolves / 9000;
        let rounded = Math.floor(avgOf12 * 1000)/1000;
        avg12.textContent = "Average of 12: " + rounded;
    }
}

displayCube()

function displayCube() {
    centers.forEach((center, index) => {
        center.innerHTML = "";
        for (let piece of cube[index]) {
            let color = "white";
            const displayPiece = document.createElement("div");
            switch (piece) {
                case 0:
                    color = "white";
                    break;
                case 1:
                    color = "green";
                    break;
                case 2:
                    color = "red";
                    break;
                case 3:
                    color = "blue";
                    break;
                case 4:
                    color = "orange";
                    break;
                case 5:
                    color = "yellow";
                    break;
            }
            displayPiece.classList.add(color);
            center.appendChild(displayPiece);
        }
    })
}

function rotateCube(turn) {
    let temp;
    switch (turn) {
        case "U":
            // Rotate the top face clockwise
            temp = cube[0][0];
            cube[0][0] = cube[0][6];
            cube[0][6] = cube[0][8];
            cube[0][8] = cube[0][2];
            cube[0][2] = temp;
            temp = cube[0][1];
            cube[0][1] = cube[0][3];
            cube[0][3] = cube[0][7];
            cube[0][7] = cube[0][5];
            cube[0][5] = temp;

            // Rotate the side faces
            temp = [cube[1][0], cube[1][1], cube[1][2]];
            for (let i = 0; i < 3; i++) {
                cube[1][i] = cube[2][i];
                cube[2][i] = cube[3][i];
                cube[3][i] = cube[4][i];
                cube[4][i] = temp[i];
            }
            break;

        case "R":
            // Rotate the right face clockwise
            temp = cube[2][0];
            cube[2][0] = cube[2][6];
            cube[2][6] = cube[2][8];
            cube[2][8] = cube[2][2];
            cube[2][2] = temp;
            temp = cube[2][1];
            cube[2][1] = cube[2][3];
            cube[2][3] = cube[2][7];
            cube[2][7] = cube[2][5];
            cube[2][5] = temp;

            // Rotate the side faces
            temp = [cube[0][2], cube[0][5], cube[0][8]];
            cube[0][2] = cube[1][2];
            cube[0][5] = cube[1][5];
            cube[0][8] = cube[1][8];
            cube[1][2] = cube[5][2];
            cube[1][5] = cube[5][5];
            cube[1][8] = cube[5][8];
            cube[5][2] = cube[3][6];
            cube[5][5] = cube[3][3];
            cube[5][8] = cube[3][0];
            cube[3][6] = temp[0];
            cube[3][3] = temp[1];
            cube[3][0] = temp[2];
            break;

        case "L":
            // Rotate the left face clockwise
            temp = cube[4][0];
            cube[4][0] = cube[4][6];
            cube[4][6] = cube[4][8];
            cube[4][8] = cube[4][2];
            cube[4][2] = temp;
            temp = cube[4][1];
            cube[4][1] = cube[4][3];
            cube[4][3] = cube[4][7];
            cube[4][7] = cube[4][5];
            cube[4][5] = temp;

            // Rotate the side faces
            temp = [cube[0][0], cube[0][3], cube[0][6]];
            cube[0][0] = cube[3][8];
            cube[0][3] = cube[3][5];
            cube[0][6] = cube[3][2];
            cube[3][8] = cube[5][0];
            cube[3][5] = cube[5][3];
            cube[3][2] = cube[5][6];
            cube[5][0] = cube[1][0];
            cube[5][3] = cube[1][3];
            cube[5][6] = cube[1][6];
            cube[1][0] = temp[0];
            cube[1][3] = temp[1];
            cube[1][6] = temp[2];
            break;

        case "D":
            // Rotate the bottom face clockwise
            temp = cube[5][0];
            cube[5][0] = cube[5][6];
            cube[5][6] = cube[5][8];
            cube[5][8] = cube[5][2];
            cube[5][2] = temp;
            temp = cube[5][1];
            cube[5][1] = cube[5][3];
            cube[5][3] = cube[5][7];
            cube[5][7] = cube[5][5];
            cube[5][5] = temp;

            // Rotate the side faces
            temp = [cube[1][6], cube[1][7], cube[1][8]];
            for (let i = 0; i < 3; i++) {
                cube[1][6 + i] = cube[4][6 + i];
                cube[4][6 + i] = cube[3][6 + i];
                cube[3][6 + i] = cube[2][6 + i];
                cube[2][6 + i] = temp[i];
            }
            break;

        case "F":
            // Rotate the front face clockwise
            temp = cube[1][6];
            cube[1][6] = cube[1][8];
            cube[1][8] = cube[1][2];
            cube[1][2] = cube[1][0];
            cube[1][0] = temp;
            temp = cube[1][3];
            cube[1][3] = cube[1][7];
            cube[1][7] = cube[1][5];
            cube[1][5] = cube[1][1];
            cube[1][1] = temp;

            // Rotate the side faces
            temp = [cube[0][6], cube[0][7], cube[0][8]];
            cube[0][6] = cube[4][8];
            cube[0][7] = cube[4][5];
            cube[0][8] = cube[4][2];
            cube[4][8] = cube[5][2];
            cube[4][5] = cube[5][1];
            cube[4][2] = cube[5][0];
            cube[5][2] = cube[2][0];
            cube[5][1] = cube[2][3];
            cube[5][0] = cube[2][6];
            cube[2][0] = temp[0];
            cube[2][3] = temp[1];
            cube[2][6] = temp[2];
            break;
        case "B":
            // Rotate the back face clockwise
            temp = cube[3][0];
            cube[3][0] = cube[3][6];
            cube[3][6] = cube[3][8];
            cube[3][8] = cube[3][2];
            cube[3][2] = temp;
            temp = cube[3][1];
            cube[3][1] = cube[3][3];
            cube[3][3] = cube[3][7];
            cube[3][7] = cube[3][5];
            cube[3][5] = temp;

            // Rotate the side faces
            temp = [cube[0][0], cube[0][1], cube[0][2]];
            cube[0][0] = cube[4][2];
            cube[0][1] = cube[4][5];
            cube[0][2] = cube[4][8];
            cube[4][2] = cube[5][6];
            cube[4][5] = cube[5][7];
            cube[4][8] = cube[5][8];
            cube[5][6] = cube[2][0];
            cube[5][7] = cube[2][3];
            cube[5][8] = cube[2][6];
            cube[2][0] = temp[0];
            cube[2][3] = temp[1];
            cube[2][6] = temp[2];
            break;

    }
    displayCube();
}

// 0 = white
// 1 = green
// 2 = red
// 3 = blue
// 4 = orange
// 5 = yellow

function resetCube() {
    cube = [
        [
            0,0,0,
            0,0,0,
            0,0,0
        ],
        [
            1,1,1,
            1,1,1,
            1,1,1
        ],
        [
            2,2,2,
            2,2,2,
            2,2,2
        ],
        [
            3,3,3,
            3,3,3,
            3,3,3
        ],
        [
            4,4,4,
            4,4,4,
            4,4,4
        ],
        [
            5,5,5,
            5,5,5,
            5,5,5
        ],
    ];
}