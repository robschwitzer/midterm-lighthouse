$(() => {
  getDocs(getComments);
  $('#search').on('submit', function (event) {
    event.preventDefault();
    const search = { 
      query: $('#search input').val(),
      topic: $('#search .topic').val()
    };
    getDocs(getComments, search);
  })
});

const getComments = (doc_id, $doc_div) => {
  $.ajax({
    method: "GET",
    url: "/api/comments"
  }).done((comments) => {
    comments.forEach((packet) => {
      if(doc_id === packet.url_id) {
        $comment = $("<div>")
        .text(packet.comment)
        .appendTo($doc_div)
        .addClass('comment');
      }
    });
  });
}

const getDocs = (cb, search) => {
  $('.main').empty();
  const route = search !== undefined ? `/api/docs/search/${search.topic}-:${search.query}` : `/api/docs`

  $.ajax({
    method: "GET",
    url: route
  }).done((docs) => {
    docs.forEach((doc) => {
      const $title = $("<h1>").text(doc.title),
        $topic = $("<h3>").text(),
        $header = $("<header>").append($title, $topic);

      const $description = $("<p>").addClass('desc').text(doc.description);
        
      const $url = $("<a>").text(doc.url).attr('href', doc.url),
        $urlContainer = $('<p>').append($url);

      const $arrow = $('<img>').attr('src', '../images/arrow-up.svg').addClass('arrow'),
        $comment = $('<img>').attr('src', '../images/plus.svg').addClass('comment'),
        $heart = $('<img>').attr('src', '../images/heart.svg').addClass('heart'),
        $footer = $('<footer>').append($arrow, $comment, $heart);

      const $resource = $('<div>').append($header, $description, $urlContainer, $footer).addClass('resource');
      
        cb(doc.id, $resource);
      $resource.appendTo('.main');
    });
  });;
}