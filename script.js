const board = document.querySelector(".board");
const rows = 8;
const columns = 8;
const mines = 10;
const numberOfCells = rows * columns;

const boardArray = [];
const flagArray = [];
const mineArray = [];


//crear tabla con celdas
function createBoard() {
    for (let row = 0; row < rows; row++) {
        const rowArray = [];
        for (let col = 0; col < columns; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("data-row", row);
            cell.setAttribute("data-column", col);
            cell.textContent = "";
            board.appendChild(cell);
            rowArray.push({ isMine: false, revealed: false });

            cell.addEventListener("click", (event) => {
                clickOnCell(row, col, event);
            });
            cell.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                placeFlag(row, col);
            });
        };
        boardArray.push(rowArray);
    };
};

createBoard();
placeMines();

//colocar bombas aleatorias
function placeMines(){
    while (mineArray.length < mines){
        const randomRow = Math.floor(Math.random() * rows);
        const randomColumn = Math.floor(Math.random() * columns);
        if (!boardArray[randomRow][randomColumn].isMine) {
            boardArray[randomRow][randomColumn].isMine = true;
            mineArray.push({row: randomRow, column: randomColumn});
        };
    };
};

//click para bombas y click derecho para banderas
function clickOnCell(row, col, event){
    const cell = boardArray[row][col];
    const cellElement = document.querySelector(`[data-row="${row}"][data-column="${col}"]`);
    const rightClick = 2;
    
    if (event.button === rightClick){
        placeFlag(row, col);
    }else if (cell.isMine){
        cellElement.innerHTML = "💣";
        mineArray.forEach(mine => {
            const {row: mineRow, column: mineCol} = mine
            const mineCellElement = document.querySelector(`[data-row="${mineRow}"][data-column="${mineCol}"]`);
            mineCellElement.innerHTML = "💣";
            mineCellElement.classList.add("mineCellRevealed")
        });
        alert("¡Has perdido!");

    } else {
        if(!cell.revealed){
            const adjacentMines = countAdjacentMines(row, col);
            if(adjacentMines >= 0){
                cellElement.innerHTML = adjacentMines;
                cellElement.classList.add("cellWithNumber")
                         
            }
            cell.revealed = true;
        };
    };
};

//contar las minas adyacentes a cada celda
function countAdjacentMines(row, col){
    let count = 0;
    for (let r = -1; r <= 1; r++){
        for(let c = -1; c <= 1; c++){
            const newRow = row + r;
            const newCol = col + c;
            if(newRow>=0 && newRow<rows && newCol>=0 && newCol<columns && boardArray[newRow][newCol].isMine){
                count++
            };
        };
    };
    return count;
};

//colocar banderas
function placeFlag(row, col){
    const cell = boardArray[row][col];
    const cellElement = document.querySelector(`[data-row="${row}"][data-column="${col}"]`);
    if(!cell.revealed){
        if(cellElement.innerHTML===""){
            cellElement.innerHTML="🚩";
            cellElement.classList.add("cellFlag");
            flagArray.push({row,col});
        } else { //quitar banderas
            cellElement.innerHTML = "";
            const index = flagArray.findIndex(cell => cell.row === row && cell.col === col);
            if (index !== -1) {
                flagArray.splice(index, 1);
            };
            cellElement.classList.remove("cellFlag");
        };
        if(flagArray.length>mines){
            alert("Has superado el número de banderas.");
            cellElement.innerHTML = "";
            cellElement.classList.remove("cellFlag");
        };
    };
    countFlags();
};

//comprobar banderas
function chekFlags() {
    const correctFlags = flagArray.every(cell => boardArray[cell.row][cell.col].isMine);
    if(correctFlags){
        alert("¡Has ganado! Enhorabuena, has colocado todas las banderas en su lugar.");
    } else {
        alert("¡Has perdido! Las banderas no están colocadas en todas las bombas. Inténtalo de nuevo");
        resetGame(); 
    };
};

//botón comprobar
const checkButton = document.querySelector(".checkButton");
checkButton.addEventListener("click", chekFlags);

//botón reiniciar
function resetGame (){
    board.innerHTML = "";

    boardArray.length = 0;
    flagArray.length = 0;
    mineArray.length = 0; 

    createBoard();
    placeMines();
    countFlags();
};

const resetButton = document.querySelector(".resetButton");
resetButton.addEventListener("click", resetGame);

//contador banderas
function countFlags() {
    const maxFlag = 10; // Máximo de banderas permitidas
    const countFlagsElement = document.querySelector(".countFlags");
    const displayedFlags = Math.min(flagArray.length, maxFlag);
    countFlagsElement.textContent = `Banderas colocadas: ${displayedFlags}`;
};
