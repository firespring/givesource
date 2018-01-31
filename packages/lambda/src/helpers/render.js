const mustache = require('mustache');

const renderTemplate = function (template, data) {
	return new Promise(function (resolve, reject) {
		let templatePath = template.replace(/\s/g, '').replace('.mustache', '').split('.').join('/');

		try {
			const content = require('./../templates/' + templatePath + '.mustache');
			const rendered = mustache.render(content, data);
			resolve(rendered);
		} catch (err) {
			reject(err);
		}
	});
};

export {
	renderTemplate,
}