// server/server.js

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());


app.options('*', cors()); 

const fileSystem = {
  '/home': ['user'],
  '/home/user': ['Desktop', 'Document', 'Downloads', 'Music', 'Pictures', 'Templates', 'Videos'],
  '/home/user/Templates': ['iAm_the_@.txt'],
  '/home/user/Desktop': [
    'youthinkitsaflag.txt'
  ],
  '/home/user/Document': [ '🤔yes_this_isflag.txt' ],
  '/home/user/Downloads': [ '👀see_you_are_here.txt' ],
  '/home/user/Music': [ '🎶iknow_you_will_openme.txt' ],
  '/home/user/Pictures': [ '🔍youfoundme.txt' ],
  '/home/user/Videos': [ '😂haha_i_am_not_who_iam.txt' ],

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

let currentPath = '/home';

app.post('/execute', (req, res) => {
  const { command } = req.body;
  const [cmd, ...args] = command.split(' ');

  console.log(`Received command: ${command}`);
  console.log(`Current path: ${currentPath}`);

  switch (cmd) {
    case 'ls':
      // List contents of the current path
      const contents = fileSystem[currentPath] || [];
      res.json({ output: contents.join('\n'), currentPath });
      break;
    case 'cd':
        const newPath = args[0]; // Get the new path from the command arguments
      
        console.log(`Current path before change: ${currentPath}`);
        console.log(`Trying to change to directory: ${newPath}`);
      
        if (newPath === '..') {
          // Move up one directory
          currentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
          console.log(`Moved up to: ${currentPath}`);
        } else {
          // Construct the new full path
          const newFullPath = `${currentPath}/${newPath}`.replace(/\/+/g, '/'); // Normalize the path
      
          // Check if the new path exists in the fileSystem
          if (fileSystem[newFullPath]) {
            currentPath = newFullPath; // Change to the new directory
            console.log(`Changed directory to: ${currentPath}`);
          } else {
            console.log(`Directory not found: ${newFullPath}`);
            res.json({ output: 'Directory not found.' });
            return;
          }
        }
      
        res.json({ output: '',    currentPath }); // Return success response
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
