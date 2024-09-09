// src/components/Terminal.js

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFileAlt, faFolder } from '@fortawesome/free-solid-svg-icons';

const Terminal = () => {
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://ctf-challenge-git-master-mdrohitreddy-gmailcoms-projects.vercel.app/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      setOutput('Error: Unable to fetch data from server.');
    }

    setInput('');
  };

  const renderOutput = () => {
    const lines = output.split('\n');
    return lines.map((line, index) => {
      // Display folders and files with icons
      if (line.includes('flag7767.txt')) {
        return (
          <div key={index} style={{ margin: '5px 0' }}>
            <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: '8px' }} />
            {line}
          </div>
        );
      } else if (line.includes('home') || line.includes('user') || line.includes('Templates')) {
        return (
          <div key={index} style={{ margin: '5px 0' }}>
            <FontAwesomeIcon icon={faFolder} style={{ marginRight: '8px' }} />
            {line}
          </div>
        );
      } else {
        return (
          <div key={index} style={{ margin: '5px 0' }}>
            <FontAwesomeIcon icon={faFile} style={{ marginRight: '8px' }} />
            {line}
          </div>
        );
      }
    });
  };

  return (
    <div style={{
      fontFamily: 'monospace',
      border: '1px solid #555',
      padding: '15px',
      backgroundColor: '#1e1e1e',
      color: '#e0e0e0',
      borderRadius: '8px',
      width: '80%',
      maxWidth: '600px',
      margin: 'auto',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    }}>
      <div style={{
        whiteSpace: 'pre-wrap',
        marginBottom: '10px',
        lineHeight: '1.6',
      }}>
        {renderOutput()}
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #666',
            borderRadius: '4px',
            color: '#000',
            backgroundColor: '#fff',
            fontSize: '1rem',
          }}
        />
        <button
          type="submit"
          style={{
            display: 'none',
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Terminal;
