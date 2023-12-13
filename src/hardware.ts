import { cpu as cpuUtil, mem } from 'node-os-utils'

export let cpu: number = -1
export let memory: number = -1

const getCpuUsage = () => {
  cpuUtil.usage().then((_) => {
    cpu = _
    getCpuUsage()
  })
}

const getMemoryUsage = () => {
  mem.info().then((_) => {
    memory = _.usedMemPercentage
    getMemoryUsage()
  })
}

getCpuUsage()
getMemoryUsage()
