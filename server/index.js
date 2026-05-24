require('dotenv').config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const errorMiddleware = require('./middlewares/error-middleware')

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

const wishesRouter = require('./routes/wishes');
const authRouter = require('./routes/auth');
const friendsRouter = require('./routes/friends')
const groupsRouter = require('./routes/groups')
const reservationsRouter = require('./routes/reservations')

app.use('/api/wishes', wishesRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/auth', authRouter);
app.use('/api/friends', friendsRouter);
app.use('/api/groups', groupsRouter);
app.use('/uploads', express.static('uploads'));

app.use(errorMiddleware)
const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server started on PORT = ${PORT}`)
    })

  } catch (e) {
    console.log(e)
  }
}

start()