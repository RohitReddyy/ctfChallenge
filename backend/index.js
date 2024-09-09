const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5500;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

// In-memory storage for user paths
const userPaths = {};

const fileSystem = {
  '/home': ['user'],
  '/home/user': ['Desktop', 'Document', 'Downloads', 'Music', 'Pictures', 'Templates', 'Videos'],
  '/home/user/Templates': ['iAm_the_@.txt'],
  '/home/user/Desktop': ['youthinkitsaflag.txt'],
  '/home/user/Document': ['🤔yes_this_isflag.txt'],
  '/home/user/Downloads': ['👀see_you_are_here.txt'],
  '/home/user/Music': ['🎶iknow_you_will_openme.txt'],
  '/home/user/Pictures': ['🔍youfoundme.txt'],
  '/home/user/Videos': ['😂haha_i_am_not_who_iam.txt'],
};

const flags = {
  '/home/user/Templates/iAm_the_@.txt': 'CBslu%7BFl%40g%5F%21n%5Fh%21Dd3n%5Fd%21r3ct0rY%7D',
  '/home/user/Desktop/youthinkitsaflag.txt': 'no its not me 🙅‍♂️',
  '/home/user/Document/yes_this_isflag.txt': 'i think you are wrong ❌',
  '/home/user/Downloads/see_you_are_here.txt': 'go away 🚪',
  '/home/user/Music/iknow_you_will_openme.txt': 'please close me 🙈',
  '/home/user/Pictures/youfoundme.txt': 'you are one step away 🚶',
  '/home/user/Videos/haha_i_am_not_who_iam.txt': 'haha you missed me 😂',
};

// Command handler
app.post('/execute', (req, res) => {
  const { command, reset } = req.body;
  const [cmd, ...args] = command.split(' ');

  // Get user's IP
  const userIp = req.ip;

  // Initialize or reset the current path if reset flag is set
  if (reset) {
    userPaths[userIp] = '/home';
  }

  // Retrieve the current path for the user
  let currentPath = userPaths[userIp] || '/home';

  console.log(`Received command: ${command}`);
  console.log(`Current path before command: ${currentPath}`);

  switch (cmd) {
    case 'ls':
      const contents = fileSystem[currentPath] || [];
      console.log(`Directory contents: ${contents.join('\n')}`);
      res.json({ output: contents.join('\n'), currentPath });
      break;
    case 'cd':
      const newPath = args[0];
      console.log(`Trying to change to directory: ${newPath}`);

      if (newPath === '..') {
        // Move up one directory level
        currentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
      } else {
        // Move to the specified directory
        const newFullPath = `${currentPath}/${newPath}`.replace(/\/+/g, '/');
        if (fileSystem[newFullPath]) {
          currentPath = newFullPath;
        } else {
          console.log(`Directory not found: ${newFullPath}`);
          res.json({ output: 'Directory not found.' });
          return;
        }
      }
      // Update the path for the user
      userPaths[userIp] = currentPath;
      console.log(`Changed directory to: ${currentPath}`);
      res.json({ output: '', currentPath });
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

  // Debugging: Output the current path after processing the command
  console.log(`Current path after command: ${userPaths[userIp] || '/home'}`);
});

app.get('/sai', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
