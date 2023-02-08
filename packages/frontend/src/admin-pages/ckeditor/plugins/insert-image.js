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

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg'
import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import Request from './../../helpers/request'
import store from './../../store'

export default class InsertImage extends Plugin {
  init () {
    const plugin = this
    const editor = plugin.editor

    editor.ui.componentFactory.add('insertImage', locale => {
      const view = new ButtonView(locale)

      view.set({
        label: 'Insert image',
        icon: imageIcon,
        tooltip: true
      })

      view.on('execute', () => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', '.jpg,.jpeg,.png,.tif,.gif')
        input.click()

        input.onchange = () => {
          if (input.files.length) {
            plugin.uploadImage(input.files[0]).then(file => {
              const src = store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + file.path
              editor.model.change(writer => {
                const imageElement = writer.createElement('image', {
                  src: src
                })
                editor.model.insertContent(imageElement, editor.model.document.selection)
              })
            }).catch(err => {
              console.log(err)
            })
          }
        }
      })

      return view
    })
  }

  uploadImage (image) {
    const request = new Request()
    let file = null

    return request.post('files', {
      content_type: image.type,
      filename: image.name
    }).then(response => {
      file = response.data.file

      const signedUrl = response.data.upload_url

      const defaultHeaders = JSON.parse(JSON.stringify(axios.defaults.headers))
      const instance = axios.create()
      instance.defaults.headers.common['Content-Type'] = image.type || 'application/octet-stream'
      instance.defaults.headers.put['Content-Type'] = image.type || 'application/octet-stream'
      axios.defaults.headers = defaultHeaders

      return instance.put(signedUrl, image)
    }).then(() => {
      return file
    })
  }
}
