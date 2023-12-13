import { cpu } from 'node-os-utils'

export let usage: number = -1

const getCpuUsage = () => {
  cpu.usage().then((_) => {
    usage = _
    getCpuUsage()
  })
}

getCpuUsage()
