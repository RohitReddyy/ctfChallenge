const express = require('express');
const cors = require('cors');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 5500;

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const fileSystem = {
  '/home': ['user'],
  '/home/user': ['Desktop', 'Document', 'Downloads', 'Music', 'Pictures', 'Templates', 'Videos'],
  '/home/user/Templates': ['iAm_the_@.txt'],
  '/home/user/Desktop': ['youthinkitsaflag.txt'],
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

// Middleware to initialize user session path
app.use((req, res, next) => {
  if (!req.session.currentPath) {
    req.session.currentPath = '/home';
  }
  next();
});

app.post('/execute', (req, res) => {
  const { command } = req.body;
  const [cmd, ...args] = command.split(' ');

  const currentPath = req.session.currentPath;

  switch (cmd) {
    case 'ls':
      const contents = fileSystem[currentPath] || [];
      res.json({ output: contents.join('\n'), currentPath });
      break;
    case 'cd':
      const newPath = args[0];
      if (newPath === '..') {
        req.session.currentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
      } else {
        const newFullPath = `${currentPath}/${newPath}`.replace(/\/+/g, '/');
        if (fileSystem[newFullPath]) {
          req.session.currentPath = newFullPath;
        } else {
          res.json({ output: 'Directory not found.' });
          return;
        }
      }
      res.json({ output: '', currentPath: req.session.currentPath });
      break;
    case 'pwd':
      res.json({ output: req.session.currentPath });
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

app.post('/reset', (req, res) => {
  req.session.currentPath = '/home';
  res.json({ message: 'Path reset to /home', currentPath: req.session.currentPath });
});

app.get('/sai', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
