import questions from './data.json' assert {type: 'json'}
import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())

app.get('/api/questions', (req, res) => {
    res.json({ questions })
})

app.get('/api/questions/:category', (req, res) => {
    const { category } = req.params

    const quiz = questions.quizzes.find(q => q.title.toLowerCase() === category.toLowerCase())

    if (!quiz) {
        return res.status(404).send({
            error: 'No such category',
            availableCategories: questions.quizzes.map(q => q.title)
        })
    }
    res.json(quiz.questions)
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
