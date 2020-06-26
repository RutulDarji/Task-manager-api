const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId,userOne,setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should sign up a new user', async () => {
    const response = await request(app).post('/users')
    .send({
        name: 'rutul',
        email: 'rutul@gmail.com',
        password: 'rutul@123'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assetions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'rutul',
            email: 'rutul@gmail.com',
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('rutul@123')
})

test('Should login existing user',async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should Not login nonexisting user',async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.email
    }).expect(400)
})

test('should get profile for user',async ()=> {
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should Delete user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not Delete for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    // to check it is buffer or not
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid  user field', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Jess'
        })
        .expect(200)

        const user = await User.findById(userOneId)
        expect(user.name).toEqual('Jess')
})

test('Should not update invalid  user field', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Jess'
        })
        .expect(400)
})