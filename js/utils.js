var app = app || {};

(function () {
	'use strict';

    app.remoteStorage = {

        restURL: "<Your REST endpoint>",

        setItem: function (namespace, data) {

            var xhr = new XMLHttpRequest();
            xhr.open('POST', this.restURL, false);
            xhr.send(data);
        },

        getItem: function (namespace) {

            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.restURL, false);

            xhr.send();
            if (xhr.status == 200) {
                var result = JSON.parse(xhr.response).items;
                if (result.length > 0) {
                   return result[0].items;
                }
            }
        }
    };

	app.Utils = {
		uuid: function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
					.toString(16);
			}

			return uuid;
		},

		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},

		store: function (namespace, data) {
			if (data) {
				// localStorage.setItem(namespace, JSON.stringify(data));
				app.remoteStorage.setItem (namespace, JSON.stringify(data));
				return;
			}

			// var store = localStorage.getItem(namespace);
			var store = app.remoteStorage.getItem(namespace);
			return (store && JSON.parse(store)) || [];
		},

		extend: function () {
			var newObj = {};
			for (var i = 0; i < arguments.length; i++) {
				var obj = arguments[i];
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						newObj[key] = obj[key];
					}
				}
			}
			return newObj;
		}
	};
})();
