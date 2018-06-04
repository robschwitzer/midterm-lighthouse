$(() => {
  getDocs(getComments);
  search();
  fadeInLoginForm();
  slideUpResMaker();
  logoutAjax();
  loginAjax();
  searchByUser();

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
});

const loginAjax = () => {
  $('#loginFormBody')
    .on('submit', function (event) {
      event.preventDefault();
      $.ajax({
          method: 'POST',
          url: '/api/login',
          data: $(this)
            .serialize()
        })
        .done((user) => {
          const $logout = $('<li>')
            .attr('id', 'navLogoutButton')
            .text('Logout')
          const $email = $('<li>')
            .attr('id', 'useremail')
            .text(user.email)
          $('.nav')
            .children()
            .remove();
          $('.nav')
            .append($logout, $email)
          $('.loginButton')
            .on('click')
          $('.loginForm')
            .fadeOut('slow');
          logoutAjax(); //rebinding
          searchByUser(); //rebinding
        });
        getDocs(getComments);
    });
}

const logoutAjax = () => {
  $('#navLogoutButton')
    .on('click', function (event) {
      event.preventDefault();
      $.ajax({
          method: 'DELETE',
          url: '/api/login',
        })
        .done(() => {
          const $login = $('<li>')
            .attr('id', 'navLoginButton')
            .text('Login')
          const $register = $('<li>')
            .attr('id', 'register')
            .text('register')
          $('.nav')
            .children()
            .remove();
          $('.nav')
            .append($login, $register);
          fadeInLoginForm(); //rebinding
        });
        getDocs(getComments);
    });
}

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

const searchByUser = () => {
  $('#useremail')
    .click(function () {
      console.log($(this)
        .data())
      $.ajax({
          method: "GET",
          url: `/api/users/${$(this).val()}/docs`
        })
        .done((docs) => {
          makeDocs(docs, getComments);
        });;
    });
}

const getDocs = (cb, search) => {
  $('.resource')
    .remove();
  const route = search !== undefined ? `/api/docs/search/${search.topic}-:${search.query}` : `/api/docs`;

  $.ajax({
      method: "GET",
      url: route
    })
    .done((docs) => {
      makeDocs(docs, cb);
    });;
}
const makeDocs = (docs, cb) => {
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
      .append($createHeader(doc.title), $description, $urlContainer, $createFooter(doc))
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

const $createFooter = (doc) => {
  const $arrow = $('<img>')
    .attr('src', './images/arrow-up.svg')
    .addClass('arrow'),
    $comment = $('<img>')
    .attr('src', './images/plus.svg')
    .addClass('viewComment'),
    $heart = heart(doc);
    $blackheart = blackheart(doc);
    isLiked(doc, $blackheart, $heart);
  return $('<footer>')
    .append($arrow, $comment, $heart, $blackheart);
}
const blackheart = (doc) => {
  return $blackheart = $('<img>')
    .attr('src', './images/blackheart.svg')
    .addClass('blackheart')
    .css('display', 'none')
    .on('click', function () {
      $.ajax ({
        method: 'DELETE',
        url: `/api/likes/${doc.id}`
      })
      .done()
        $(this).hide();
        $(this).parent('footer').children('.heart').show();
    })
}

const heart = (doc) => {
  return $heart = $('<img>')
    .attr('src', './images/heart.svg')
    .addClass('heart')
    .css('display', 'block')
    .on('click', function () {
      $.ajax ({
        method: 'POST',
        url: `/api/likes/${doc.id}`
      })
      .done(() => {
        $(this).hide();
        $(this).parent('footer').children('.blackheart').show();
      })

    })
}

const isLiked = (doc, $heart, $blackheart) => {
  let like = false;
  $.ajax ({
    method: 'GET',
    url: `/api/likes/${doc.id}`
  })
    .done((results) => {
    if(results.count === '0') {
    console.log(results.count)
    $blackheart.css('display', 'block');
    $heart.css('display', 'none');
  } else {
    $blackheart.css('display', 'none');
    $heart.css('display', 'block');
  }
  });
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
