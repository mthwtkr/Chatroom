module.exports = function Route(app) {
	app.get('/', function (req, res) {
		res.render('index', {title: 'Welcome Page'});
	});

	var users = [];
	app.io.route('add_user', function (req) {
		var user = {name: req.data.name, id: req.sessionID};
		users.unshift(user);
		req.io.broadcast('new_user', user);
		req.io.emit('existing_users', users);
	});

	app.io.route('updated_text', function (req) {
		req.io.broadcast('text_update', {text: req.data.text, id: req.sessionID});
	});

	app.io.route('disconnect', function (req) {
		for (var position = 0; position < users.length; position++) {
			if (users[position].id == req.sessionID) {
				app.io.broadcast('delete_user', users[position]);
				users.splice(position, 1);
			}
		}
	});
}