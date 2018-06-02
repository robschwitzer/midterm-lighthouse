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

    })
});

const getComments = (doc_id, $doc_div) => {
  $.ajax({
      method: "GET",
      url: "/api/comments"
    })
    .done((comments) => {
      comments.forEach((packet) => {
        if (doc_id === packet.url_id) {
          const $comment = $("<div>")
            .text(packet.comment)
            .appendTo($doc_div)
            .addClass('comment')
            .addClass('toggleHidden');
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

        cb(doc.id, $resource);
        $resource.appendTo('.container');

      });


      $('.resource')
        .append($createCommentBox());
      $('.postComment')
        .on('submit', function (event) {
          event.preventDefault()
          $.ajax({
            method: "POST",
            url: '/api/comments',
            data: $(this)
              .serialize()
          });
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

//const postComment = () => {}


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
