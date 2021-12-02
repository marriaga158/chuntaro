module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		// TODO: if the remind role exists remove everybody from it
	
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};