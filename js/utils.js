var app = app || {};

(function () {
	'use strict';

    app.remoteStorage = {

        restURL: "https://wkrfs4xeqva1jcu-thxgiving.adb.us-phoenix-1.oraclecloudapps.com/ords/shoppinglist/storage/items",

        setItem: async function (namespace, data) {
        		const request = await fetch(this.restURL, {
        			method: 'POST',
							body: data
						});
        },

        getItem: async function (namespace) {
        		const request = await fetch(this.restURL)
						const result = await request.json();
        		if( request.ok ) {
							const items = result.items;
							if (result.items.length > 0) {
								return JSON.parse(result.items[0].items);
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

		store: async function (namespace, data) {
			if (data) {
				// localStorage.setItem(namespace, JSON.stringify(data));
				await app.remoteStorage.setItem (namespace, JSON.stringify(data));
				return;
			}

			// var store = localStorage.getItem(namespace);
			var store = await app.remoteStorage.getItem(namespace);
			return store || [];
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
