import {createChart} from "./chart/chart.js";

// 7.839 NEW RECORD WITH THIS SITE
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
const scrambleDisplayContainer = document.querySelector(".scrambleDisplayContainer");
const times = document.querySelector(".times");
const showHideTimes = document.querySelector(".showHideTimes");
const solveEditPanel = document.querySelector(".solveEditPanel")
const solveClose = document.querySelector(".solveClose");

let timesOpen = "true";

// Settings Buttons, Inputs, and Toggles
let lightMode = "light";
const darkModeBtn = document.querySelector(".dark")
const lightModeBtn = document.querySelector(".light")
const monoModeBtn = document.querySelector(".mono");
let timeDisplayMethod = "full";
const fullModeBtn = document.querySelector(".full")
const wholeModeBtn = document.querySelector(".whole")
const hiddenModeBtn = document.querySelector(".hidden")
let scrambleLength = 10;
const scrLenInput = document.querySelector(".scrambleLength");
let hideElementsWhenSolving = "hide";
const hideElements = document.querySelector(".hideElem");
const showElements = document.querySelector(".showElem");
const graph = document.querySelector(".graph")
const scrambleDisplaySetting = document.querySelector(".scrambleSetting");
const noTool = document.querySelector(".noTool");
let extraTool = "graph";
let dynamicLights = "none";
const fullDynamic = document.querySelector(".fullDynamic");
const partialDynamic = document.querySelector(".partialDynamic");
const noneDynamic = document.querySelector(".noneDynamic");
const ball1 = document.querySelector(".ball1");
const ball2 = document.querySelector(".ball2");
const notification = document.querySelector(".notification");
const notificationText = notification.querySelector(".text");
const resetSession = document.querySelector(".resetSession");


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

let solveTimes = [];
let bestSingleTime = Infinity;
let sessionAverage = 0;

let notifDisplayTime;


let moves = ["U", "L", "R", "F", "D"];
let modifiers = ["", "'", "2"];
let scramble = [];

