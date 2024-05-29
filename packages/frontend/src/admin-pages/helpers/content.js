/*
 * Copyright 2019 Firespring, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const getContentKeys = (setting) => {
  const keys = []
  const uuids = _getUuids(setting)
  const list = [
    'CUSTOM_PAGE_SLUG',
    'CUSTOM_PAGE_TEXT',
    'CUSTOM_PAGE_TITLE'
  ]

  uuids.forEach((uuid) => {
    list.forEach((prefix) => {
      keys.push(prefix + '_' + uuid.toUpperCase().replace(/-/g, '_'))
    })
  })

  return keys
}

const getSettingKeys = (setting) => {
  const keys = []
  const uuids = _getUuids(setting)
  const list = [
    'CUSTOM_PAGE_ENABLED'
  ]

  uuids.forEach((uuid) => {
    list.forEach((prefix) => {
      keys.push(prefix + '_' + uuid.toUpperCase().replace(/-/g, '_'))
    })
  })

  return keys
}

const _getUuids = (setting) => {
  if (Array.isArray(setting)) {
    setting = _.find(setting, { key: 'CUSTOM_PAGES' })
  }
  if (typeof setting === 'object' && setting.hasOwnProperty('value')) {
    setting = setting.value
  }
  if (typeof setting === 'string' && setting.length) {
    return setting.split('|')
  }
  return []
}

export {
  getContentKeys,
  getSettingKeys
}
