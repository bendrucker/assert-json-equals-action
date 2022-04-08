import * as core from '@actions/core'
import chalk from 'chalk'
import deepEqual from 'deep-equal'

;(async function () {
  try {
    const expected = parseJSON('expected', core.getInput('expected'))
    const actual = parseJSON('actual', core.getInput('actual'))

    if (deepEqual(expected, actual)) {
      core.info(chalk.green('✅ "expected" and "actual" are equivalent JSON'))
      core.setOutput('equal', 'true')
      return
    }

    core.setOutput('equal', 'false')

    await core.group('Expected JSON:', () => core.info(JSON.stringify(expected, null, 2)))
    await core.group('Actual JSON:', () => core.info(JSON.stringify(actual, null, 2)))

    if (core.getBooleanInput('fail')) {
      core.setFailed('"expected" and "actual" are not equivalent JSON')
    }
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