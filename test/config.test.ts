import {expect, test} from '@jest/globals'
import {required} from '../src/config'

test('required input undefined', () => {
  expect(() => required(undefined)).toThrow('Required input is missing')
})

test('required input null', () => {
  expect(() => required(null)).toThrow('Required input is missing')
})

test('required input empty', () => {
  expect(() => required('')).toThrow('Required input is missing')
})

test('required input valid', () => {
  expect(required('foo')).toBe('foo')
})
