import * as core from '@actions/core'
import {diff, console as consoleDiff} from 'jsondiffpatch'
import chalk from 'chalk'

;(function () {
  try {
    const expected = parseJSON('expected', core.getInput('expected'))
    const actual = parseJSON('actual', core.getInput('actual'))

    const delta = diff(expected, actual)

    if (!delta) {
      core.info(chalk.green('"expected" and "actual" are equivalent JSON'))
      core.setOutput('equal', 'true')
      return
    }

    if (core.getBooleanInput('fail')) {
      core.setFailed('"expected" and "actual" are not equivalent JSON')
    }

    core.setOutput('equal', 'false')

    consoleDiff.log(delta)
  } catch (err) {
    core.setFailed(err.message)
  }
})()


function parseJSON(name, json) {
  try {
    return JSON.parse(json)
  } catch (err) {
    throw new Error(`Failed to parse "${name}" as JSON: ${err}`)
  }
}