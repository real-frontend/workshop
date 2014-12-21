var false_todo = [
  {
    'ID' : 'id99999999999999',
    'state' : 'LIVE',
    'contents' : 'テストToDo01テストToDo01テストToDo01'
  },
  {
    'ID' : 'id99999999999998',
    'state' : 'DEAD',
    'contents' : 'テストToDo02テストToDo02テストToDo02'
  }
];

(function($){
  var app = {

    $submitButton: '',
    $lists: '',

    init: function(){
      this.$submitButton = $('input[type="button"]');
      this.$lists = $('.todos');

      this.$submitButton.on('click', $.proxy(this.submitHundler, this));
      this.$lists.find('li').click($.proxy(this.toggleClass, this));

      if(window.false_todo){
        this.show(false_todo);
      }
    },

    submitHundler: function(e){
      console.log(this);
      var data = this.setData(e);

      return false;
    },

    setID: function(){
      var now = new Date().getTime();
      return now;
    },

    setData: function(e){
      var ID = this.setID();
      var contents = $(e.currentTarget).parent().find('input[type="text"]').val();
      var toDo = {
        'ID' : ID,
        'state': 'LIVE',
        'contents' : contents
      };
    },

    show: function(data){
      $.each(data, function(i,item){
        var newDom = '<li class="'+ data[i].state +
            '"id="' + data[i].ID +'">' +
                data[i].contents +
                '</li>';
        $('.todos').append( newDom );
      })
    },

    toggleClass: function(e){
      if($(e.currentTarget).hasClass('LIVE')){
        console.log(999);
        $(this).removeClass('LIVE').addClass('DEAD');
      } else if($(e.currentTarget).hasClass('DEAD')){
        $(this).removeClass('DEAD').addClass('LIVE');
      }
    }
  };
  $(function(){
    app.init();
  })
})(jQuery);


