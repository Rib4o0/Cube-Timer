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

const centers = document.querySelectorAll('.center');

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
            cube[3][0] = cube[3][2];
            cube[3][2] = cube[3][8];
            cube[3][8] = cube[3][6];
            cube[3][6] = temp;
            temp = cube[3][1];
            cube[3][1] = cube[3][5];
            cube[3][5] = cube[3][7];
            cube[3][7] = cube[3][3];
            cube[3][3] = temp;

            // Rotate the side faces
            temp = [cube[0][0], cube[0][1], cube[0][2]];
            cube[0][0] = cube[2][6];
            cube[0][1] = cube[2][3];
            cube[0][2] = cube[2][0];
            cube[2][6] = cube[5][8];
            cube[2][3] = cube[5][7];
            cube[2][0] = cube[5][6];
            cube[5][8] = cube[4][2];
            cube[5][7] = cube[4][5];
            cube[5][6] = cube[4][8];
            cube[4][2] = temp[0];
            cube[4][5] = temp[1];
            cube[4][8] = temp[2];
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