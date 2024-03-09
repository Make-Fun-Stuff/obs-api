import { cpu as cpuUtil, mem } from 'node-os-utils'

export let cpu: number[] = []
export let memory: number[] = []

const MAX_CACHED_VALUES = 20

const addToArray = (value: number, array: number[]) => {
  return array.length >= MAX_CACHED_VALUES ? [...array.slice(1), value] : [...array, value]
}

const getCpuUsage = () => {
  cpuUtil.usage().then((_) => {
    cpu = addToArray(_, cpu)
    getCpuUsage()
  })
}

const getMemoryUsage = () => {
  mem.info().then((_) => {
    memory = addToArray(_.usedMemPercentage, memory)
    getMemoryUsage()
  })
}

getCpuUsage()
getMemoryUsage()
