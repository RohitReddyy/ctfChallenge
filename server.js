// server/server.js

const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const fileSystem = {
  '/': ['home'],
  '/home': ['user'],
  '/home/user': ['Desktop', 'Document', 'Downloads', 'Music', 'Pictures', 'Templates', 'Videos'],
  '/home/user/Templates': ['flag7767.txt'],
};

const flags = {
  '/home/user/Templates/flag7767.txt': 'CBslu{Fl@g_!n_h!Dd3n_d!r3ct0rY}',
};

let currentPath = '/';

app.post('/execute', (req, res) => {
  const { command } = req.body;
  const [cmd, ...args] = command.split(' ');

  console.log(`Received command: ${command}`);
  console.log(`Current path: ${currentPath}`);

  switch (cmd) {
    case 'ls':
      // List contents of the current path
      const contents = fileSystem[currentPath] || [];
      res.json({ output: contents.join('\n') });
      break;
    case 'cd':
      const newPath = args[0];
      if (newPath === '..') {
        // Move up one directory
        currentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
      } else if (fileSystem[`${currentPath}/${newPath}`]) {
        // Move to new directory
        currentPath = `${currentPath}/${newPath}`;
      } else {
        res.json({ output: 'Directory not found.' });
        return;
      }
      console.log(`Changed path to: ${currentPath}`);
      res.json({ output: '' });
      break;
    case 'pwd':
      res.json({ output: currentPath });
      break;
    case 'cat':
      const filePath = `${currentPath}/${args[0]}`;
      res.json({ output: flags[filePath] || 'File not found.' });
      break;
    case 'uname':
      res.json({ output: 'Linux' });
      break;
    case 'whoami':
      res.json({ output: 'user' });
      break;
    default:
      res.json({ output: 'Command not found.' });
      break;
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
