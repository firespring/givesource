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

exports.generateSlug = function (model, place, data, callback) {
	const repository = this;
	let legalName = model.legalName;
	let allSlugs = data;
	let nonprofit_slug = sluggify(place > 0 ? legalName + '-' + place : legalName);
	for (let slipperySlug in allSlugs) {
		if (nonprofit_slug === allSlugs[slipperySlug]) {
			repository.generateSlug(model, place++, data, callback);
		}
	}
	callback(nonprofit_slug);
};

function sluggify(text) {
	const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;';
	const b = 'aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------';
	const p = new RegExp(a.split('').join('|'), 'g');

	return text.toString().toLowerCase()
		.replace(/\s+/g, '-')           // Replace spaces with -
		.replace(p, c =>
			b.charAt(a.indexOf(c)))     // Replace special chars
		.replace(/&/g, '-and-')         // Replace & with 'and'
		.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
		.replace(/\-\-+/g, '-')         // Replace multiple - with single -
		.replace(/^-+/, '')             // Trim - from start of text
		.replace(/-+$/, '')             // Trim - from end of text
}