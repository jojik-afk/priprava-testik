// @title Linear Equations Practice
// @subject Math
// @topic Algebra
// @template practice

import { useState, useCallback } from 'react';

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  card: {
    maxWidth: '500px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    padding: '40px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2em',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#666',
    fontSize: '1.1em',
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '30px',
  },
  stat: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#667eea',
  },
  statLabel: {
    fontSize: '0.9em',
    color: '#888',
  },
  problem: {
    background: '#f8f9ff',
    borderRadius: '15px',
    padding: '30px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  equation: {
    fontSize: '2.5em',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  label: {
    fontSize: '1.5em',
    color: '#333',
  },
  input: {
    width: '100px',
    fontSize: '1.5em',
    padding: '10px 15px',
    borderRadius: '10px',
    border: '2px solid #ddd',
    textAlign: 'center',
    outline: 'none',
  },
  inputCorrect: {
    borderColor: '#4CAF50',
    background: '#e8f5e9',
  },
  inputIncorrect: {
    borderColor: '#f44336',
    background: '#ffebee',
  },
  button: {
    width: '100%',
    padding: '15px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  feedback: {
    textAlign: 'center',
    marginTop: '20px',
    padding: '15px',
    borderRadius: '10px',
    fontSize: '1.1em',
    fontWeight: 'bold',
  },
  feedbackCorrect: {
    background: '#e8f5e9',
    color: '#2e7d32',
  },
  feedbackIncorrect: {
    background: '#ffebee',
    color: '#c62828',
  },
};

function generateProblem() {
  // Generate ax + b = c where solution x is an integer
  const x = Math.floor(Math.random() * 21) - 10; // -10 to 10
  const a = Math.floor(Math.random() * 9) + 1;   // 1 to 9
  const b = Math.floor(Math.random() * 41) - 20; // -20 to 20
  const c = a * x + b;

  return { a, b, c, solution: x };
}

function formatEquation(a, b, c) {
  const bPart = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  return `${a}x ${bPart} = ${c}`;
}

export default function App() {
  const [problem, setProblem] = useState(() => generateProblem());
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const checkAnswer = useCallback(() => {
    const userAnswer = parseInt(answer, 10);
    if (isNaN(userAnswer)) {
      setFeedback({ correct: false, message: 'Please enter a number' });
      return;
    }

    setAttempts(prev => prev + 1);

    if (userAnswer === problem.solution) {
      setFeedback({ correct: true, message: 'Correct!' });
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setFeedback({
        correct: false,
        message: `Incorrect. The answer was x = ${problem.solution}`,
      });
      setStreak(0);
    }
  }, [answer, problem.solution]);

  const nextProblem = useCallback(() => {
    setProblem(generateProblem());
    setAnswer('');
    setFeedback(null);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      if (feedback) {
        nextProblem();
      } else {
        checkAnswer();
      }
    }
  }, [feedback, checkAnswer, nextProblem]);

  const inputStyle = {
    ...styles.input,
    ...(feedback?.correct === true ? styles.inputCorrect : {}),
    ...(feedback?.correct === false ? styles.inputIncorrect : {}),
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Linear Equations</h1>
          <p style={styles.subtitle}>Solve for x</p>
        </div>

        <div style={styles.stats}>
          <div style={styles.stat}>
            <div style={styles.statValue}>{score}</div>
            <div style={styles.statLabel}>Score</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statValue}>{streak}</div>
            <div style={styles.statLabel}>Streak</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statValue}>
              {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
            </div>
            <div style={styles.statLabel}>Accuracy</div>
          </div>
        </div>

        <div style={styles.problem}>
          <div style={styles.equation}>
            {formatEquation(problem.a, problem.b, problem.c)}
          </div>
          <div style={styles.inputGroup}>
            <span style={styles.label}>x =</span>
            <input
              type="number"
              style={inputStyle}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={feedback !== null}
              autoFocus
            />
          </div>
        </div>

        {feedback ? (
          <>
            <div
              style={{
                ...styles.feedback,
                ...(feedback.correct ? styles.feedbackCorrect : styles.feedbackIncorrect),
              }}
            >
              {feedback.message}
            </div>
            <button style={styles.button} onClick={nextProblem}>
              Next Problem
            </button>
          </>
        ) : (
          <button style={styles.button} onClick={checkAnswer}>
            Check Answer
          </button>
        )}
      </div>
    </div>
  );
}
