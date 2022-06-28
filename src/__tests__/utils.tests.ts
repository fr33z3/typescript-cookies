import {compact} from '../utils'

describe('Utils', () => {
  describe('compact', () => {
    it('does not compact array with no nulls', () => {
      expect(compact(['', '1', '2'])).toEqual(['', '1', '2'])
    })

    it('returns compacted array', () => {
      expect(compact(['', null, '1', null, '2'])).toEqual(['', '1', '2'])
    })    
  })
})
