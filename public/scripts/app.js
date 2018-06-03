$(() => {
  getDocs(getComments);
  search();
  fadeInLoginForm();
  slideUpResMaker();


  $('.addButton')
    .on('click', function (event) {
      event.preventDefault();
      $.ajax({
        method: "POST",
        url: '/api/docs',
        data: {
          title: $('#title')
            .val(),
          description: $('#desc')
            .val(),
          url: $('#url')
            .val(),
          created_at: '2018-06-18',
          creator_id: 2
        }
      })
      .done(() => {
        getDocs(getComments);
        $('.add-box')
        .slideToggle('slow');
      })
    });

  $('.loginButton')
    .on('click', function (event) {
      event.preventDefault();
      $('.password')
        .css('color', 'blue')
      $.ajax({
        method: 'POST',
        url: '/api/login',
        data: {
          email: $('.email')
            .val(),
          password: $('.password')
            .val()
        }
      });
    });
});

const slideUpResMaker = () => {
  $('.add-resource')
    .on('click', function (event) {
      event.preventDefault();
      $('.add-box')
        .slideToggle('slow');
    });
}

const fadeInLoginForm = () => {
  $("#navLoginButton")
    .on('click', function () {
      $('.loginForm')
        .fadeToggle();
    });
}

const search = () => {
  $('#search')
    .on('submit', function (event) {
      event.preventDefault();
      const search = {
        query: $('#search input')
          .val(),
        topic: $('#search .searchTopic')
          .val()
      };
      getDocs(getComments, search);

    });
}

const getComments = (doc_id, $doc_div, postingComment) => {
  $.ajax({
      method: "GET",
      url: "/api/comments"
    })
    .done((comments) => {
      const ifHidden = postingComment ? '' : 'toggleHidden';
      const $commentContainer = $('<div>');

      comments.forEach((packet) => {
        if (doc_id === packet.url_id) {
          const $user = $('<h2>')
            .text('that guy'); // place holer until users are implemented
          const $description = $('<p>')
            .text(packet.comment);
          $("<div>")
            .addClass('comment')
            .addClass(ifHidden)
            .append($user, $description)
            .appendTo($commentContainer)
        }
      });
      $commentContainer.insertBefore($doc_div.children('.postComment'));


    });
}

const getDocs = (cb, search) => {
  $('.resource')
    .remove();
  const route = search !== undefined ? `/api/docs/search/${search.topic}-:${search.query}` : `/api/docs`

  $.ajax({
      method: "GET",
      url: route
    })
    .done((docs) => {
      docs.forEach((doc) => {
        const $description = $("<p>")
          .addClass('desc')
          .text(doc.description);
        const $url = $("<a>")
          .text(doc.url)
          .attr('href', doc.url),
          $urlContainer = $('<p>')
          .append($url);
        const $resource = $('<div>')
          .append($createHeader(doc.title), $description, $urlContainer, $createFooter())
          .addClass('resource');
        const $commentBox = $createCommentBox();
        $commentBox.data('url_id', doc.id);
        $resource
          .append($commentBox);
        cb(doc.id, $resource);
        $resource.insertAfter('.search');
      });
      toggleCommentVisibility();
      PostComment();
    });;
}

const toggleCommentVisibility = () => {
  $('.viewComment')
    .on('click', function (event) {
      event.preventDefault()
      $(this)
        .parents('.resource')
        .children('div')
        .children('.comment')
        .slideToggle();
      $(this)
        .parents('.resource')
        .children('.toggleHidden')
        .slideToggle();
    });
}

const PostComment = () => {
  $('.postComment')
    .on('submit', function (event) {
      event.preventDefault()
      $.ajax({
          method: "POST",
          url: '/api/comments',
          data: {
            comment: $(this)
              .children('textarea')
              .val(),
            url_id: $(this)
              .data('url_id')
          }
        })
        .done(() => {
          $(this)
            .parents('.resource')
            .children('div')
            .children('.comment')
            .remove();
          getComments($(this)
            .data("url_id"), $(this)
            .parents('.resource'), true);
          $(this)
            .children('textarea')
            .val('');
        });
    });
}

const $createHeader = (title) => {
  const $title = $("<h1>")
    .text(title),
    $topic = $("<h3>")
    .text()
  return $("<header>")
    .append($title, $topic);
}

const $createFooter = () => {
  const $arrow = $('<img>')
    .attr('src', './images/arrow-up.svg')
    .addClass('arrow'),
    $comment = $('<img>')
    .attr('src', './images/plus.svg')
    .addClass('viewComment'),
    $blackheart = $('<img>')
    .attr('src', './images/blackheart.svg')
    .addClass('heart')
    .css('display', 'none')
    .on('click', function () {
      $heart.toggle()
      $blackheart.css('display', 'none')
    }),
    $heart = $('<img>')
    .attr('src', './images/heart.svg')
    .addClass('heart')
    .on('click', function () {
      $blackheart.toggle()
      $heart.css('display', 'none')
    })
  return $('<footer>')
    .append($arrow, $comment, $heart, $blackheart);
}

const $createCommentBox = () => {
  const $textArea = $('<textarea>')
    .attr('name', 'comment'),
    $input = $('<input>')
    .attr('type', 'submit');
  return $('<form>')
    .attr('method', 'POST')
    .attr('action', '/api/comments')
    .append($textArea, $input)
    .addClass('postComment')
    .addClass('toggleHidden');

}
