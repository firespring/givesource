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
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import BlockQuotePlugin from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading';
import ImagePlugin from '@ckeditor/ckeditor5-image/src/image';
import InsertImage from './../plugins/insert-image';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
import ListPlugin from '@ckeditor/ckeditor5-list/src/list';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';

export default class AdvancedEditor extends ClassicEditorBase {
}

// Plugins to include in the build.
AdvancedEditor.builtinPlugins = [
	EssentialsPlugin,
	HeadingPlugin,
	BoldPlugin,
	ItalicPlugin,
	BlockQuotePlugin,
	LinkPlugin,
	ListPlugin,
	ImagePlugin,
	InsertImage,
	ParagraphPlugin,
];

AdvancedEditor.defaultConfig = {
	toolbar: ['heading',  '|', 'bold', 'italic', 'blockQuote', '|', 'link', '|', 'bulletedList', 'numberedList', '|', 'insertImage', '|', 'undo', 'redo'],
	language: 'en'
};