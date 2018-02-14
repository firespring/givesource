const mixin = {
	methods: {
		sync: function (object, sources) {
			object = JSON.parse(JSON.stringify(object));
			Object.keys(object).forEach(function (key) {
				sources.forEach(function (source) {
					source = JSON.parse(JSON.stringify(source));
					if (source.hasOwnProperty(key) && source[key] !== undefined && source[key] !== null) {
						object[key] = source[key];
					}
				});
			});
			return object;
		},
		getUpdatedParameters: function (data, originals) {
			const mixin = this;

			const params = {};
			data = JSON.parse(JSON.stringify(data));
			Object.keys(data).forEach(function (key) {
				originals.forEach(function (original) {
					original = JSON.parse(JSON.stringify(original));
					if (!original.hasOwnProperty(key) || original[key] !== data[key] || (mixin.isEmptyParam(original[key]) && !mixin.isEmptyParam(data[key])) || (!mixin.isEmptyParam(original[key]) && mixin.isEmptyParam(data[key]))) {
						params[key] = data[key];
					}
				});
			});
			return params;
		},
		isEmptyParam: function (param) {
			return param === undefined || param === null || param === '';
		}
	}
};

export default mixin;