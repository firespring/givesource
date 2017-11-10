/*
 * Copyright (C) 2017  Firespring
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const mixin = {
	methods: {
		addModal: function (modal, data) {
			this.bus.$emit('addModal', modal, data);
		},
		removeModal: function (modal) {
			this.bus.$emit('removeModal', modal);
		},
		replaceModal: function (modal, data) {
			this.bus.$emit('replaceModal', modal, data);
		},
		clearModals: function () {
			this.bus.$emit('clearModals');
		}
	}
};

export default mixin;