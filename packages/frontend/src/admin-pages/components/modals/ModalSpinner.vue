<!--
  ~ Copyright (C) 2017  Firespring
  ~
  ~ This program is free software: you can redistribute it and/or modify
  ~ it under the terms of the GNU General Public License as published by
  ~ the Free Software Foundation, either version 3 of the License, or
  ~ (at your option) any later version.
  ~
  ~ This program is distributed in the hope that it will be useful,
  ~ but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~ GNU General Public License for more details.
  ~
  ~ You should have received a copy of the GNU General Public License
  ~ along with this program.  If not, see <http://www.gnu.org/licenses/>.
  -->

<template>
    <div id="modal-spinner" class="c-modal c-modal--spinner" :style="{ 'z-index': zIndex, display: 'block' }">
        <div class="c-modal__contents">
            <div class="c-modal-dialog">
                <div class="c-modal-dialog__contents">
                    <div class="c-modal-content">
                        <div class="c-progress c-progress--spinner c-spinner-lg c-spinner-active">
                            <div class="c-spinner-layer c-spinner-white-only">
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
	module.exports = {
		props: {
			zIndex: {
				type: [Number, String],
				default: 1000
			}
		}
	}
</script>