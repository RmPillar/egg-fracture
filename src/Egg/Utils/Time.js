// @ts-ignore
import gsap from 'gsap'
import EventEmitter from './EventEmitter'

export default class Time extends EventEmitter {
  constructor () {
    super()

    // Setup
    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16

    gsap.ticker.add(this.tick.bind(this))
  }

  tick () {
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start

    // @ts-ignore
    this.trigger('tick')
  }

  stopTicker () {
    gsap.ticker.remove(this.boundTicker)
  }

  startTicker () {
    gsap.ticker.add(this.boundTicker)
  }

  destroy () {
    this.stopTicker()
  }
}
