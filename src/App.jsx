import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || '/api/game';

function App() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`${API}/questions`)
      .then(r => r.json())
      .then(data => setQuestions(data.questions || []));
  }, []);

  const submit = () => {
    fetch(`${API}/answer/${current}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer })
    })
      .then(r => r.json())
      .then(data => {
        setResult(data);
        if (data.correct) setScore(s => s + 1);
      });
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
      setAnswer('');
      setResult(null);
    }
  };

  if (questions.length === 0) {
    return <div style={styles.center}>Loading...</div>;
  }

  if (done) {
    return (
      <div style={styles.center}>
        <h1>Game Over!</h1>
        <h2>Score: {score} / {questions.length}</h2>
        <button style={styles.btn}
          onClick={() => window.location.reload()}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.center}>
      <h1>🎮 Quiz Game</h1>
      <p>Score: {score} | Question {current + 1}/{questions.length}</p>
      <div style={styles.card}>
        <h2>{questions[current]?.question}</h2>
        <input
          style={styles.input}
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Your answer..."
          onKeyPress={e => e.key === 'Enter' && submit()}
        />
        <button style={styles.btn} onClick={submit}>
          Submit
        </button>
        {result && (
          <div style={{
            color: result.correct ? 'green' : 'red',
            marginTop: 10
          }}>
            {result.correct ? '✅ Correct!' : `❌ Answer: ${result.correctAnswer}`}
            <br />
            <button style={styles.btn} onClick={next}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  center: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', fontFamily: 'Arial, sans-serif',
    background: '#f0f0f0'
  },
  card: {
    background: 'white', padding: 30,
    borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    minWidth: 400, textAlign: 'center'
  },
  input: {
    width: '80%', padding: 10,
    fontSize: 16, marginBottom: 10,
    border: '1px solid #ccc', borderRadius: 5
  },
  btn: {
    background: '#4CAF50', color: 'white',
    border: 'none', padding: '10px 20px',
    fontSize: 16, borderRadius: 5,
    cursor: 'pointer', margin: 5
  }
};

export default App;
