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
    <div v-if="hasError" id="api-error" class="c-alert c-alert--shadow c-alert--bad c-alert--expand u-flex u-justify-center">
        <div class="c-alert__body u-flex u-justify-between">
            <div class="c-alert__text">
                <h3 class="c-alert-title">There was an error processing your request.</h3>
                <ul>
                   <li>Type: {{localValue.type}}</li>
                   <li>Message: {{localValue.message}}</li>
                   <li>ID: {{localValue.request_id}}</li>
                </ul>
            </div>
            <div class="c-alert__close">
                <button v-on:click="close" class="c-btn c-btn--xs c-btn--icon c-btn--reverse c-btn--text"><i class="fa fa-close" aria-hidden="true"></i>Close</button>
            </div>
        </div>
    </div>
</template>
<script>
    module.exports = {
        data: function () {
            return {
                localValue: {}
            };
        },
        props: {
            value: {}
        },
        computed: {
            hasError: function () {
                return this.localValue && Object.keys(this.localValue).length;
            }
        },
        watch: {
            localValue: function (value, oldValue) {
                const vue = this;
                if (value === oldValue) {
                    return;
                }
                vue.$emit('input', vue.localValue);
            },
            value: function (value, oldValue) {
                const vue = this;
                if (value === oldValue) {
                    return;
                }
                vue.localValue = value;
            }
        },
        methods: {
            close: function () {
                const vue = this;
                vue.localValue = {};
            }
        },
    }

</script>