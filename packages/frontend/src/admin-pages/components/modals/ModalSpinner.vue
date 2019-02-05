<!--
  ~ Copyright 2018 Firespring, Inc.
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  -->

<template>
    <div id="modal-spinner" class="c-modal c-modal--spinner" :style="{ 'z-index': zIndex, display: 'block' }">
        <div class="c-modal__contents">
            <div class="c-modal-dialog">
                <div class="c-modal-dialog__contents">
                    <div class="c-modal-content">
                        <div class="c-progress c-progress--spinner c-spinner-lg c-spinner-active">
                            <div class="c-spinner-layer c-spinner-orange-only">
                                <div class="c-spinner-circle-clipper left">
                                    <div class="c-spinner-circle"></div>
                                </div><div class="gap-patch">
                                <div class="c-spinner-circle"></div>
                            </div><div class="c-spinner-circle-clipper right">
                                <div class="c-spinner-circle"></div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		props: {
			zIndex: {
				type: [Number, String],
				default: 1000
			}
		}
	}
</script>