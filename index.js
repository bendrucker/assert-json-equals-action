import * as core from '@actions/core'
import {diff, diffString} from 'json-diff'
import chalk from 'chalk'

;(function () {
  try {
    const expected = parseJSON('expected', core.getInput('expected'))
    const actual = parseJSON('actual', core.getInput('actual'))

    if (!diff(actual, expected)) {
      core.info(chalk.green('"expected" and "actual" are equivalent JSON'))
      core.setOutput('equal', 'true')
      return
    }

    if (core.getBooleanInput('fail')) {
      core.setFailed('"expected" and "actual" are not equivalent JSON')
    }

    core.setOutput('equal', 'false')

    const output = diffString(actual, expected)
    core.setOutput('diff', output)
    console.log(output)
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