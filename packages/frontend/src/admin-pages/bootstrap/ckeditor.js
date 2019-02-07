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

import Request from './../helpers/request';
import store from './../store';

const plugin = {
	icons: 'image',
	allowedContent: 'img[!src,alt,width,height]',
	init(editor) {

		editor.addCommand('insertImage', {
			exec(editor) {
				const input = document.createElement('input');
				input.setAttribute('type', 'file');
				input.setAttribute('accept', '.jpg,.jpeg,.png,.tif,.gif');
				input.click();

				input.onchange = () => {
					if (input.files.length) {
						editor.setReadOnly(true);

						uploadImage(input.files[0]).then(file => {
							editor.setReadOnly(false);

							const src = store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + file.path;
							const domElement = CKEDITOR.dom.element.createFromHtml('<img src="' + src + '">');
							editor.insertElement(domElement);
						}).catch(err => {
							console.log(err);
							editor.setReadOnly(false);
						});
					}
				};
			}
		});

		editor.ui.addButton('Image', {
			label: 'Insert Image',
			command: 'insertImage',
			toolbar: 'insert'
		});
	}
};

/**
 * Upload an image file
 *
 * @param {File} image
 * @return {Promise}
 */
const uploadImage = (image) => {
	const request = new Request();
	let file = null;

	return request.post('files', {
		content_type: image.type,
		filename: image.name,
	}).then(response => {
		file = response.data.file;

		const signedUrl = response.data.upload_url;

		const defaultHeaders = JSON.parse(JSON.stringify(axios.defaults.headers));
		let instance = axios.create();
		instance.defaults.headers.common['Content-Type'] = image.type || 'application/octet-stream';
		instance.defaults.headers.put['Content-Type'] = image.type || 'application/octet-stream';
		axios.defaults.headers = defaultHeaders;

		return instance.put(signedUrl, image);
	}).then(() => {
		return file;
	});
};

export default function () {
	CKEDITOR.plugins.add('insertimage', plugin);
};