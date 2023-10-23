import {useState} from 'react';
import './App.css';
import './style.css';

function Square({ value, onSquareClick, className}) {
  return (
    <button 
      className={className}
      onClick={onSquareClick}>
        {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }

  // Win Handling
  // Winning in4
  const winningLine = calculateWinningLine(squares);
  const winner = calculateWinner(squares);

  // Draw case
  let isDraw = true ;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      isDraw = false;
      break;
    }
  }

  // Check who win or draw
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (isDraw) {
    status = "It's a draw!";
  } 
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function renderSquare(i) {
    const isWinningSquare = winningLine && winningLine.includes(i);
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isWinningSquare={isWinningSquare}
        className={isWinningSquare? 'square winning' : 'square'}
      />
    );
  }

  // create board by 2 loop
  const boardSize = 3;
  const board2loop = [];
  for (let row = 0; row < boardSize; row++) {
    const boardRow = [];
    for (let col = 0; col < boardSize; col++){
      boardRow.push(renderSquare(boardSize * row + col));
    }
    board2loop.push(
      <div className="board-row">
        {boardRow}  
    </div>
    );
  } 

  return (
    <>
      <div className="status">{status}</div>
      {board2loop}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [historyLocation, setHistoryLocation] = useState([]);

  function handlePlay(nextSquares, i) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const newHistoryLocation = [...historyLocation];
    newHistoryLocation.push(calcLocation(i));
    setHistoryLocation(newHistoryLocation);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function calcLocation(square){
    const r = Math.floor((square / 3) + 1);
    const c = (square % 3) + 1; 
    return `(${r}, ${c})`;
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === 0) {
      description = "You are at move #" + move;
    }
    else if (move === currentMove) {
        description = "You are at move #" + move + " - " + historyLocation[move - 1];
    }
    else if (move > 0) {
      description = 'Go to move #' + move + " - " + historyLocation[move - 1];
    } else {
      description = 'Go to game start';
    }
    
    return (
      <li key={move}>
        {move === currentMove ? (
          <span>{description}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>)
  });

  // Toggle handling
  const [sort, setAscending] = useState(true);
  const sortHandling = () => {
    setAscending(!sort);
  }

  if (!sort) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={sortHandling}>Sort</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculateWinningLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
