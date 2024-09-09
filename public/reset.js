// resetPath.js

// Reset pathname when page loads
window.addEventListener('load', () => {
    fetch('https://ctf-challenge-git-master-mdrohitreddy-gmailcoms-projects.vercel.app/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json())
      .then(data => {
        console.log('Path reset:', data);
      })
      .catch(error => {
        console.error('Error resetting path:', error);
      });
  });
  