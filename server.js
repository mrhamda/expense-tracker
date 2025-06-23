require('dotenv').config()
const { v4: uuidv4 } = require('uuid');


const express = require('express')
const nodeMailer = require('nodemailer')


const cors = require('cors')

const bcrypt = require('bcrypt')


const mongoose = require('mongoose')

const expSchema = require('./src/Schemas/expSchema')
const userSchema = require('./src/Schemas/userSchema')
const passwordResetSchema = require('./src/Schemas/passwordResetSchema')


const app = express()


const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/expTracker')
    .then(() => {
        console.log("Connected to mongodb")
    })
    .catch((e) => {
        console.log(e)
    })

app.post('/grab-expenses', async (req, res) => {
    const { user } = req.body
    try {
        const getExpenses = await expSchema.find({ password: user.password })

        res.json({ getExpenses: getExpenses })
    } catch (e) {
        console.log(e)
        res.status(500)
    }
})

app.post('/create-expense', async (req, res) => {
    try {
        const { desc, cost, password } = req.body

        const createSchema = await new expSchema({ desc: desc, cost: cost, password: password })

        await createSchema.save()
        res.status(200).json({ createSchema: createSchema })

    } catch (e) {
        console.log(e)
        res.status(400).send(e)

    }

})

app.delete('/delete-expense', async (req, res) => {
    try {
        const { id } = req.body

        const deleteTheSchema = await expSchema.deleteOne({ _id: id })


        res.json(200).json("Deleted")

    } catch (e) {
        console.log(e)
        res.status(400).send(e)

    }

})




app.post('/sign-up', async (req, res) => {
    const { email, password } = req.body

    try {
        const findUser = await userSchema.findOne({ email: email })

        if (findUser === null) {
            const hashedPassword = await bcrypt.hash(password, 10)


            const createdUser = await new userSchema({
                email: email,
                password: hashedPassword
            })

            await createdUser.save()

            res.json({ createdUser: createdUser })
        } else {
            res.json("User already exists!")
        }

    }


    catch (e) {
        console.log(e)
    }

})


app.post('/sign-in', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await userSchema.findOne({ email: email })

        if (user !== null) {
            const isThePasswordTrue = await bcrypt.compare(password, user.password)

            if (isThePasswordTrue) {
                res.json({ user: user })
                console.log(user)
            } else {
                res.json("Wrong password")
            }

        } else {
            res.json("User Not Found")

        }
    } catch (e) {
        console.log(e)
    }
})



app.post('/send-code-reset', async (req, res) => {
    const { email, html } = req.body

    const auth = {
        service: "gmail",
        auth: {
            user: process.env.CURRENTGMAIL,
            pass: process.env.USER_PASS
        }
    }

    const mailOptions = {
        from: process.env.CURRENTGMAIL,
        to: email,
        subject: "Reset password expense tracker",
        html: html
    }


    try {
        const transporter = await nodeMailer.createTransport(auth)
        const _res = await transporter.sendMail(mailOptions)
        res.json(_res)

    } catch (e) {
        console.log(e)
        console.error("Email sending error:", e);
        res.status(500).json({ error: "Failed to send email" });
    }
})



app.post('/create-secret-token', async (req, res) => {
    const { email } = req.body

    try {

        const tokenUsers = await passwordResetSchema.find()
        console.log('Users', tokenUsers)

        const tokenUser = await passwordResetSchema.findOne({ email: email })

        console.log('user', tokenUser)

        if (!tokenUser) {

            const token = await uuidv4()


            const tokenUser = await new passwordResetSchema({
                email: email,
                secretToken: token
            })

            await tokenUser.save()

            res.json({ "token": token })

        } else {
            const token = await uuidv4()

            tokenUser.secretToken = token

            await tokenUser.save()

            res.json({ "token": token })

        }

    } catch (e) {
        console.log(e)
        res.json({ "error": e })

    }
})

app.put('/update-user', async (req, res) => {
    const { token, password } = req.body

    try {
        const findTokenUser = await passwordResetSchema.findOne({ secretToken: token })

        const email = findTokenUser.email

        const findUser = await userSchema.findOne({ email: email })

        const encryptedPassword = await bcrypt.hash(password, 10)

        findUser.password = encryptedPassword

        await findUser.save()

        res.json({res: "Sucessfully updated", email: email})

    } catch (e) {
        console.log(e)
    }
})

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})