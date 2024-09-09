const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5500;

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

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

// Store the current path for each user
const userPaths = {};

app.post('/execute', (req, res) => {
  const { command, reset } = req.body; // Include reset in the request body
  const [cmd, ...args] = command.split(' ');

  // Initialize or reset the current path if reset flag is set
  if (reset) {
    userPaths[req.ip] = '/home'; // Use req.ip to store per user
  }

  let currentPath = userPaths[req.ip] || '/home'; // Default to '/home' if not set

  console.log(`Received command: ${command}`);
  console.log(`Current path: ${currentPath}`);

  switch (cmd) {
    case 'ls':
      const contents = fileSystem[currentPath] || [];
      res.json({ output: contents.join('\n'), currentPath });
      break;
    case 'cd':
      const newPath = args[0];

      console.log(`Trying to change to directory: ${newPath}`);

      if (newPath === '..') {
        currentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
        console.log(`Moved up to: ${currentPath}`);
      } else {
        const newFullPath = `${currentPath}/${newPath}`.replace(/\/+/g, '/');
        if (fileSystem[newFullPath]) {
          currentPath = newFullPath;
          console.log(`Changed directory to: ${currentPath}`);
        } else {
          console.log(`Directory not found: ${newFullPath}`);
          res.json({ output: 'Directory not found.' });
          return;
        }
      }
      userPaths[req.ip] = currentPath; // Update the path for the user
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
});

app.get('/sai', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
