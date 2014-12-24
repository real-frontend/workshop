
(function() {

//モデルの定義
var Task = Backbone.Model.extend({
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
var Tasks = Backbone.Collection.extend({
	//ローカルストレージにtasksで保存
	localStorage: new Backbone.LocalStorage('tasks'),
	model: Task
});

//タスクビューの定義
var TaskView = Backbone.View.extend({
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
var TasksView = Backbone.View.extend({
	tagName: 'ul',
	initialize: function() {
		this.collection.on('add', this.addNew, this);
		this.collection.on('change', this.updateCount, this);
		this.collection.on('destroy', this.updateCount, this);
	},
	addNew: function(task) {
		var taskView = new TaskView({
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
			var taskView = new TaskView({ model: task });
			this.$el.append(taskView.render().el);
		}, this);
		this.updateCount();
		return this;
	}
});

//タスク追加ビューの定義
var AddTaskView = Backbone.View.extend({
	el: '#addTask',
	events: {
		'submit': 'submit'
	},
	submit: function(e) {
		e.preventDefault();
		var task = new Task();
		//入力フォームバリデート、空じゃなかったら
		if (task.set( { title: $('#title').val() } , {validate: true} )) {
			this.collection.add(task);
			$('#error').empty(); //エラーメッセージは次回消す
			task.save(); //ローカルストレージに保存
		}
	}
});

//ローカルストレージのビュー管理
var Container = Backbone.View.extend({
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

//ローカルストレージにダミーのモデル保存
var initializeTasks = function() {
	var tasks = new Tasks([
		{
			title: 'task1',
			completed: true
		},{
			title: 'task2'
		},{
			title: 'task3'
		}
	]);
	//デモコレクションにエレメントが見つかる度にローカルストレージを保存
	tasks.each(function(task){
		task.save();
	});
	//モデルの配列は返す
	return tasks.models;
};

//コレクションの初期化
var tasks = new Tasks();
var addTaskView = new AddTaskView({
	collection: tasks
});

//ローカルストレージから読み込んだタスクがもし空だったら
//デモコレクションを表示。空じゃなかったら普通に読み込む
tasks.fetch().then(function(task){
	if (task.length === 0) {
		var models = initializeTasks();
		tasks.reset(models);
	}
	//表示一式
	var tasksView = new TasksView({
		collection: tasks
	});
	//一覧の表示
	var container = new Container();
	container.show(tasksView);
});

})();





///////////////ドットインストール＃11まで

// (function() {

// // Model
// var Task = Backbone.Model.extend({
// 	defaults: {
// 		title: 'do something!',
// 		completed: false
// 	}
// });
// var task = new Task();

// // View
// var TaskView = Backbone.View.extend({
// 	tagName: 'li',
// 	template: _.template( $('#task-template').html() ),
// 	render: function() {
// 		var template = this.template( this.model.toJSON() );
// 		this.$el.html(template);
// 		return this;
// 	}
// });

// // Collection
// var Tasks = Backbone.Collection.extend({
// 	model: Task
// });

// var TasksView = Backbone.View.extend({
// 	tagName: 'ul',
// 	render: function() {
// 		this.collection.each(function(task) {
// 			var taskView = new TaskView({model: task});
// 			this.$el.append(taskView.render().el);
// 		}, this);
// 		return this;
// 	}
// });
// var tasks = new Tasks([
// 	{
// 		title: 'task1',
// 		completed: true
// 	},{
// 		title: 'task2'
// 	},{
// 		title: 'task3'
// 	}
// ]);

// // console.log(tasks.toJSON());
// var tasksView = new TasksView({collection: tasks});
// $('#tasks').html(tasksView.render().el);

// })();