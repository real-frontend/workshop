//タスクビューの定義
App.TaskView = Backbone.View.extend({
	tagName: 'li',
	initialize: function() {
		this.model.on('destroy', this.remove, this);
		this.model.on('change', this.render, this);
	},
	events: {
		'click .delete': 'destroy',
		'click .toggle': 'toggle'
	},
	toggle: function() {
		this.model.set('completed', !this.model.get('completed'));
		this.model.save(); //ローカルストレージに変更を保存
	},
	destroy: function() {
		if (confirm('are you sure?')) {
			this.model.destroy();
		}
	},
	remove: function() {
		this.$el.remove();
	},
	template: _.template( $('#task-template').html() ),
	render: function() {
		var template = this.template( this.model.toJSON() );
		this.$el.html(template);
		return this;
	}
});

//タスクコレクションビューの定義
App.TasksView = Backbone.View.extend({
	tagName: 'ul',
	initialize: function() {
		this.collection.on('add', this.addNew, this);
		this.collection.on('change', this.updateCount, this);
		this.collection.on('destroy', this.updateCount, this);
	},
	addNew: function(task) {
		var taskView = new App.TaskView({
			model: task
		});
		this.$el.append(taskView.render().el);
		$('#title').val('').focus(); //入力後フォーム空にする
		this.updateCount();
	},
	updateCount: function() {
		var uncompletedTasks = this.collection.filter( function(task){
			return !task.get('completed');
		});
		$('#count').html(uncompletedTasks.length);
	},
	render: function() {
		this.collection.each(function(task) {
			var taskView = new App.TaskView({ model: task });
			this.$el.append(taskView.render().el);
		}, this);
		this.updateCount();
		return this;
	}
});

//タスク追加ビューの定義
App.AddTaskView = Backbone.View.extend({
	el: '#addTask',
	events: {
		'submit': 'submit'
	},
	submit: function(e) {
		e.preventDefault();
		var task = new App.Task();
		//入力フォームバリデート、空じゃなかったら
		if (task.set( { title: $('#title').val() } , {validate: true} )) {
			this.collection.add(task);
			$('#error').empty(); //エラーメッセージは次回消す
			task.save(); //ローカルストレージに保存
		}
	}
});

//ローカルストレージのビュー管理
App.Container = Backbone.View.extend({
	el: '#tasks',
	show: function(view) {
		this.destroyView(this.currentView);
		this.$el.append(view.render().$el);
		this.currentView = view;
	},
	destroyView: function(view) {
		if (!view) {
			return;
		}
		view.off();
		view.remove();
	},
	empty: function() {
		this.destroyView(this.currentView);
		this.currentView = null;
	}
});