function generateScramble() {
    resetCube()
    let lastMove = "";
    scramble = [];

    for (let i = 0; i < scrambleLength; i++) {

        let move;
        do {
            move = moves[Math.floor(Math.random() * moves.length)];
        } while (move === lastMove);
        lastMove = move;
        let modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        scramble.push(move + modifier);
    }

    // scramble = ["R", "U'", "R'", "U'", "R", "U", "R", "D", "R'", "U'","R","D'","R'","U2","R'","U'"];
    //U' L' D' F2 L' U2 D' F2 R D2 U' D2 L F D' L2

    // for (let move of scramble) {
    //     let multiplier = 1;
    //     if (move.charAt(move.length - 1) === "2") {
    //         multiplier = 2;
    //     } else if (move.charAt(move.length - 1) === "'") {
    //         multiplier = 3
    //     }
    //     for (let i = 0; i < multiplier; i++) rotateCube(move.charAt(0));
    // }
    let numOfMoves = scramble.length;
    let currentMove = 0;
    let moveExecution = setInterval(() => {
        let move = scramble[currentMove];
        let multiplier = 1;
        if (move.charAt(move.length - 1) === "2") {
            multiplier = 2;
        } else if (move.charAt(move.length - 1) === "'") {
            multiplier = 3
        }
        for (let i = 0; i < multiplier; i++) rotateCube(move.charAt(0));
        currentMove++;
        if (currentMove >= numOfMoves) {clearInterval(moveExecution); }
    },10)

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

monoModeBtn.addEventListener("click", () => {
    lightMode = "mono";
    changeTheme();
    saveSession();
})

darkModeBtn.addEventListener("click", () => {
    lightMode = "dark"
    changeTheme();
    saveSession()
})

lightModeBtn.addEventListener("click", () => {
    lightMode = "light"
    changeTheme();
    saveSession()
})

fullModeBtn.addEventListener("click", () => {
    timeDisplayMethod = "full";
    fullModeBtn.classList.add('selected');
    wholeModeBtn.classList.remove('selected');
    hiddenModeBtn.classList.remove('selected');
    saveSession()
})

wholeModeBtn.addEventListener("click", () => {
    timeDisplayMethod = "whole";
    fullModeBtn.classList.remove('selected');
    wholeModeBtn.classList.add('selected');
    hiddenModeBtn.classList.remove('selected');
    saveSession()
})

hiddenModeBtn.addEventListener("click", () => {
    timeDisplayMethod = "hidden";
    fullModeBtn.classList.remove('selected');
    wholeModeBtn.classList.remove('selected');
    hiddenModeBtn.classList.add('selected');
    saveSession()
})

scrLenInput.addEventListener("input", e => {
    scrambleLength = parseInt(e.target.value);
    if (scrambleLength > 99) scrambleLength = 99
    e.target.value = scrambleLength;
    generateScramble();
    saveSession()
})

hideElements.addEventListener("click", () => {
    hideElementsWhenSolving = "hide";
    hideElements.classList.add("selected");
    showElements.classList.remove("selected");
})

showElements.addEventListener("click", () => {
    hideElementsWhenSolving = "show";
    hideElements.classList.remove("selected");
    showElements.classList.add("selected");
})

graph.addEventListener("click", () => {
    extraTool = "graph"
    chartContainer.classList.remove("permahide");
    scrambleDisplayContainer.classList.add("permahide");
    graph.classList.add("selected");
    scrambleDisplaySetting.classList.remove("selected");
    noTool.classList.remove("selected");
    updateTimesChart();
})

scrambleDisplaySetting.addEventListener("click", () => {
    extraTool = "scramble"
    chartContainer.classList.add("permahide");
    scrambleDisplayContainer.classList.remove("permahide");
    graph.classList.remove("selected");
    scrambleDisplaySetting.classList.add("selected");
    noTool.classList.remove("selected");
})

noTool.addEventListener("click", () => {
    extraTool = "none"
    chartContainer.classList.add("permahide");
    scrambleDisplayContainer.classList.add("permahide");
    graph.classList.remove("selected");
    scrambleDisplaySetting.classList.remove("selected");
    noTool.classList.add("selected");
})

showHideTimes.addEventListener("click", () => {
    if (timesOpen === "true") timesOpen = "false";
    else timesOpen = "true"
    displayTimes()
    saveSession()
})

fullDynamic.addEventListener("click", () => {
    dynamicLights = "full";
    changeTheme();
    saveSession()
})

partialDynamic.addEventListener("click", () => {
    dynamicLights = "partial";
    changeTheme();
    saveSession()
})

noneDynamic.addEventListener("click", () => {
    dynamicLights = "none";
    changeTheme();
    saveSession()
})

resetSession.addEventListener("click", () => {
        lightMode = "light";
        timeDisplayMethod = "full";
        scrambleLength = 20;
        extraTool = "graph"
        hideElementsWhenSolving = true;
        solveTimes = [];
        saveSession()
    location.reload();
})

solveClose.addEventListener("click", () => {
    solveEditPanel.classList.remove("show");
    darker.classList.remove('show');
})

function displayTimes() {
    if (timesOpen === "true") {
        times.classList.add("show");
        showHideTimes.textContent = "Hide times";
    } else {
        times.classList.remove("show");
        showHideTimes.textContent = "Show times";
    }
}

function changeTheme() {
    document.documentElement.style.setProperty("--solid-background", "#0D0D0D");
    document.documentElement.style.setProperty("--background", "#0D0D0D");
    document.documentElement.style.setProperty("--border", "#191919");
    document.documentElement.style.setProperty("--text", "#fff");
    document.documentElement.style.setProperty("--lighter-shade", "#222222");
    document.documentElement.style.setProperty("--accent", "#3232ff");
    document.documentElement.style.setProperty("--ready", "#3fdf41");
    document.documentElement.style.setProperty("--not-ready", "#ff2b2b");
    if (lightMode === "dark") {
        if (dynamicLights === "full")  {
            document.documentElement.style.setProperty("--background", "rgba(13,13,13,0.39)");
            document.documentElement.style.setProperty("--border", "rgba(13,13,13,0)");
        } else {
            document.documentElement.style.setProperty("--background", "#0D0D0D");
            document.documentElement.style.setProperty("--border", "#191919");
        }
        document.documentElement.style.setProperty("--text", "#fff");
        document.documentElement.style.setProperty("--lighter-shade", "#222222");
        darkModeBtn.classList.add("selected");
        lightModeBtn.classList.remove("selected");
        monoModeBtn.classList.remove('selected');
    } else if (lightMode === "light") {
        document.documentElement.style.setProperty("--solid-background", "#F8FAFFFF");
        if (dynamicLights === "full")  {
            document.documentElement.style.setProperty("--background", "rgba(248,250,255,0.63)");
            document.documentElement.style.setProperty("--border", "rgba(13,13,13,0)");
        }
        else {
            document.documentElement.style.setProperty("--background", "rgb(248,250,255)");
            document.documentElement.style.setProperty("--border", "#dddddd");
        }
        document.documentElement.style.setProperty("--text", "#000");
        document.documentElement.style.setProperty("--lighter-shade", "#e1e1e1");
        darkModeBtn.classList.remove("selected");
        lightModeBtn.classList.add("selected");
        monoModeBtn.classList.remove('selected');
    } else if (lightMode === "mono") {
        document.documentElement.style.setProperty("--solid-background", "#0D0D0D");
        if (dynamicLights === "full")  {
            document.documentElement.style.setProperty("--background", "rgba(13,13,13,0.39)");
            document.documentElement.style.setProperty("--border", "rgba(13,13,13,0)");
        }
        else {
            document.documentElement.style.setProperty("--background", "rgb(13,13,13)");
            document.documentElement.style.setProperty("--border", "#0d0d0d");
        }
        document.documentElement.style.setProperty("--text", "#fff");
        document.documentElement.style.setProperty("--lighter-shade", "#222");
        document.documentElement.style.setProperty("--accent", "#80d581");
        document.documentElement.style.setProperty("--ready", "#80d581");
        document.documentElement.style.setProperty("--not-ready", "#575757");
        darkModeBtn.classList.remove("selected");
        lightModeBtn.classList.remove("selected");
        monoModeBtn.classList.add('selected');
    }

    fullDynamic.classList.remove("selected");
    partialDynamic.classList.remove("selected");
    noneDynamic.classList.remove("selected");
    if (dynamicLights === "full" || dynamicLights === "partial") {
        document.documentElement.style.setProperty("--dynamic-lights-opacity", 1);
        if (dynamicLights === "full") fullDynamic.classList.add("selected");
        else partialDynamic.classList.add("selected");
    } else {
        document.documentElement.style.setProperty("--dynamic-lights-opacity", "0");
        noneDynamic.classList.add("selected");
    }
}

let spacePressed = false;
let timerReady = false;
let timing = false;
let startTime
let updateTimerInterval

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
                solveTimes.push({time: finalTime.seconds * 1000 + finalTime.milliseconds, modifiers: {plusTwo: false, dnf: false}, scramble: scramble.join(" ")});
                if (finalTime.seconds * 1000 + finalTime.milliseconds < bestSingleTime) {
                    bestSingleTime = finalTime.seconds * 1000 + finalTime.milliseconds;
                    celebratePB("bs");
                }
                if (hideElementsWhenSolving) {
                    header.classList.remove("hide");
                    chartContainer.classList.remove("hide");
                    avgTimes.classList.remove("hide");
                    scrambleDisplayContainer.classList.remove("hide")
                    times.classList.remove("hide");
                    showHideTimes.classList.remove  ("hide");
                }
                updateSessionAverage()
                updateSolvesList()
                updateAverages()
                updateTimesChart()
                generateScramble();
                saveSession();
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
                    scrambleDisplayContainer.classList.add("hide")
                    times.classList.add("hide");
                    showHideTimes.classList.add("hide");
                }
                updateTimerInterval = setInterval(() => {
                    if (timeDisplayMethod === "full") {
                        timeText.textContent = getElapsedTime().seconds + "." + (getElapsedTime().milliseconds.toString().substring(0,1));
                    } else if (timeDisplayMethod === "whole") {
                        timeText.textContent = getElapsedTime().seconds.toString();
                    } else if ("hidden") {
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
    let timesArr = [];
    for (let solve of solveTimes) {
        timesArr.push(solve.time);
    }
    createChart(timesArr, "Solve Times", false, chartContainer);
}

function saveSession() {
    try {
        localStorage.setItem("lightMode", lightMode);
        localStorage.setItem("timeDisplayMethod", timeDisplayMethod);
        localStorage.setItem("scrambleLength", scrambleLength);
        localStorage.setItem("extraTool", extraTool);
        localStorage.setItem("hideElementsWhenSolving", hideElementsWhenSolving);
        localStorage.setItem("Solves", JSON.stringify(solveTimes));
        localStorage.setItem("timesOpen", timesOpen);
        localStorage.setItem("dynamicLights", dynamicLights);
    } catch (e) {
        console.error("Error saving to localStorage", e);
    }
}

function loadSettings() {
    try {
        if (localStorage.getItem("lightMode")) {
            lightMode = localStorage.getItem("lightMode");
            timeDisplayMethod = localStorage.getItem("timeDisplayMethod");
            scrambleLength = localStorage.getItem("scrambleLength");
            extraTool = localStorage.getItem("extraTool");
            hideElementsWhenSolving = localStorage.getItem("hideElementsWhenSolving");
            solveTimes = JSON.parse(localStorage.getItem("Solves"));
            timesOpen = localStorage.getItem("timesOpen");
            dynamicLights = localStorage.getItem("dynamicLights");

            applySettings();
        } else {
            saveSession();
        }
        scrLenInput.value = scrambleLength;
        updateSessionAverage()
        generateScramble();
        changeTheme();
    } catch (e) {
        console.error("Error loading from localStorage", e);
    }
}

function applySettings() {
    if (timeDisplayMethod === "whole") {
        wholeModeBtn.click();
    } else if (timeDisplayMethod === "hidden") {
        hiddenModeBtn.click();
    }

    if (extraTool === "graph") {
        extraTool = "graph"
        chartContainer.classList.remove("permahide");
        scrambleDisplayContainer.classList.add("permahide");
        graph.classList.add("selected");
        scrambleDisplaySetting.classList.remove("selected");
        noTool.classList.remove("selected");
        updateTimesChart();
    } else if (extraTool === "scramble") {
        extraTool = "scramble"
        chartContainer.classList.add("permahide");
        scrambleDisplayContainer.classList.remove("permahide");
        graph.classList.remove("selected");
        scrambleDisplaySetting.classList.add("selected");
        noTool.classList.remove("selected");
    } else if (extraTool === "none") {
        extraTool = "none"
        chartContainer.classList.add("permahide");
        scrambleDisplayContainer.classList.add("permahide");
        graph.classList.remove("selected");
        scrambleDisplaySetting.classList.remove("selected");
        noTool.classList.add("selected");
    }

    if (hideElementsWhenSolving === "hide") {
        hideElements.click();
    } else {
        showElements.click();
    }

    for (let solve of solveTimes) {
        let time = solve.time;
        if (solve.modifiers.plusTwo) time += 2000;
        if (solve.modifiers.dnf) time = NaN;
        if (time < bestSingleTime) bestSingleTime = time;
    }

    // celebratePB("bs")
    displayTimes();
    updateSolvesList()
    updateAverages();
}


function updateAverages() {
    if (solveTimes === []) return;
    let bestSolve = Infinity;
    for (let solve of solveTimes) {
        let editedSolve = solve.time
        if (solve.modifiers.plusTwo) editedSolve = solve + 2000;
        if (solve.modifiers.dnf) editedSolve = NaN;
        console.log(solve)
        if (editedSolve < bestSolve) {
            bestSolve = editedSolve;
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
            let editedSolve = solveTimes[i].time;
            if (solveTimes[i].modifiers.plusTwo) editedSolve = solveTimes[i].time + 2000;
            if (solveTimes[i].modifiers.dnf) editedSolve = NaN;
            lastSolves.push(editedSolve);
        }
        let sumOfSolves = 0;
        for (let solve of lastSolves) {
            sumOfSolves += solve;
        }
        if (isNaN(sumOfSolves)) {
            mean3.textContent = "Mean of 3: DNF";
        } else {
            let meanOf3 = sumOfSolves / 3000;
            let rounded = Math.floor(meanOf3 * 1000)/1000;
            mean3.textContent = "Mean of 3: " + rounded;
        }
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
            let editedSolve = solveTimes[i].time;
            if (solveTimes[i].modifiers.plusTwo) editedSolve = solveTimes[i].time + 2000;
            if (solveTimes[i].modifiers.dnf) editedSolve = NaN;
            lastSolves.push(editedSolve);
            if (editedSolve > worstSolve || isNaN(editedSolve)) worstSolve = editedSolve;
            if (editedSolve < bestSolve) bestSolve = editedSolve;
        }
        let sumOfSolves = 0;
        let dnfs = 0;
        for (let solve of lastSolves) {
            if (!isNaN(solve)) sumOfSolves += solve;
            else dnfs++;
        }
        sumOfSolves -= bestSolve;
        sumOfSolves -= worstSolve;
        let avgOf12 = sumOfSolves / 10000;
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

window.addEventListener("click", saveSession)

function updateSolvesList() {
    times.innerHTML = "";
    const displaySolve = document.createElement("div");
    displaySolve.classList.add("solve");
    displaySolve.innerHTML = '<div class="num">Num</div>\n' +
        '            <div class="solveTime">Time</div>\n' +
        '            <div class="mo3">Mo3</div>\n' +
        '            <div class="ao5">Ao5</div>\n' +
        '            <div class="ao12">Ao12</div>\n';
    times.appendChild(displaySolve);
    let bestSingleSolve = Infinity;
    let bestMeanOf3 = Infinity;
    let bestAvgOf5 = Infinity;
    let bestAvgOf12 = Infinity;
    let worstSingleSolve = -Infinity;
    let worstMeanOf3 = -Infinity;
    let worstAvgOf5 = -Infinity;
    let worstAvgOf12 = -Infinity;
    let indexBS = -1;
    let indexMO3 = -1;
    let indexAO5 = -1;
    let indexAO12 = -1;
    let indexWS = -1;
    let indexWMO3 = -1;
    let indexWAO5 = -1;
    let indexWAO12 = -1;
    for (let i = solveTimes.length - 1; i >= 0; i--) {
        let solveTimeOriginal = solveTimes[i].time;
        let ogST = solveTimeOriginal;
        if (solveTimes[i].modifiers.plusTwo) solveTimeOriginal += 2000;
        if (solveTimes[i].modifiers.dnf) solveTimeOriginal = NaN;
        const displaySolve = document.createElement("div");
        displaySolve.classList.add("solve");
        const num = document.createElement("div");
        num.classList.add('num');
        num.textContent = (i+1).toString();
        displaySolve.appendChild(num);
        times.appendChild(displaySolve);
        const solveTime = document.createElement("div");
        solveTime.classList.add("solveTime");
        if (isNaN(solveTimeOriginal)) solveTime.textContent = "DNF";
        else solveTime.textContent = Math.floor(solveTimeOriginal / 1000) + "." + solveTimeOriginal %1000;
        if (bestSingleSolve > solveTimeOriginal)  {
            bestSingleSolve = solveTimeOriginal;
            indexBS = i;
        }
        if (worstSingleSolve < solveTimeOriginal || isNaN(solveTimeOriginal)) {
            worstSingleSolve = solveTimeOriginal;
            indexWS = i;
        }
        displaySolve.appendChild(solveTime);
        let lastNSolves = [];
        let avg = 0;
        const mo3 = document.createElement("div");
        mo3.textContent = "-";
        if (i + 1 >= 3) {
            for (let j = 2; j >= 0; j--) {
                let solve = solveTimes[i-j];
                if (solve === undefined) break;
                let solveTimeNum = solve.time;
                if (solve.modifiers.plusTwo) solveTimeNum += 2000;
                if (solve.modifiers.dnf) solveTimeNum = NaN;
                lastNSolves.push(solveTimeNum);
            }
            for (let n = 0; n < lastNSolves.length; n++) {
                avg += lastNSolves[n];
            }
            if (bestMeanOf3 > avg) {
                bestMeanOf3 = avg;
                indexMO3 = i;
            }
            if (worstMeanOf3 < avg || isNaN(avg)) {
                worstMeanOf3 = avg;
                indexWMO3 = i;
            }
            avg /= 3000;
            if (isNaN(avg)) mo3.textContent = "DNF";
            else mo3.textContent = reduceLength(avg, 3);
        }
        mo3.classList.add("mo3");
        displaySolve.appendChild(mo3);
        lastNSolves = [];
        const ao5 = document.createElement("div");
        ao5.textContent = "-";
        if (i + 1 >= 5) {
            let bestSolve = Infinity;
            let worstSolve = -Infinity;
            avg = 0;
            let dnfs = 0;
            for (let j = 4; j >= 0; j--) {
                let solve = solveTimes[i-j];
                let solveTimeNum = solve.time;
                if (solve.modifiers.plusTwo) solveTimeNum += 2000;
                if (solve.modifiers.dnf) solveTimeNum = NaN;
                if (solveTimeNum > worstSolve || isNaN(solveTimeNum)) worstSolve = solveTimeNum;
                if (solveTimeNum < bestSolve) bestSolve = solveTimeNum;
                if (isNaN(solveTimeNum)) dnfs++;
                else avg += solveTimeNum;
            }
            if (dnfs <= 1) {
                if (dnfs < 1) avg -= worstSolve;
                avg -= bestSolve;
                avg /= 3000;
                if (avg < bestAvgOf5) {
                    bestAvgOf5 = avg;
                    indexAO5 = i;
                }
                if (worstAvgOf5 < avg) {
                    worstAvgOf5 = avg;
                    indexWAO5 = i;
                }
                ao5.textContent = reduceLength(avg, 3);
            } else {
                worstAvgOf5 = NaN;
                indexWAO5 = i;
                ao5.textContent = "DNF";
            }
        }
        ao5.classList.add("ao5");
        displaySolve.appendChild(ao5);
        const ao12 = document.createElement("div");
        ao12.textContent = "-";
        if (i + 1 >= 12) {
            let bestSolve = Infinity;
            let worstSolve = -Infinity;
            avg = 0;
            let dnfs = 0;
            for (let j = 11; j >= 0; j--) {
                let solve = solveTimes[i-j];
                let solveTimeNum = solve.time;
                if (solve.modifiers.plusTwo) solveTimeNum += 2000;
                if (solve.modifiers.dnf) solveTimeNum = NaN;
                if (solveTimeNum > worstSolve || isNaN(solveTimeNum)) worstSolve = solveTimeNum;
                if (solveTimeNum < bestSolve) bestSolve = solveTimeNum;
                if (isNaN(solveTimeNum)) dnfs++;
                else avg += solveTimeNum;
            }
            if (dnfs <= 1) {
                if (dnfs < 1) avg -= worstSolve;
                avg -= bestSolve;
                avg /= 10000;
                if (avg < bestAvgOf12) {
                    bestAvgOf12 = avg;
                    indexAO12 = i;
                }
                if (worstAvgOf12 < avg) {
                    worstAvgOf12 = avg;
                    indexWAO12 = i;
                }
                ao12.textContent = reduceLength(avg, 3);
            } else {
                worstAvgOf12 = NaN;
                indexWAO12 = i;
                ao12.textContent = "DNF";
            }
        }
        ao12.classList.add("ao12");
        displaySolve.appendChild(ao12);

        displaySolve.dataset.index = i;

        displaySolve.addEventListener("click", () => {
            solveEditPanel.classList.add("show");
            darker.classList.add('show')
            let title = solveEditPanel.querySelector('.title');
            title.textContent = "Solve " + (i + 1);
            let solveTimeText = solveEditPanel.querySelector('.solveTime');
            let compToAvg = solveEditPanel.querySelector('.compToAvg');
            solveTimeText.textContent = ogST / 1000;
            let amount = solveEditPanel.querySelector('.amount');
            let modifier = solveEditPanel.querySelector('.modifier');
            modifier.textContent = "";
            if (solveTimes[i].modifiers.plusTwo) modifier.textContent = "+2";
            if (solveTimes[i].modifiers.dnf) modifier.textContent = "DNF";
            let sesDif = ((ogST - reduceLength(sessionAverage,0))/ 1000)
            let posNegSesDif = sesDif > 0;
            amount.textContent = posNegSesDif ? "+" + sesDif : sesDif;
            compToAvg.classList.remove("better");
            compToAvg.classList.remove("worse");
            if (posNegSesDif) {
                compToAvg.classList.add('worse');
            } else {
                compToAvg.classList.add("better")
            }
            let text = solveEditPanel.querySelector('.text');
            text.textContent = posNegSesDif ? "Above session average" : "Below session average"
            let mo3Text = solveEditPanel.querySelector('.atmo3').querySelector('.timeText');
            mo3Text.textContent = mo3.textContent;
            let ao5Text = solveEditPanel.querySelector('.atao5').querySelector('.timeText');
            ao5Text.textContent = ao5.textContent;
            let ao12Text = solveEditPanel.querySelector('.atao12').querySelector('.timeText');
            ao12Text.textContent = ao12.textContent;
            const OKBtn = solveEditPanel.querySelector('.ok');
            OKBtn.dataset.index = i;
            OKBtn.addEventListener("click", () => {
                solveTimes[parseInt(OKBtn.dataset.index)].modifiers.plusTwo = false;
                solveTimes[parseInt(OKBtn.dataset.index)].modifiers.dnf = false;
                updateSolvesList();
                updateAverages();
                updateTimesChart()
                solveClose.click();
            });
            const plus2Btn = solveEditPanel.querySelector('.plus2');
            plus2Btn.addEventListener("click", () => {
                solveTimes[parseInt(OKBtn.dataset.index)].modifiers.plusTwo = true;
                solveTimes[parseInt(OKBtn.dataset.index)].modifiers.dnf = false;
                updateSolvesList();
                updateAverages();
                updateTimesChart()
                solveClose.click();
            })
            const dnfBtn = solveEditPanel.querySelector('.dnf');
            dnfBtn.addEventListener("click", () => {
                solveTimes[parseInt(OKBtn.dataset.index)].modifiers.plusTwo = false;
                solveTimes[parseInt(OKBtn.dataset.index)].modifiers.dnf = true;
                updateSolvesList();
                updateAverages();
                solveClose.click();
                updateTimesChart()
            })
            const delBtn = solveEditPanel.querySelector(".del");
            delBtn.addEventListener("click", () => {
                solveTimes.splice(parseInt(OKBtn.dataset.index), 1)
                updateSolvesList();
                updateAverages();
                solveClose.click();
                updateTimesChart()
            })
        })
    }
    if (indexBS !== -1) {
        const bbsParent = times.children[solveTimes.length - indexBS];
        const bbs = bbsParent.querySelector(".solveTime");
        bbs.classList.add("ready");
    }
    if (indexMO3 !== -1) {
        const bm3Parent = times.children[solveTimes.length - indexMO3];
        const bm3 = bm3Parent.querySelector(".mo3");
        bm3.classList.add("ready");
    }
    if (indexAO5 !== -1) {
        const ba5Parent = times.children[solveTimes.length - indexAO5];
        const ba5 = ba5Parent.querySelector(".ao5");
        ba5.classList.add("ready");
    }
    if (indexAO12 !== -1) {
        const ba12Parent = times.children[solveTimes.length - indexAO12];
        const ba12 = ba12Parent.querySelector(".ao12");
        ba12.classList.add("ready");
    }
    if (indexWS !== -1) {
        const wwsParent = times.children[solveTimes.length - indexWS];
        const wws = wwsParent.querySelector(".solveTime");
        wws.classList.add("gettingReady");
    }
    if (indexWMO3 !== -1) {
        const wm3Parent = times.children[solveTimes.length - indexWMO3];
        const wm3 = wm3Parent.querySelector(".mo3");
        wm3.classList.add("gettingReady");
    }
    if (indexWAO5 !== -1) {
        const wa5Parent = times.children[solveTimes.length - indexWAO5];
        const wa5 = wa5Parent.querySelector(".ao5");
        wa5.classList.add("gettingReady");
    }
    if (indexWAO12 !== -1) {
        const wa12Parent = times.children[solveTimes.length - indexWAO12];
        const wa12 = wa12Parent.querySelector(".ao12");
        wa12.classList.add("gettingReady");
    }
}

function reduceLength(num, length) {
    let mult = 10 ** length;
    return (Math.floor(num * mult))/mult;
}

celebratePB("bs")

function celebratePB(type) {
    let text = "";
    switch (type) {
        case "ao12":
            break;
        case "ao5":
            break;
        case "bs":
            text = "New best single: " +  (Math.floor(bestSingleTime / 1000)) + "." + (bestSingleTime %1000);
            break;
        case "mo3":
    }
    notificationText.textContent = text;
    notification.classList.add("showNotif");
    notifDisplayTime = 500;
    let notifInterval = setInterval(() => {
        if (notifDisplayTime % (20-1) === 1) {
            let colors = ["#27a8ff", "#d839b5", "#f3bf13", "#39d8a0"]
            document.documentElement.style.setProperty("--accent", colors[Math.floor(Math.random() * colors.length)]);
            // document.documentElement.style.setProperty("--ready", "#3fdf41");
            document.documentElement.style.setProperty("--not-ready", colors[Math.floor(Math.random() * colors.length)]);
            // ball1.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            // ball2.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        }
        if (notifDisplayTime <= 0) {
            notification.classList.remove("showNotif");
            // ball1.style.backgroundColor = "var(--accent)";
            // ball2.style.backgroundColor = "var(--not-ready)";
            changeTheme()
            clearInterval(notifInterval);
        }
        notifDisplayTime--;
    },1)
}
// Thanks for showing me love - Lili
// Ros - I should be thanking you

function updateSessionAverage() {
    let totalSum = 0;
    for (let solve of solveTimes) {
        let solveTime = solve.time;
        if (solve.modifiers.plusTwo) solveTime += 2000;
        totalSum += solveTime;
    }
    sessionAverage = totalSum / solveTimes.length;
}