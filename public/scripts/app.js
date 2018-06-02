$(() => {
  getDocs(getComments);
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
});

const getComments = (doc_id, $doc_div) => {
  $.ajax({
      method: "GET",
      url: "/api/comments"
    })
    .done((comments) => {
      comments.forEach((packet) => {
        if (doc_id === packet.url_id) {
          const $user = $('<h2>')
          const $comment = $("<div>")
            .text(packet.comment)
            .addClass('comment')
            .addClass('toggleHidden')
            .insertBefore($doc_div.children('.postComment'))
        }
      });

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
        $resource.appendTo('.container');

      });


      $('.postComment')
      .on('submit', function (event) {
        event.preventDefault()
        $.ajax({
          method: "POST",
          url: '/api/comments',
          data: {
            comment: $(this).children('textarea')
            .val(),
            url_id: $(this)
            .data('url_id')
          }
        })
        console.log($(this).children('textarea')
        .val())
        })
      $('.viewComment')
        .on('click', function (event) {
          event.preventDefault()
          $(this)
            .parents('.resource')
            .children('.toggleHidden')
            .slideToggle();
        });
    });;
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
    $heart = $('<img>')
    .attr('src', './images/heart.svg')
    .addClass('heart')
  return $('<footer>')
    .append($arrow, $comment, $heart);
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
