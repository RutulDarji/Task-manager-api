const { calculateTip,fahrenheitToCelsius,celsiusToFahrenheit, add } = require('../src/math') 

test('Should Calculate total with tip', () => {
    const total = calculateTip(10,.3)
    expect(total).toBe(13)
})

test('Should Calculate total with Default tip', () => {
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})

test('Should Convert 32F to 0C',() => {
    const temp = fahrenheitToCelsius(32)
    expect(temp).toBe(0)
})

test('Should Convert 0C to 32F',() => {
    const temp = celsiusToFahrenheit(0)
    expect(temp).toBe(32)
})

/*
test('Async test demo',(done) => {
    setTimeout( () => {
        expect(1).toBe(2)
        done()
    },2000) 
})*/

test('Should Add Two Numbers',(done) => {
    add(2,3).then( (sum) => {
        expect(sum).toBe(5)
        done()
    })
})

test('Should add 2 numbers Async await', async () => {
    const sum = await add(10,32)
    expect(sum).toBe(42)
})