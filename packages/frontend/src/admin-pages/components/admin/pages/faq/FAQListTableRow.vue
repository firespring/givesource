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
    <tr>
        <td class="icon">
            <div class="c-drag-handle ui-sortable-handle"></div>
        </td>
        <td class="u-width-100p">
            <strong><a v-on:click="editQuestion" href="#">{{ question }}</a></strong>
            <div class="c-notes c-notes--below" v-html="answer"></div>
        </td>
        <td class="icon">
            <a v-on:click="deleteQuestion" href="#" role="button" class="icon icon--bad"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>
        </td>
    </tr>
</template>

<script>
	module.exports = {
		props: {
			content: {
				type: Object,
				default: {}
			},
		},
		computed: {
			question: function () {
				if (this.content.hasOwnProperty('value')) {
					const question = _.find(this.content.value, {key: 'FAQ_LIST_ITEM_QUESTION'});
					if (question) {
						return question.value;
					}
				}
				return null;
			},
			answer: function () {
				if (this.content.hasOwnProperty('value')) {
					const answer = _.find(this.content.value, {key: 'FAQ_LIST_ITEM_ANSWER'});
					if (answer) {
						return answer.value;
					}
				}
				return null;
			}
		},
		methods: {
			editQuestion: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('pages-faq-edit-question-modal', {content: vue.content});
            },
			deleteQuestion: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('pages-faq-delete-question-modal', {content: vue.content});
			}
		}
	};
</script>