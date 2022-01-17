import react, { useEffect, useState, useCallback } from 'react';
import './App.css';
import IntButton from './components/IntButton'
import GameInfo from './components/GameInfo'

function App() {

  const totalNumbers = 6;
  const ints = Array.from(Array(totalNumbers),(x,i)=>i+1);
  var even_ints = ints.filter(number => number % 2 === 0);
  var odd_ints = ints.filter(number => number % 2 !== 0);

  /* Setup immutable component state for even & odd integer lists */
  const [evens, setEvens] = react.useState(even_ints);
  const [odds, setOdds] = react.useState(odd_ints);

   /* Setup immutable component state for last_number_clicked & total_clicks */
   const [nextIntToClick, setnextIntToClick] = react.useState(1);
   const [totalEvenClicks, setTotalEvenClicks] = react.useState(0);
   const [totalOddClicks, setTotalOddClicks] = react.useState(0);

  /* Setup immutable component state for gameStatus & gameTimer */
  const [gameStatus, setGameStatus] = react.useState("Ready to start");
  const [elapsedTime, setElapsedTime] = react.useState();

  /* Call back function to shuffle buttons in either even / odd array */
  const shuffleInts = useCallback(
    (intArr) => {
      if(intArr[0] % 2 === 0) { //if array is even numbers shuffle evens
        const newEvens = [...evens].sort( () => .5 - Math.random() );
        setEvens(newEvens);
      }
      if(intArr[0] % 2 !== 0) { //if array is odd numbers shuffle odds
        const newOdds = [...odds].sort( () => .5 - Math.random() );
        setOdds(newOdds);
      }
    },
    [evens, odds, setEvens, setOdds],
  );

  /* Click integer button callback */
  const clickIntBtn = (e, clickedInt) => {
    if(clickedInt % 2 === 0) setTotalEvenClicks(totalEvenClicks+1); //update even column click count
    if(clickedInt % 2 !== 0) setTotalOddClicks(totalOddClicks+1); //update odd column click count

    //first button clicked start timer
    if(clickedInt === 1) startTimer();
    
    if(clickedInt === nextIntToClick) { //correct button clicked
      setGameStatus("Correct");
      e.target.classList.add(...["btn-success","text-white"]);
      setnextIntToClick(nextIntToClick+1);
      //if correct value is last integer then the game is won
      if(clickedInt === (ints.length)) {
        endGame();
      }
    } else { //incorrect button clicked, shuffle that column
      setGameStatus("Incorrect");
      (clickedInt % 2 === 0 ? shuffleInts(evens) : shuffleInts(odds)); //shuffle numbers in clicked column
    }
  }
  
  /* Start Timer interval  */
  const startTimer = () => {
     var start = new Date().getTime();
     window.timer = window.setInterval(() => {
      var curTime = new Date().getTime();
      setElapsedTime(((curTime - start)/1000).toFixed(2))
    }, 100);
  }

  /* Reset Game button click  */
  const resetGame = () => {
    //shuffle columns
    shuffleInts(evens);
    shuffleInts(odds);

    //reset game values
    setnextIntToClick(1);
    setTotalEvenClicks(0);
    setTotalOddClicks(0);
    setGameStatus("Ready to start");
    setElapsedTime(0);

    //reset all buttons background color
    document.querySelectorAll(".oddInt, .evenInt").forEach(btn => btn.classList.remove(...["btn-success","text-white"]) );
  }

  /* Start Game button click  */
  const endGame = () => {
    //stop timner
    window.clearInterval(window.timer);
    //Update status & calculate click accuracy score
    setGameStatus("Game Finished - "+(((totalNumbers-1)/(totalEvenClicks+totalOddClicks))*100).toFixed(2)+"% accuracy");
  }

// Similar to componentDidMount and componentDidUpdate. run shuffle function once after initial render
  const [didLoad, setDidLoad] = useState(false);
  useEffect(() => {
      //Shuffle each column initially on app load
      if (!didLoad) {
        shuffleInts(evens);
        shuffleInts(odds);
        setDidLoad(true);
      }
  }, [didLoad, evens, odds, shuffleInts]);
  

  /* Render our react app & all components */
 return (
  <div className="container">
      <div className="row">
        <div className="col">
            <h1 className="mb-4">Odd Numbers ({totalOddClicks} clicks)</h1>
            <div>
              {odds.map((i, index) => (
                <span>
                    <IntButton
                    key={i}
                    index={i}
                    clickIntBtn={clickIntBtn}
                    />
                </span>
              ))}
            </div>
        </div>
        <div className="col">
            <h1 className="mb-4">Even Numbers ({totalEvenClicks} clicks)</h1>
            <div>
              {evens.map((i, index) => (
                  <span>
                      <IntButton
                      key={i}
                      index={i}
                      clickIntBtn={clickIntBtn}
                      />
                  </span>
              ))}
            </div>
        </div>
        <GameInfo
            resetGame={resetGame}
            gameStatus={gameStatus}
            elapsedTime={elapsedTime}
          />
      </div>

  </div>
 );
}

export default App;
