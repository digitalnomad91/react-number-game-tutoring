const GameInfo = (props) => {
    return (
      <div>
        <hr></hr>
        <h3>Status: {props.gameStatus}</h3>
        <h3>Timer: {props.elapsedTime} seconds</h3>
        <button className="resetBtn ml-2 btn btn-outline-secondary" onClick={e => props.resetGame()}>Reset Game</button> 
      </div>
    );
}

export default GameInfo