$(() => {
  if (!$('#myDocs')
    .data('user-id')) {
    fadeInLoginForm(true)
  }

  fadeInLoginForm();
  slideUpResMaker();
  postDoc();
  getMyDocs();
  logoutAjax();
  getDocs(getComments);
  search();
  loginAjax();
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

const fadeInLoginForm = (locked) => {
  if (locked) {
    $('.loginForm')
      .fadeIn();
  }
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
        topic: $(this).children('select').val()
      };
      getDocs(getComments, search);
    });
}

const getMyDocs = () => {
  $('#myDocs')
    .click(function () {
      $.ajax({
          method: "GET",
          url: `/api/users/${$(this).data('user-id')}/docs`
        })
        .done((docs) => {
          makeDocs(docs, getComments)
        });;
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
          getCommentUserName($user, packet);
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

const getCommentUserName = ($user, packet) => {

  const route = `/api/users/doc/${packet.url_id}/comment/${packet.commenter_id}`
  $.ajax({
      method: "GET",
      url: route
    })
    .done((commenter) => {
      if(commenter){
      $user.text(commenter.name)
      }
    });;
}

const getDocs = (cb, search) => {

  const route = search !== undefined ? `/api/docs/search/${search.topic}-:${search.query}` : `/api/docs`

  $.ajax({
      method: "GET",
      url: route
    })
    .done((docs) => {
      makeDocs(docs, cb)
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

const postDoc = () => {
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
            creator_id: $('#myDocs')
              .data('user-id')
          }
        })
        .done((url_id) => {
          tagTopic($('.selectTopic').val(), url_id[0])
          getDocs(getComments);
          $('.add-box')
            .slideToggle('slow');
        })
    });
}

const tagTopic = (topic_id, doc_id) => {
  $.ajax({
      method: 'POST',
      url: `/api/topics/${topic_id}/docs/${doc_id}`
    })
    .done((results) => {

    })
}
const PostComment = () => {
  $('.postComment')
    .on('submit', function (event) {
      event.preventDefault();
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

const makeDocs = (docs, cb) => {
  $('.resource')
    .remove();
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
      .append($createHeader(doc.title, doc.id), $description, $urlContainer, $createFooter(doc))
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
const addTopicText = ($topic, doc_id) => {
  $.ajax({
      method: 'GET',
      url: `/api/topics/docs/${doc_id}`
    })
    .done((results) => {
      if(results){
      $topic.text(`---${results.topic}`)
      }
    })
}
const $createHeader = (title, doc_id) => {
  const $title = $("<h1>")
    .text(title),
    $topic = $("<h3>");
  addTopicText($topic, doc_id)
  return $("<header>")
    .append($title, $topic);
}

const $createFooter = (doc) => {
  $comment = $('<img>')
    .attr('src', './images/plus.svg')
    .addClass('viewComment'),
    $arrow = rank(doc);
  $unrank = unrank(doc);
  $heart = heart(doc);
  $blackheart = blackheart(doc);
  isLiked(doc, $blackheart, $heart);
  isRanked(doc, $arrow);
  return $('<footer>')
    .append($arrow, $unrank, $comment, $heart, $blackheart);
}

const rank = (doc) => {
  return $arrow = $('<img>')
    .data('rank', 'unRanked')
    .attr('src', './images/arrow-up.svg')
    .addClass('arrow')
    .css('opacity', '.5')
    .on('click', function () {
      if ($(this)
        .css("opacity") == 0.5) {
        $.ajax({
            method: 'POST',
            url: `/api/ranks/${doc.id}`
          })
          .done(() => {
            $(this)
              .css('opacity', '1')
              .data("rank", "ranked");
            getDocs(getComments)
          })
      }
    })
}

const unrank = (doc) => {
  return $arrow
    .on('click', function () {
      if ($(this)
        .css("opacity") == 1) {
        $.ajax({
            method: 'DELETE',
            url: `/api/ranks/${doc.id}`
          })
          .done(() => {
            $(this)
              .css('opacity', '0.5')
              .data("rank", "unRanked");
            getDocs(getComments);
          })
      }

    })

}

const blackheart = (doc) => {
  return $blackheart = $('<img>')
    .attr('src', './images/blackheart.svg')
    .addClass('blackheart')
    .css('display', 'none')
    .on('click', function () {
      $.ajax({
          method: 'DELETE',
          url: `/api/likes/${doc.id}`
        })
        .done()
      $(this)
        .hide();
      $(this)
        .parent('footer')
        .children('.heart')
        .show();
    })
}

const heart = (doc) => {
  return $heart = $('<img>')
    .attr('src', './images/heart.svg')
    .addClass('heart')
    .css('display', 'block')
    .on('click', function () {
      $.ajax({
          method: 'POST',
          url: `/api/likes/${doc.id}`
        })
        .done(() => {
          $(this)
            .hide();
          $(this)
            .parent('footer')
            .children('.blackheart')
            .show();
        })

    })
}

const isLiked = (doc, $heart, $blackheart) => {
  $.ajax({
      method: 'GET',
      url: `/api/likes/${doc.id}`
    })
    .done((results) => {
      if (results.count === '0') {
        $blackheart.css('display', 'block');
        $heart.css('display', 'none');
      } else {
        $blackheart.css('display', 'none');
        $heart.css('display', 'block');
      }
    });
}

const isRanked = (doc, $arrow) => {
  $.ajax({
      method: 'GET',
      url: `/api/ranks/${doc.id}`
    })
    .done((results) => {
      if (results.count === '0') {
        $arrow.css('opacity', '.5');
      } else {
        $arrow.css('opacity', '1');
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
