//モデルの定義
App.Task = Backbone.Model.extend({
	defaults: {
		title: 'do something!',
		completed: false
	},
	//もし入力フォームが空だったら
	validate: function(attrs) {
		if( _.isEmpty(attrs.title)){
			return 'title must not be empty';
		}
	},
	initialize: function() {
		this.on('invalid', function(model, error) {
			$('#error').html(error);
		})
	}
});

//コレクションの定義
App.Tasks = Backbone.Collection.extend({
	//ローカルストレージにtasksで保存
	localStorage: new Backbone.LocalStorage('tasks'),
	model: App.Task
});