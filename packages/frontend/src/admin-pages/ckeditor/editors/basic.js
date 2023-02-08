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
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'

import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold'
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials'
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic'
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link'
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph'

export default class BasicEditor extends ClassicEditorBase {
}

// Plugins to include in the build.
BasicEditor.builtinPlugins = [
  EssentialsPlugin,
  BoldPlugin,
  ItalicPlugin,
  LinkPlugin,
  ParagraphPlugin
]

BasicEditor.defaultConfig = {
  toolbar: ['bold', 'italic', '|', 'link', 'undo', 'redo'],
  language: 'en'
}
