import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  } else {
    return left('error')
  }
}

test('Success result', () => {
  const result = doSomething(true)

  if (result.isRight()) {
    console.log(result.value)
  }

  expect(result.isRight()).toEqual(true)
  expect(result.isLeft()).toEqual(false)
})

test('error result', () => {
  const successResult = doSomething(false)

  expect(successResult.isLeft()).toEqual(true)
  expect(successResult.isRight()).toEqual(false)
})
